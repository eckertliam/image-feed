import crypto from 'node:crypto';
import { pool } from './db';
import { getUserId, isBanned, associateUsername, getUsername } from './userMngr';
import { saveImage, insertImage, deleteImage, getImages } from './imageMngr';

export interface Post {
    images: string[];
    caption: string;
    username: string;
    sign: string;
}

// make a post
export async function makePost(fingerprint: number, imageBuffer: Buffer, caption: string, username: string): Promise<void> {
    const imageUUID: string = await saveImage(imageBuffer);
    const userId: number = await getUserId(fingerprint);
    if (await isBanned(userId)) {
        console.error('User is banned');
        return;
    }
    return new Promise((resolve: any, reject: any) => {
        pool.query('INSERT INTO posts (user_id, caption) VALUES (?, ?)', [userId, caption], async (err: any, results: any) => {
            if (err) {
                // delete the image
                deleteImage(imageUUID);
                reject(err);
            } else {
                const postId: number = results.insertId;
                insertImage(postId, imageUUID);
                associateUsername(userId, username, postId);
                resolve();
            }
        });
    });
}

// load posts for users feed
export async function loadPosts(fingerprint: number, postCount: number): Promise<Post[]> {
    return new Promise((resolve: any, reject: any) => {
        // select fresh posts from the database
        pool.query('SELECT * FROM posts ORDER BY post_id DESC LIMIT ?', [postCount], async (err: any, results: any) => {
            if (err) {
                reject(err);
            } else {
                // if there are no posts, return an empty array
                if (results.length === 0) {
                    resolve([]);
                }
                const posts: Post[] = await Promise.all(results.map(async (result: any) => {
                    const images: string[] = await getImages(result.post_id);
                    const username: string = await getUsername(result.post_id);
                    // sign is 16 char hash of username and fingerprint
                    const sign: string = crypto.pbkdf2Sync(username, fingerprint.toString(), 100000, 16, 'sha256').toString('hex');
                    return {
                        images,
                        caption: result.caption,
                        username,
                        sign,
                    };
                }));
                resolve(posts);
            }
        });
    });
}
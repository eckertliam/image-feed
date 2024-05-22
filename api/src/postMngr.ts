import { pool } from './db';
import { getUserId, isBanned } from './userMngr';
import { saveImage, insertImage, deleteImage } from './imageMngr';

// make a post
export async function makePost(fingerprint: number, imageBuffer: Buffer, caption: string): Promise<void> {
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
                await insertImage(postId, imageUUID);
                resolve();
            }
        });
    });
}

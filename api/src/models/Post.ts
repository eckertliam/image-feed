import pool from "./db";

export interface Post {
    id: number;
    userId: number;
    caption: string;
    createdAt?: string;
}


// make a post
export async function newPost(userId: number, caption: string): Promise<Post> {
    return new Promise((resolve: any, reject: any) => {
        pool.query('INSERT INTO posts (user_id, caption) VALUES (?, ?)', [userId, caption], (err: any, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: results.insertId,
                    userId,
                    caption,
                });
            }
        });
    });
}

// get a post (currently gets the freshest post but will be changed to handle a few different algos)
export async function getPost(): Promise<Post> {
    return new Promise((resolve: any, reject: any) => {
        pool.query('SELECT * FROM posts ORDER BY post_id DESC LIMIT 1', (err: any, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: results[0].post_id,
                    userId: results[0].user_id,
                    caption: results[0].caption,
                    createdAt: results[0].created_at
                });
            }
        });
    });
}
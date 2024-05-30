import pool from "./db";

export interface Username {
    id: number;
    username: string;
    userId: number;
    postId: number;
}

// register a username to a user id
export async function registerUsername(userId: number, username: string, postId: number): Promise<Username> {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO usernames (user_id, username, post_id) VALUES (?, ?, ?)', [userId, username, postId], (err: any, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: results.insertId,
                    username,
                    userId,
                    postId
                });
            }
        });
    });
}

// get a username from a post id
export async function getUsername(postId: number): Promise<Username> {
    return new Promise((resolve, reject) => {
        pool.query('SELECT username_id, user_id, username FROM usernames WHERE post_id = ?', [postId], (err: any, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: results[0].username_id,
                    username: results[0].username,
                    userId: results[0].user_id,
                    postId
                });
            }
        });
    });
}
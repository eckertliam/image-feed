import { pool } from './db';

// get a user id from a fingerprint or create a new user
export async function getUserId(fingerprint: number): Promise<number> {
    return new Promise((resolve, reject) => {
        pool.query('SELECT user_id FROM users WHERE fingerprint = ?', [fingerprint], (err: any, results: any) => {
            if (err) {
                reject(err);
            } else if (results.length > 0) {
                resolve(results[0].id);
            } else {
                pool.query('INSERT INTO users (fingerprint) VALUES (?)', [fingerprint], (err: any, results: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results.insertId);
                    }
                });
            }
        });
    });
}

// check if a user is banned
export async function isBanned(userId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM banned WHERE user_id = ?', [userId], (err: any, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.length > 0);
            }
        });
    });
}
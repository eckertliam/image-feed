import pool from "./db";

export interface User {
    id: number;
    fingerprint: number;
}

// initializes a new user in the db and returns the user object
export async function registerUser(fingerprint: number): Promise<User> {
    return new Promise((resolve, reject) => {
        pool.query('SELECT user_id FROM users WHERE fingerprint = ?', [fingerprint], (err: any, results: any) => {
            if (err) {
                reject(err);
            }else if (results.length > 0) {
                const user: User = {
                    id: results[0].user_id,
                    fingerprint
                };
                resolve(user);
            }else{
                pool.query('INSERT INTO users (fingerprint) VALUES (?)', [fingerprint], (err: any, results: any) => {
                    if (err) {
                        reject(err);
                    }else{
                        const user: User = {
                            id: results.insertId,
                            fingerprint
                        };
                        resolve(user);
                    }
                });
            }
        });
    });
}
import pool from "./db";

export interface User {
    id: number;
    fingerprint: number;
}

// initializes a new user in the db and returns the user object
export async function registerUser(fingerprint: number): Promise<User> {
    return new Promise((resolve, reject) => {
        pool.query('SELECT (user_id, fingerprint) FROM users WHERE fingerprint = ? IF(@@ROWCOUNT = 0) INSERT INTO users (fingerprint) VALUES (?)', [fingerprint, fingerprint], (err: any, results: any) => {
            if (err) {
                reject(err);
            } else {
                const user: User = {
                    id: results.insertId,
                    fingerprint
                };
                resolve(user);
            }
        });
    });
}
import pool from "./db";

export interface User {
    id: number;
    fingerprint: number;
}

export async function queryUserId(fingerprint: number): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
        pool.query('SELECT user_id FROM users WHERE fingerprint = ?', [fingerprint], (err: any, results: any) => {
            if (err) {
                reject(err);
            }else if (results.length > 0) {
                resolve(results[0].user_id);
            }else{
                resolve(undefined);
            }
        });
    });
}

export async function inserUser(fingerprint: number): Promise<number> {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (fingerprint) VALUES (?)', [fingerprint], (err: any, results: any) => {
            if (err) {
                reject(err);
            }else{
                resolve(results.insertId);
            }
        });
    });
}

// initializes a new user in the db and returns the user object
export async function registerUser(fingerprint: number): Promise<User> {
    try {
        let userId = await queryUserId(fingerprint);
        if (userId === undefined) {
            userId = await inserUser(fingerprint);
        }
        return {
            id: userId,
            fingerprint
        };
    } catch (err) {
        throw new Error(`Error registering user: ${err}`);
    }
}
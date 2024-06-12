import mysql from 'mysql2';
require('dotenv').config();

export default class Database {
    private pool: mysql.Pool;

    constructor(pool: mysql.Pool | null = null) {
        if (pool) {
            this.pool = pool;
        }else{
            this.pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                connectionLimit: 10
            })
        }
    }

    query(sql: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, (err: any, results: any[]) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(results);
                }
            })
        })
    }
}

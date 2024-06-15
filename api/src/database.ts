import { createPool, Pool, QueryResult } from "mysql2";

export default class Database {
    private pool: Pool;

    constructor(port: number, host: string, user: string, password: string, database: string, connectionLimit: number) {
        this.pool = createPool({
            port,
            host,
            user,
            password,
            database,
            connectionLimit
        });
    }

    public query(sql: string, values: Array<any>): Promise<QueryResult> {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, values, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });
    }

    public close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.pool.end((err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }


}
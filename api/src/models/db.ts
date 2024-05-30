import mysql from 'mysql2';
require('dotenv').config();

// provides simple connection pooling

const pool: mysql.Pool = mysql.createPool({
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10
});

export default pool;
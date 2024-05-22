import crypto from 'node:crypto';
import fs from 'node:fs';
import { imageDir } from './index';
import { pool } from './db';

// saves the image to fs and returns the UUID
export async function saveImage(imageBuffer: Buffer): Promise<string> {
    const uuid: string = crypto.randomBytes(16).toString('hex');
    fs.writeFileSync(`${imageDir}/${uuid}.png`, imageBuffer, 'base64');
    return uuid;
}

// delete an image from the fs
export async function deleteImage(imageUUID: string): Promise<void> {
    fs.unlinkSync(`${imageDir}/${imageUUID}.png`);
}

// insert an image into the database
export async function insertImage(postId: number, imageUUID: string): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO images (post_id, image_name) VALUES (?, ?)', [postId, imageUUID], (err: any, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


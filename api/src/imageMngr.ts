import crypto from 'node:crypto';
import fs from 'node:fs';
import { imageDir } from './index';
import { pool } from './db';

// saves the image to fs and returns the UUID
export async function saveImage(imageBuffer: Buffer): Promise<string> {
    const uuid: string = crypto.randomBytes(16).toString('hex');
    fs.writeFileSync(`${imageDir}/${uuid}.jpeg`, imageBuffer, 'base64');
    return uuid;
}

// delete an image from the fs
export async function deleteImage(imageUUID: string): Promise<void> {
    fs.unlinkSync(`${imageDir}/${imageUUID}.jpeg`);
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

async function imageToBase64(imagePath: string): Promise<string> {
    const imageBuffer: Buffer = await fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
}

// get all images for a post and return them as an array of base64 strings
export async function getImages(postId: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
        pool.query('SELECT image_name FROM images WHERE post_id = ?', [postId], (err: any, results: any) => {
            if (err) {
                reject(err);
            } else {
                const imageNames: string[] = results.map((result: any) => result.image_name);
                const bufferPromises: Promise<string>[] = imageNames.map((imageName: string) => imageToBase64(`${imageDir}/${imageName}.png`));
                return Promise.all(bufferPromises).then((buffers: string[]) => {
                    resolve(buffers);
                });
            }
        });
    });
}
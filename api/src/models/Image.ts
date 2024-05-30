import pool from './db';
import fs from 'node:fs/promises';
import { imageDir } from '../index';
import crypto from 'node:crypto';

export interface Image {
    id: number;
    postId: number;
    imageName: string;
}

// save the image to fs and return the UUID
export async function saveImage(imageBuffer: Buffer): Promise<string> {
    const uuid: string = crypto.randomBytes(16).toString('hex');
    fs.writeFile(`${imageDir}/${uuid}.jpeg`, imageBuffer, 'base64');
    return uuid;
}

// delete an image from the fs
export async function deleteImage(imageName: string): Promise<void> {
    fs.rm(`${imageDir}/${imageName}.jpeg`);
}

// insert a new image into the database
export async function newImage(postId: number, imageBuffer: Buffer): Promise<Image> {
    const imageName = await saveImage(imageBuffer);
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO images (post_id, image_name) VALUES (?, ?)', [postId, imageName], (err: any, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: results.insertId,
                    postId,
                    imageName
                });
            }
        });
    });
}

// get all images for a post
export async function getImages(postId: number): Promise<Image[]> {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM images WHERE post_id = ?', [postId], (err: any, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.map((result: any) => {
                    return {
                        id: result.image_id,
                        postId,
                        imageName: result.image_name
                    };
                }));
            }
        });
    });
}

// convert an image to base64
export async function imageToBase64(imageName: string): Promise<string> {
    const imageBuffer: Buffer = await fs.readFile(`${imageDir}/${imageName}.jpeg`);
    return imageBuffer.toString('base64');
}
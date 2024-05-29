import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import bodyParser from 'body-parser';
import { makePost, loadPosts, Post } from './postMngr';

const upload = multer()
const jsonParser = bodyParser.json();
const workDir = path.join(__dirname, '../');
export const imageDir = path.join(workDir, 'images');

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}

require('dotenv').config({ path: workDir + '/.env' });

const app = express();
app.use(cors());

app.post('/api/make-post', upload.single('image'), async (req: any, res: any) => {
    console.log('Received a request to make a post');
    if (!req.body) {
        res.status(400).send('Bad request missing body');
        console.error('Bad request missing body');
    }else if (!req.file) {
        res.status(400).send('Bad request missing file');
        console.error('Bad request missing file');
    }else if (!req.file.buffer) {
        res.status(400).send('Bad request missing file buffer');
        console.error('Bad request missing file buffer');
    }else if (!req.body.fingerprint) {
        res.status(400).send('Bad request missing fingerprint');
        console.error('Bad request missing fingerprint');
    }else if (!req.body.caption) {
        res.status(400).send('Bad request missing caption');
        console.error('Bad request missing caption');
    }else if (!req.body.username) {
        res.status(400).send('Bad request missing username');
        console.error('Bad request missing username');
    }
    const fingerprint: number = Number(req.body.fingerprint);
    const imageBuffer: Buffer = req.file.buffer;
    const caption: string = req.body.caption;
    const username: string = req.body.username;
    await makePost(fingerprint, imageBuffer, caption, username);
    res.status(200).send('OK');
    console.log('Post made');
});

app.post('/api/load-posts', jsonParser, async (req: any, res: any) => {
    if (!req.body || !req.body.fingerprint || !req.body.postCount) {
        return;
    }
    const fingerprint: number = Number(req.body.fingerprint);
    const postCount: number = Number(req.body.postCount);
    const posts: Post[] = await loadPosts(fingerprint, postCount);
    // send a 200 response with the posts as JSON
    res.status(200).json({posts});
});

app.listen(process.env.API_PORT, () => {
    console.log(`Server is running on port ${process.env.API_PORT}`);
});
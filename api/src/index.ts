import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { makePost } from './postMngr';

const upload = multer()
const workDir = path.join(__dirname, '../');
export const imageDir = path.join(workDir, 'images');

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}

require('dotenv').config({path: workDir + '/.env'});

const app = express();
app.use(cors());

app.post('/api/post', upload.single('image'), async (req: any, res: any) => {
    const fingerprint: number = Number(req.body.fingerprint);
    const imageBuffer: Buffer = req.file.buffer;
    const caption: string = req.body.caption;
    await makePost(fingerprint, imageBuffer, caption);
    res.status(200).send('OK');
});

app.listen(process.env.API_PORT, () => {
    console.log(`Server is running on port ${process.env.API_PORT}`);
});
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import bodyParser from 'body-parser';
import makePost from './routes/makePost';
import loadPost from './routes/loadPost';

const upload = multer()
const jsonParser = bodyParser.json();
const workDir = path.join(__dirname, '../');
export const imageDir = path.join(workDir, 'images');

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}

require('dotenv').config({ path: workDir + '/.env' });

export const app = express();
app.use(cors());

app.post('/api/make-post', upload.single('image'), makePost);

app.post('/api/load-posts', jsonParser, loadPost);

app.listen(process.env.API_PORT, () => {
    console.log(`Server is running on port ${process.env.API_PORT}`);
});
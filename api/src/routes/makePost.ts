import { User, registerUser } from "../models/User";
import { Post, newPost } from "../models/Post";
import { registerUsername } from "../models/Username";
import { newImage } from "../models/Image";

export default async function makePost(req: any, res: any): Promise<void> {
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
    const user: User = await registerUser(fingerprint);
    const imageBuffer: Buffer = req.file.buffer;
    const caption: string = req.body.caption;
    const username: string = req.body.username;
    const post: Post = await newPost(user.id, caption);
    await registerUsername(user.id, username, post.id);
    await newImage(post.id, imageBuffer);
    res.status(200).send('OK');
    console.log('Post made');
}
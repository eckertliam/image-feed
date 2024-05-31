import { User, registerUser } from "../models/User";
import { Post, newPost } from "../models/Post";
import { registerUsername } from "../models/Username";
import { newImage } from "../models/Image";

function validateRequest(req: any, res: any): boolean {
    const requiredBodyFields: string[] = ['fingerprint', 'caption', 'username'];
    const requiredFileFields: string[] = ['buffer'];

    for (const field of requiredBodyFields) {
        if (!req.body[field]) {
            res.status(400).send(`Bad request missing ${field}`);
            console.error(`Bad request missing ${field}`);
            return false;
        }
    }

    for (const field of requiredFileFields) {
        if (!req.file[field]) {
            res.status(400).send(`Bad request missing ${field}`);
            console.error(`Bad request missing ${field}`);
            return false;
        }
    }

    return true;
}


export default async function makePost(req: any, res: any): Promise<void> {
    if (!validateRequest(req, res)) {
        return;
    }

    const fingerprint: number = Number(req.body.fingerprint);
    const caption: string = req.body.caption;
    const username: string = req.body.username;
    const imageBuffer: Buffer = req.file.buffer;
    
    const user: User = await registerUser(fingerprint);
    const post: Post = await newPost(user.id, caption);
    await registerUsername(user.id, username, post.id);
    await newImage(post.id, imageBuffer);
    res.status(200).send('OK');
}
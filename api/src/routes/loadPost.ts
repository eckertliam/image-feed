import { Post, getPost } from '../models/Post';
import { Image, getImages, imageToBase64 } from '../models/Image';
import { Username, getUsername } from '../models/Username';
import crypto from 'node:crypto';


// interface defining the response post
interface PostResponse {
    images: string[];
    caption: string;
    username: string;
    sign: string;
}

function validateRequest(req: any, res: any): boolean {
    const requiredFields: string[] = ['fingerprint'];

    for (const field of requiredFields) {
        if (!req.body[field]) {
            res.status(400).send(`Bad request missing ${field}`);
            console.error(`Bad request missing ${field}`);
            return false;
        }
    }

    return true;
}

export default async function loadPost(req: any, res: any): Promise<void> {
    if (!validateRequest(req, res)) {
        return;
    }

    const fingerprint: number = Number(req.body.fingerprint);
    const post: Post = await getPost();
    const images: Image[] = await getImages(post.id);
    
    // convert images to base64
    const imageB64: string[] = await Promise.all(images.map(async (image: Image) => {
        return await imageToBase64(image.imageName);
    }));

    const usernameObj: Username = await getUsername(post.id);
    const sign: string = crypto.pbkdf2Sync(usernameObj.username, fingerprint.toString(), 100000, 4, 'sha256').toString('hex');
    const postResponse: PostResponse = {
        images: imageB64,
        caption: post.caption,
        username: usernameObj.username,
        sign
    };
    res.status(200).json(postResponse);
}
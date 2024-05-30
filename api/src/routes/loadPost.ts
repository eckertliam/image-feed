import { Post, getPost } from '../models/Post';
import { Image, getImages, imageToBase64 } from '../models/Image';
import { Username, getUsername } from '../models/Username';
import crypto from 'node:crypto';


// interface defining the response post
export interface ResponsePost {
    images: string[];
    caption: string;
    username: string;
    sign: string;
}


export default async function loadPost(req: any, res: any): Promise<void> {
    console.log('Received a request to load a post');
    if (!req.body) {
        res.status(400).send('Bad request missing body');
        console.error('Bad request missing body');
    }else if (!req.body.fingerprint) {
        res.status(400).send('Bad request missing fingerprint');
        console.error('Bad request missing fingerprint');
    }
    const fingerprint: number = Number(req.body.fingerprint);
    const post: Post = await getPost();
    const images: Image[] = await getImages(post.id);
    // convert images to base64
    const imageStrings: string[] = await Promise.all(images.map(async (image: Image) => {
        return await imageToBase64(image.imageName);
    }));
    const usernameObj: Username = await getUsername(post.id);
    const sign: string = crypto.pbkdf2Sync(usernameObj.username, fingerprint.toString(), 100000, 16, 'sha256').toString('hex');
    const responsePost: ResponsePost = {
        images: imageStrings,
        caption: post.caption,
        username: usernameObj.username,
        sign
    };
    res.status(200).json(responsePost);
    console.log('Post loaded');
}
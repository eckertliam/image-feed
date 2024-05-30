// this is a script to be run to initialize the API with some data
// it will simulate a user creating a new account and adding some data
import crypto from 'crypto';
import fs from 'fs';
import fetch, {File, FormData, fileFromSync} from 'node-fetch';

const API_URL = 'http://localhost:8080/api';

// read random image from images folder as File
async function getRandomImage() {
    const images = fs.readdirSync('./images');
    const randomImage = images[Math.floor(Math.random() * images.length)];
    return fileFromSync(`./images/${randomImage}`);
};


// generate a 32 bit int randomly for the fingerprint
async function generateFingerprint() {
    return crypto.randomBytes(4).readInt32BE(0, true);
}

// generate a random username 
async function generateUsername() {
    return crypto.randomBytes(4).toString('utf-8');
}

// generate a random caption
async function generateCaption() {
    return crypto.randomBytes(8).toString('utf-8');
}


// create a new user post
async function generatePost() {
    const [username, image, fingerprint, caption] = await Promise.all([generateUsername(), getRandomImage(), generateFingerprint(), generateCaption()]);
    
    const post = {
        username,
        image,
        fingerprint,
        caption
    };

    return post;
}

// send a fetch request to the API to create a new user using form data
async function createPost() {
    const formData = new FormData();
    const post = await generatePost();
    formData.append('username', post.username);
    formData.append('image', post.image),
    formData.append('fingerprint', post.fingerprint);
    formData.append('caption', post.caption);
    const response = await fetch(`${API_URL}/make-post`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}

// create n posts 
async function initPosts(n) {
    return Promise.all(Array(n).fill().map(() => createPost()));
}

// create 10 posts
(async () => {
    await initPosts(10);
    console.log('Created 10 posts');
})();
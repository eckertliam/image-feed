import React, { useState, useContext } from "react";
import Post, {PostProps} from "./Post";
import getFingerprint from "./fingerprint";



interface FeedState {
    loadedPosts: PostProps[];
    idx: number;
}

export default function Feed(): JSX.Element {
    const [feedState, setFeedState] = useState<FeedState>({
        loadedPosts: [],
        idx: 0
    });

    async function loadPosts(): Promise<void> {
        // send fingerprint and post count to server
        const fingerprint = await getFingerprint();
        const postCount = 1;
        const response = await fetch('http://localhost:8080/api/load-posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({fingerprint, postCount})
        });
        if (response.status !== 200) {
            console.log('Failed to load posts');
            return;
        }
        const {posts} = await response.json();
        setFeedState({
            loadedPosts: feedState.loadedPosts.concat(posts),
            idx: 0
        });
    }

    if (feedState.loadedPosts.length === 0) {
        loadPosts();
    }

    function currentPost(): PostProps {
        const post = feedState.loadedPosts[feedState.idx];
        if (post === undefined) {
            return {
                images: [],
                username: 'loading...',
                sign: 'loading...',
                caption: 'loading...'
            };
        }else{
            return post;
        }
    }

    const {images, username, sign, caption} = currentPost();

    return (
        <div><Post images={images} username={username} sign={sign} caption={caption}/></div>
    );
}
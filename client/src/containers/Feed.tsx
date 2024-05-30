import React, { useState } from "react";
import Post, {PostProps} from "../components/Post";
import { getFingerprint, BASE_URL } from "../utils";

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
        const fingerprint: number = await getFingerprint();
        const response = await fetch(`${BASE_URL}/load-posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({fingerprint})
        });
        if (response.status !== 200) {
            console.log('Failed to load posts');
            return;
        }
        const posts: PostProps[] = await response.json();
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
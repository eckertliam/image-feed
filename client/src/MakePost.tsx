import React, { useState, useContext } from "react";
import { SetApp } from "./App";
import getFingerprint from "./fingerprint";
import "./style/MakePost.css";

interface UploadState {
    image: File | null;
    caption: string;
    username: string;
}

export default function MakePost(): JSX.Element {
    const setApp = useContext(SetApp);
    const [uploadState, setUploadState] = useState<UploadState>({
        image: null,
        caption: '',
        username: ''
    });

    (async () => {
        const preview = document.getElementById('preview');
        if (preview) {
            preview.setAttribute('display', 'none');
        }
    })();

    async function sendPost(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const formData = new FormData();
        let image: File;
        if (uploadState.image) {
            image = uploadState.image;
        } else {
            console.error('No image uploaded');
            return;
        }
        formData.append('image', image);
        formData.append('caption', uploadState.caption);
        formData.append('username', uploadState.username);
        formData.append('fingerprint', (await getFingerprint()).toString());
        const response = await fetch('http://localhost:8080/api/make-post', {
            method: 'POST',
            body: formData
        });
        if (response.status === 200) {
            setApp({ currentPage: <h1>Upload successful</h1> });
        } else if (response.status === 403) {
            setApp({ currentPage: <h1>You have been banned.</h1> });
        } else if (response.status === 404) {
            setApp({ currentPage: <h1>Unavailable</h1> });
        }
    }

    return (
        <div className="makepost">
            <form onSubmit={sendPost}>
                <label htmlFor="file-upload" className="file-upload-label">Upload an image</label>
                <input id="file-upload" type="file" name="image" accept="image/*" required onChange={
                    (event: React.ChangeEvent<HTMLInputElement>) => {
                        if (event.target.files && event.target.files[0]) {
                            setUploadState({
                                image: event.target.files[0],
                                caption: uploadState.caption,
                                username: uploadState.username
                            });
                            // set image preview to the uploaded image
                            const preview: Element | null = document.getElementById('preview');
                            if (preview) {
                                const imageUrl = URL.createObjectURL(event.target.files[0]);
                                preview.setAttribute('src', imageUrl);
                                preview.setAttribute('display', 'contents');
                            }
                        }
                    }
                } />
                <br />
                <img id="preview" />
                <br />
                <input className="caption-input" type="text" name="caption" placeholder="Caption" required onChange={
                    (event: React.ChangeEvent<HTMLInputElement>) => {
                        setUploadState({
                            image: uploadState.image,
                            caption: event.target.value,
                            username: uploadState.username
                        });
                    }

                } />
                <br />
                <input className="username-input" type="text" name="username" placeholder="Username" required onChange={
                    (event: React.ChangeEvent<HTMLInputElement>) => {
                        setUploadState({
                            image: uploadState.image,
                            caption: uploadState.caption,
                            username: event.target.value
                        });
                    }

                } />
                <br />
                <button className="post-btn" type="submit">Post</button>
            </form>
        </div>
    );
}
import React, { useState } from "react";
import "../style/MakePost.css";
import { BASE_URL, getFingerprint } from "../utils";
import { useNavigate } from "react-router-dom";

interface UploadState {
    image: File | null;
    caption: string;
    username: string;
}

export default function MakePost(): JSX.Element {
    const [uploadState, setUploadState] = useState<UploadState>({
        image: null,
        caption: '',
        username: ''
    });

    const navigate = useNavigate();

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
        const response = await fetch(`${BASE_URL}/make-post`, {
            method: 'POST',
            body: formData
        });
        if (response.status === 200) {
            navigate('/feed');
        }else {
            console.error('Failed to make post');
            navigate('/feed');
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
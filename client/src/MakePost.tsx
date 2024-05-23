import React, { useState, useContext } from "react";
import { SetApp } from "./App";
import getFingerprint from "./fingerprint";

interface UploadState {
    image: File;
    caption: string;
    username: string;
}

export default function MakePost(): JSX.Element {
    const setApp = useContext(SetApp);
    const [uploadState, setUploadState] = useState<UploadState>({
        image: new File([], ''), 
        caption: '',
        username: ''
    });

    async function sendPost(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image', uploadState.image);
        formData.append('caption', uploadState.caption);
        formData.append('username', uploadState.username);
        formData.append('fingerprint', (await getFingerprint()).toString());
        const response = await fetch('http://localhost:8080/api/make-post', {
            method: 'POST',
            body: formData
        });
        if (response.status === 200) {
            setApp({currentPage: <h1>Upload successful</h1>});
        } else if (response.status === 403) {
            setApp({currentPage: <h1>You have been banned.</h1>});
        } else if (response.status === 404) {
            setApp({currentPage: <h1>Unavailable</h1>});
        }
    }

    return (
        <div className="makepost">
            <h1>Post</h1>
            <form onSubmit={sendPost}>
                <input type="file" name="image" accept="image/*" required onChange={
                    (event: React.ChangeEvent<HTMLInputElement>) => {
                        if (event.target.files) {
                            setUploadState({
                                image: event.target.files[0],
                                caption: uploadState.caption,
                                username: uploadState.username
                            });
                        }
                    }
                }/>
                <input type="text" name="description" required onChange={
                    (event: React.ChangeEvent<HTMLInputElement>) => {
                        setUploadState({
                            image: uploadState.image,
                            caption: event.target.value,
                            username: uploadState.username
                        });
                    }
                
                }/>
                <input type="text" name="username" required onChange={
                    (event: React.ChangeEvent<HTMLInputElement>) => {
                        setUploadState({
                            image: uploadState.image,
                            caption: event.target.value,
                            username: uploadState.username
                        });
                    }
                
                }/>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}
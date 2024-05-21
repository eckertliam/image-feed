import React, { useState, useContext } from "react";
import { SetApp } from "./App";

interface UploadState {
    image: File;
    description: string;
}

export default function Upload(): JSX.Element {
    const setApp = useContext(SetApp);
    const [uploadState, setUploadState] = useState<UploadState>({
        image: new File([], ''), 
        description: ''
    });

    async function sendPost(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image', uploadState.image);
        formData.append('description', uploadState.description);
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
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
        <React.StrictMode>
            <h1>Upload</h1>
            <form onSubmit={sendPost}>
                <input type="file" name="image" accept="image/*" required onChange={
                    (event: React.ChangeEvent<HTMLInputElement>) => {
                        if (event.target.files) {
                            setUploadState({
                                image: event.target.files[0],
                                description: uploadState.description,
                            });
                        }
                    }
                }/>
                <input type="text" name="description" required onChange={
                    (event: React.ChangeEvent<HTMLInputElement>) => {
                        setUploadState({
                            image: uploadState.image,
                            description: event.target.value,
                        });
                    }
                
                }/>
                <button type="submit">Upload</button>
            </form>
        </React.StrictMode>
    );
}
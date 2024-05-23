import React, {useState} from "react";

export interface PostProps {
    images: string[];
    username: string;
    sign: string;
    caption: string;
}


// images encoded as base64 strings
export default function Post({ images, username, sign, caption }: {images: string[], username: string, sign: string, caption: string}): JSX.Element {
    const [idx, setIdx] = useState<number>(0);
    
    const getImage = () => {
        const image = images[idx];
        if (image === undefined) {
            return '';
        }
        return image;
    }

    return (
        <div className="post">
            <img src={`data:image/png;base64,${getImage()}`} alt="post"/>
            <button onClick={() => {
                if (idx < images.length - 1) {
                    setIdx(idx + 1);
                }
            }}>Next</button>
            <button onClick={() => {
                if (idx > 0) {
                    setIdx(idx - 1);
                }
            }}>Previous</button>
            <p>{username} --- {sign}</p>
            <p>{caption}</p>
        </div>
    );
}
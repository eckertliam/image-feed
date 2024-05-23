import React, {useState} from "react";
import "./Post.css";

export interface PostProps {
    images: string[];
    username: string;
    sign: string;
    caption: string;
}


// images encoded as base64 strings
export default function Post({ images, username, sign, caption }: {images: string[], username: string, sign: string, caption: string}): JSX.Element {
    const [idx, setIdx] = useState<number>(0);
    
    
    // here I am adding the ability to cycle through images, but I believe this will not be implemented for some time
    const getImage = () => {
        const image = images[idx];
        if (image === undefined) {
            return '';
        }
        return image;
    }

    /*
    these functions will be used to cycle through images in the future
    const nextImage = () => {
        if (idx != images.length - 1) {
            setIdx(idx + 1);
        }
    }

    const prevImage = () => {
        if (idx != 0) {
            setIdx(idx - 1);
        }
    }
    */ 

    return (
        <div className="post">
            <img className="postImage" src={`data:image/png;base64,${getImage()}`} alt="post"/>
            <p>{username} --- {sign}</p>
            <p>{caption}</p>
        </div>
    );
}
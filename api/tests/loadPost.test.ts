import { Post, getPost } from '../src/models/Post';
import { Image, getImages, imageToBase64 } from '../src/models/Image';
import { Username, getUsername } from '../src/models/Username';
import { describe, test, expect, jest, beforeEach, afterAll } from "@jest/globals"
import crypto from 'node:crypto';
import loadPost from '../src/routes/loadPost';

jest.mock("../src/models/Post");
jest.mock("../src/models/Image");
jest.mock("../src/models/Username");

describe("loadPost", () => {
    let req: { body: any; }, res: any;

    beforeEach(() => {
        req = {
            body: {
                fingerprint: 123
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        (getPost as jest.Mock<typeof getPost>).mockResolvedValueOnce({
            id: 1,
            caption: "caption",
            userId: 1
        });
        (getImages as jest.Mock<typeof getImages>).mockResolvedValueOnce([{
            id: 1,
            postId: 1,
            imageName: "imageName"
        }]);
        (imageToBase64 as jest.Mock<typeof imageToBase64>).mockResolvedValueOnce("imageB64");
        (getUsername as jest.Mock<typeof getUsername>).mockResolvedValueOnce({
            id: 1,
            postId: 1,
            userId: 1,
            username: "username"
        });
    });

    test("missing fingerprint", async () => {
        delete req.body.fingerprint;
        await loadPost(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Bad request missing fingerprint");
    });

    test("load post", async () => {
        const post: Post = await getPost();
        const usernameObj: Username = await getUsername(post.id);
        const sign = crypto.pbkdf2Sync(usernameObj.username, req.body.fingerprint.toString(), 100000, 4, 'sha256').toString('hex');
        await loadPost(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            images: ["imageB64"],
            caption: "caption",
            username: "username",
            sign
        });
    });
});
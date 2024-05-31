import makePost from "../src/routes/makePost";
import { User, registerUser } from "../src/models/User";
import { Post, newPost } from "../src/models/Post";
import { registerUsername } from "../src/models/Username";
import { newImage } from "../src/models/Image"; 
import { describe, test, expect, jest, beforeEach, afterAll } from "@jest/globals"

jest.mock("../src/models/User");
jest.mock("../src/models/Post");
jest.mock("../src/models/Username");
jest.mock("../src/models/Image");

describe("makePost", () => {
    let req: { body: any; file: { buffer: any; }; }, res: any;

    beforeEach(() => {
        req = {
            body: {
                fingerprint: 123,
                caption: "caption",
                username: "username"
            },
            file: {
                buffer: Buffer.from("image")
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
        (registerUser as jest.Mock).mockClear();
        (newPost as jest.Mock).mockClear();
        (registerUsername as jest.Mock).mockClear();
        (newImage as jest.Mock).mockClear();
    });

    test("missing fingerprint", async () => {
        delete req.body.fingerprint;
        await makePost(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Bad request missing fingerprint");
    });

    test("missing caption", async () => {
        delete req.body.caption;
        await makePost(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Bad request missing caption");
    });

    test("missing image", async () => {
        delete req.file.buffer;
        await makePost(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Bad request missing buffer");
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
});
import registerUser from '../services/register.service';
import {Request, Response} from "express";
import {User} from "@prisma/client";

export default async function registerController(req: Request, res: Response): Promise<void> {
    try {
        const newUser: User = await registerUser(req.body);
        res.status(200).json(newUser);
    } catch (e: any) {
        if (e.message === "Invalid input data for register request") {
            res.status(400).json({error: e.message});
        } else {
            res.status(500).json({error: e.message});
        }
    }
}
import registerUser from '../services/register.service';
import {Request, Response} from "express";
import {Session} from "@prisma/client";

// registerController - sends back a session id if registration is successful
export default async function registerController(req: Request, res: Response): Promise<void> {
    try {
        const session: Session = await registerUser(req.body);
        res.status(200).json(session.sid);
    } catch (e: any) {
        if (e.message === "Invalid input data for register request") {
            res.status(400).json({error: e.message});
        } else {
            res.status(500).json({error: e.message});
        }
    }
}
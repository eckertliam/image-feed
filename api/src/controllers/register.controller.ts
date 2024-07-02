import registerService from '../services/register.service';
import {Request, Response} from "express";
import {Session} from "@prisma/client";

// registerController - sends back a session id if registration is successful
export default async function registerController(req: Request, res: Response): Promise<void> {
    try {
        const session: Session = await registerService(req.body);
        res.status(200).send(session.sid);
    } catch (e: any) {
        res.status(400).send(e);
    }
}
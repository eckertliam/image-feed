import loginService from "../services/login.service";
import {Request, Response} from "express";
import {Session} from "@prisma/client";

// loginController - sends back a session id if registration is successful
export default async function loginController(req: Request, res: Response): Promise<void> {
    try {
        const loginRes: Session | string = await loginService(req.body);
        if (typeof loginRes === "string") {
            res.status(400).json({error: loginRes});
        }else{
            const session: Session = loginRes;
            res.status(200).json({sid: session.sid});
        }
    } catch (e: any) {
        res.status(500).json({error: e.message});
    }
}
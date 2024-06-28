import {Session, User} from "@prisma/client";
import prisma from "../prisma";
import * as crypto from "node:crypto";

// expireOffset - 24hr expiration
const expireOffset: number = 24 * 60 * 60 * 1000;

// getExpiration - generate expiration for new session given the epoch for now
function getExpiration(now: number): Date {
    return new Date(now + expireOffset);
}

// generateSid - generate a session ID using the epoch for now and a random 16 bytes
function generateSid(now: number): string {
    const randBytes: string = crypto.randomBytes(16).toString("hex");
    const timestamp: string = now.toString(36);
    return `${randBytes}-${timestamp}`;
}

// getSession - checks for an existing session, if it exists returns that otherwise creates new session
export default async function getSession(user: User): Promise<Session> {
    const session: Session | null  = await prisma.session.findUnique({
        where: {
            userId: user.id,
        },
    });
    if (!session) {
        const now: number = Date.now();
        return prisma.session.create({
            data: {
                userId: user.id,
                sid: generateSid(now),
                expiresAt: getExpiration(now),
            }
        });
    }
    return session;
}
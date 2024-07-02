import {z} from "zod";
import prisma from "../prisma";
import {Session, User} from "@prisma/client";
import {userInputSchema, UserSchema} from "../schemas/user.schema";
import getSession from "./session.service";
import {hashPassword} from "./password.service";
export default async function loginService(input: any): Promise<Session | string> {
    try {
        let validatedInput: UserSchema = userInputSchema.parse(input);
        validatedInput.password = await hashPassword(validatedInput.password);
        const user: User | null = await prisma.user.findUnique({
            where: {
                username: validatedInput.username,
                password: validatedInput.password,
            }
        });
        if (user) {
            return await getSession(user);
        } else {
            return "No user found";
        }
    } catch (e) {
        if (e instanceof z.ZodError) {
            console.error("Validation failed with error", e);
            throw new Error("Invalid input data for register request");
        } else {
            throw e;
        }
    }
}
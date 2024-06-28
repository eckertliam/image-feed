import {z} from 'zod';
import prisma from "../prisma";
import {Session, User} from "@prisma/client";
import {userInputSchema, UserSchema} from "../schemas/user.schema";
import getSession from "./session.service";
import {hashPassword} from "./password.service";

// registerUser - returns user if registration occurs successfully otherwise throws err
export default async function registerUser(input: any): Promise<Session> {
    try {
        let validatedInput: UserSchema = userInputSchema.parse(input);
        validatedInput.password = await hashPassword(validatedInput.password);
        const newUser: User = await prisma.user.create({
            data: validatedInput,
        });
        return await getSession(newUser);
    } catch (e) {
        if (e instanceof z.ZodError) {
            console.error("Validation failed with error", e);
            throw new Error("Invalid input data for register request");
        }else{
            throw e;
        }
    }
}
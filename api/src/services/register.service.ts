import {z} from 'zod';
import prisma from "../prisma";
import {User} from "@prisma/client";
import {userInputSchema, UserSchema} from "../schemas/user.schema";

// registerUser - returns user if registration occurs successfully otherwise throws err
export default async function registerUser(input: any): Promise<User> {
    try {
        const validatedInput: UserSchema = userInputSchema.parse(input);
        return await prisma.user.create({
            data: validatedInput,
        });
    } catch (e) {
        if (e instanceof z.ZodError) {
            console.error("Validation failed with error", e);
            throw new Error("Invalid input data for register request");
        }else{
            throw e;
        }
    }
}
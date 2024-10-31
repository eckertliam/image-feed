import { z } from 'zod';

// TODO: Redo the schema to require the password to be input twice ensuring a match

/** A schema describing user register input */
export const registerInputSchema = z.object({
    username: z.string({
        required_error: "Username is required",
    }),
    email: z.string({
        required_error: "Email is required",
    }).email(),
    password: z.string({
        required_error: "Password is required",
    }).min(6, "Password must be at least 6 characters"),
});


/** Describes the schema of user register data sent over the wire */
export type RegisterSchema = z.infer<typeof registerInputSchema>;
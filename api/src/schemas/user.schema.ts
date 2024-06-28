import { z } from 'zod';

// userInputSchema - used to validate user input for logins and registrations
export const userInputSchema = z.object({
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

// UserSchema - the shape of user login and register data received over the wire
export type UserSchema = z.infer<typeof userInputSchema>;
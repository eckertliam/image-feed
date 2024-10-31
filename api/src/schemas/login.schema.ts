import { z } from 'zod';

/** A schema describing user login input */
export const loginInputSchema = z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string({
        required_error: "Password is required",
    }).min(6, "Password must be at least 6 characters"),
}).refine(data => data.username || data.email, {
    message: "Either username or email is required",
    path: ["username", "email"],
});

export type LoginSchema = z.infer<typeof loginInputSchema>;
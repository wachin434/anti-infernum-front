import { z } from "zod";

const dominiosValidos = new Set([
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "duocuc.cl"
]);

const userCredentials = z.object({
    email: z
        .email({ error: "El correo electrónico no es válido." })
        .refine((email) => {
            const dominio = email.split("@")[1];
            return dominiosValidos.has(dominio);
        }, { error: "El correo electrónico debe ser de dominio válido." }),
    contra: z
        .string({ error: "La contraseña debe ser texto." })
        .min(8, { error: "La contraseña debe tener al menos 8 caracteres." })
        .max(100, { error: "La contraseña no puede tener mas de 100 caracteres." }),
});

type UserCredentials = z.infer<typeof userCredentials>;

export {userCredentials, type UserCredentials}

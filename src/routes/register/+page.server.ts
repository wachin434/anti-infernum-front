import {addUser, findUserByEmail} from "$lib/data/users";
import { userPost } from "@/lib/schemas/userpost";
import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

const userRegister = userPost
    .extend({
        confirmPassword: z.string({ error: "La confirmación de la contraseña debe ser una cadena de texto." }).min(1, { error: "La confirmación de la contraseña es requerida." }),
    })
    .refine((data) => data.contra === data.confirmPassword, {
        message: "Las contraseñas no coinciden.",
        path: ["confirmPassword"], 
    });

export const actions = {
    register: async ({ request }: { request: Request }) => {
        const formData = await request.formData();
        const nombre = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const fechaRegistro = new Date(Date.now()).toISOString();

        const user = userRegister.safeParse({ nombre, email, contra: password, confirmPassword: confirmPassword, fechaRegistro });
        if (!user.success) {
            const fieldErrors = user.error.issues.reduce((acc, issue) => {
                const path = issue.path[0] as string;
                acc[path] = issue.message;
                return acc;
            }, {} as Record<string, string>);
            return fail(400, { 
                success: false,
                errors: fieldErrors,
            });
        }

        const { confirmPassword: _, ...userToPost } = user.data;
        try {
            let data = await addUser(userToPost);
            return data;
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            return fail(403, { error: 'Error al registrar usuario.' });
        }
    }
};

export const load: PageServerLoad = async ({parent}) => {
    if((await parent()).isAuthenticated) {
        throw redirect(303, "/");
    }
};

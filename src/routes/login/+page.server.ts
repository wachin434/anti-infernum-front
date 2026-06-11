import { login } from "@/lib/data/users";
import { userCredentials } from "@/lib/schemas/usercredentials";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    logout: async ({ cookies }) => {
        cookies.delete("session_token", { path: "/" });

        throw redirect(303, "/");
    },
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get("email") as string;
        const password = data.get("password") as string;

        const user = userCredentials.safeParse({ email, contra: password });
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
        try {
            let data = await login(user.data);
            if (data && data.token) {
                cookies.set("session_token", data.token, {
                    path: "/",
                    httpOnly: true,
                    sameSite: "strict",
                    secure: true,
                    maxAge: 60 * 60 * 24
                });
                return { success: true };
            } else {
                return fail(400, { error: "El backend no devolvió un token válido." });
            }
        } catch (error) {
            console.error("Error en login:", error);
            return fail(403, { error: 'Credenciales inválidas.' });
        }
    }
};

import { login } from "@/lib/data/users";
import { fail } from "@sveltejs/kit";

export const actions = {
    login: async ({ request }: { request: Request }) => {
        const formData = await request.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        console.log("Posteando: ", { email: email.trim(), password: password.trim() });

        if(!email.trim() || !password.trim()) {
            return fail(400, { error: 'Email y contraseña son obligatorios.' });
        }
        try {
            let data = await login(email.trim(), password.trim());
            return data;
        } catch (error) {
            console.error("Error en login:", error);
            return fail(403, { error: 'Credenciales inválidas.' });
        }
    }
};

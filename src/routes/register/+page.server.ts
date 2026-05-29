import {addUser, findUserByEmail} from "$lib/data/users";
import { fail, redirect } from "@sveltejs/kit";

let emailsValidos = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "duocuc.cl"];

export const actions = {
    register: async ({ request }: { request: Request }) => {
        const formData = await request.formData();
        const nombre = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const fechaRegistro = Date.now();

        console.log("Posteando: ", { nombre, email: email.trim(), contra: password.trim() , fechaRegistro });

        if (!nombre.trim() || !email.trim() || !password.trim()) {
            return fail(400, { error: 'Recuerda llenar todos los campos.' });
        }
        else if (!emailsValidos.some(dominio => email.trim().endsWith(`@${dominio}`))) {
            return fail(400, { error: 'El email debe ser de un dominio válido (gmail.com, yahoo.com, outlook.com, hotmail.com, duocuc.cl).' });
        }
        else if (password.trim() !== formData.get("confirmPassword")?.toString().trim()) {
            return fail(400, { error: 'Las contraseñas no coinciden.' });
        }
        try {
            const emailExists = await findUserByEmail(email.trim());
            if (emailExists) {
                return fail(400, { error: 'El email ya está registrado.' });
            }
            let data = await addUser({ nombre, email: email.trim(), contra: password.trim(), fechaRegistro });
            return data;
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            return fail(403, { error: 'Error al registrar usuario.' });
        }
    }
};

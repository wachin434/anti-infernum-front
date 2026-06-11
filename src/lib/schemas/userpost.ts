import { z } from "zod";
import { userCredentials } from "./usercredentials";
import { rol } from "./rol";

const userPost = userCredentials.extend({
    nombre: z
        .string({ error: "El nombre debe ser texto." })
        .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
        .max(50, { error: "El nombre no puede tener mas de 50 caracteres." }),
    fechaRegistro: z
    .iso.datetime({ error: "La fecha de registro debe ser una fecha válida." }),
});

type UserPost = z.infer<typeof userPost>;

export {userPost, type UserPost}

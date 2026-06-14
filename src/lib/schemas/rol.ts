import {z} from "zod";

const rol = z.object({
    id: z.uuid({ error: "El ID debe ser un UUID válido." }),
    nombre: z
        .string({ error: "El nombre del rol debe ser texto." })
        .min(2, { error: "El nombre del rol debe tener al menos 2 caracteres." })
        .max(50, { error: "El nombre del rol no puede tener mas de 50 caracteres." }),
});

type Rol = z.infer<typeof rol>;

export {rol, type Rol};

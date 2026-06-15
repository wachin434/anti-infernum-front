import { z } from "zod";
import { userCredentials } from "./usercredentials";

const login = userCredentials.omit({contra:true}).extend({
    token: z.jwt({alg: 'HS256', error: 'El token no es válido.'}),
})

type Login = z.infer<typeof login>;

export { login, type Login };

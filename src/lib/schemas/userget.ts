import { z } from 'zod';
import { userPost } from './userpost';
import { rol } from './rol';

const userGet = userPost.omit({contra:true}).extend({
    id: z.uuid({ error: "El ID debe ser un UUID válido." }),
    roles: z.array(rol)
})

type UserGet = z.infer<typeof userGet>;

export {userGet, type UserGet}

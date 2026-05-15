
export const addUser = async (user) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/usuarios`, {
    body: JSON.stringify(user),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(res);
};

export const findUserByEmail = async (email) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/usuarios/email/${encodeURIComponent(email)}`);
  if (res.status === 404) {
    return false;
  }
  if (!res.ok) {
    throw new Error(`Error buscando usuario: ${res.status}`);
  }
  const data = await res.json();
  return Boolean(data);
};

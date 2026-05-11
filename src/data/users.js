export const users = [
  { email: "admin@example.com", password: "123456", name: "Admin" }
];

export const addUser = (user) => {
  users.push(user);
};

export const findUserByEmail = (email) => {
  return users.find((u) => u.email === email);
};
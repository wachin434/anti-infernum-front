'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/register.module.css';
import { addUser, findUserByEmail } from '../../data/users';
//esto era para probar usuarios locales, pero no alcanzamos a hacerlo xd 👀👀👀
//necesito contexto de ese void

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    const exists = findUserByEmail(email);

    if (exists) {
      setError('Este correo ya está registrado. Inicia sesión.');
      return;
    }

    addUser({ name, email, password });
    setError('');
    alert('Registro exitoso');
  };

  return (
    <div className={styles.addUser}>
      <h3>Sign Up</h3>

      <form className={styles.addUserForm}>
        <div className={styles.inputGroup}>
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email:</label>
          <input
            type="email"
            placeholder="Ingresa tu email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Contraseña:</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña super segura 👌"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className={styles.error}>{error}</p>}

          <button type="button" className={styles.loginBtn} onClick={handleRegister}>
            Registrar
          </button>
        </div>
      </form>

      <div className={styles.login}>
        <p>Ya tienes una cuenta?</p>
        <button className={styles.loginBtn}>
            Login
        </button>
      </div>
    </div>
  );
}

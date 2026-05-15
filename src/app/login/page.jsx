'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/register.module.css';
import { findUserByEmail, login } from '../../data/users';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const trimmed = email.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  };

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Ingresa un email válido.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const exists = await findUserByEmail(email);
      if (!exists) {
        setError('Este correo no está registrado. Regístrate.');
        return;
      }

      const data = await login(email, password);
      localStorage.setItem('session', JSON.stringify(data));
      window.dispatchEvent(new Event('sessionChanged'));
      router.push('/');
    } catch (error) {
      console.error(error);
      setError('Ocurrió un error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  

  return (
    <div className={styles.addUser}>
      <h3>Login</h3>

      <form className={styles.addUserForm}>
        <div className={styles.inputGroup}>

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

          <button
            type="button"
            className={styles.loginBtn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </form>

      <div className={styles.login}>
        <p>No tienes una cuenta?</p>
        {/* No tienes cam? ¡Comprala!
        noooo guitar xdddd */}

        <Link href="/register">
          <button className={styles.loginBtn}>
            Registrate
          </button>
        </Link>
      </div>
    </div>
  );
}


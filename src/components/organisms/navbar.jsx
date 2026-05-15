'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/navbar.module.css';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('session');
    setIsLoggedIn(Boolean(session));

    const handleSessionChange = () => {
      const session = localStorage.getItem('session');
      setIsLoggedIn(Boolean(session));
    };

    window.addEventListener('sessionChanged', handleSessionChange);
    return () => window.removeEventListener('sessionChanged', handleSessionChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('session');
    setIsLoggedIn(false);
    alert('Sesión cerrada');
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <div className={styles.logo}>Anti-Infernum</div>
      </Link>
      <div className={styles.navLinks}>
        <div className={styles.link}>Incendios</div>
        <div className={styles.link}>Lugares Seguros</div>
        <div className={styles.link}>Alertas</div>
        {!isLoggedIn ? (
          <>
            <Link href="/login">
              <div className={styles.link}>Login</div>
            </Link>
            <Link href="/register">
              <button className={styles.loginBtn}>
                Regístrate
              </button>
            </Link>
          </>
        ) : (
          <button className={styles.loginBtn} onClick={handleLogout}>
            Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
}


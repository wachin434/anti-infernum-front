import Link from 'next/link';
import styles from '../../styles/navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        Anti-Infernum
      </div>
      <div className={styles.navLinks}>
        <Link href="/">
          <div className={styles.link}>Inicio</div>
        </Link>
        <div className={styles.link}>Incendios</div>
        <div className={styles.link}>Lugares Seguros</div>
        <div className={styles.link}>Alertas</div>
        <button className={styles.loginBtn}>
            Login
        </button>
        <Link href="/register">
          <button className={styles.loginBtn}>
            Regístrate
          </button>
        </Link>
      </div>
    </nav>
  );
}

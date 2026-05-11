import styles from '../../styles/navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        Anti-Infernum
      </div>
      <div className={styles.navLinks}>
        <div className={styles.link}>Inicio</div>
        <div className={styles.link}>Incendios</div>
        <div className={styles.link}>Lugares Seguros</div>
        <div className={styles.link}>Alertas</div>
        <button className={styles.loginBtn}>
          Ingresar
        </button>
      </div>
    </nav>
  );
}

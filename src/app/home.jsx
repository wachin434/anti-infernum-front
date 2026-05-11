import styles from '../styles/home.module.css';

export default function Home() {
  return (
    <main className={styles.mainContainer}>
      <section className={styles.heroSection}>
        <div className={styles.alertBadge}>
          Estado: Monitoreo Activo
        </div>
        
        <h1 className={styles.title}>
          anti infernum <br/>
        </h1>
        
        <p className={styles.subtitle}>
          Plataforma inteligente para la gestión y prevención de incendios forestales y urbanos. [cite: 3, 4]
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className={styles.primaryButton}>
            Reportar Incendio
          </button>
          <button className={styles.primaryButton} style={{ background: '#333' }}>
            Ver Mapa de Riesgo
          </button>
        </div>
      </section>
    </main>
  )
}
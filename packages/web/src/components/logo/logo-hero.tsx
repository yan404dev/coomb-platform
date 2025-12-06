import { CoombIcon } from "./coomb-icon";
import styles from "./logo-hero.module.css";

export const LogoHero = () => {
  return (
    <div className={styles.logoHeroContainer}>
      <div className={styles.logoHeroBackground}>
        {/* Círculos decorativos de fundo */}
        <div className={`${styles.logoHeroCircle} ${styles.logoHeroCircle1}`}></div>
        <div className={`${styles.logoHeroCircle} ${styles.logoHeroCircle2}`}></div>
        <div className={`${styles.logoHeroCircle} ${styles.logoHeroCircle3}`}></div>

        {/* Linhas decorativas */}
        <div className={styles.logoHeroLines}>
          <div className={`${styles.logoHeroLine} ${styles.logoHeroLine1}`}></div>
          <div className={`${styles.logoHeroLine} ${styles.logoHeroLine2}`}></div>
          <div className={`${styles.logoHeroLine} ${styles.logoHeroLine3}`}></div>
        </div>

        {/* Partículas flutuantes */}
        <div className={`${styles.logoHeroParticle} ${styles.logoHeroParticle1}`}></div>
        <div className={`${styles.logoHeroParticle} ${styles.logoHeroParticle2}`}></div>
        <div className={`${styles.logoHeroParticle} ${styles.logoHeroParticle3}`}></div>
        <div className={`${styles.logoHeroParticle} ${styles.logoHeroParticle4}`}></div>

        {/* Logo principal */}
        <div className={styles.logoHeroIcon}>
          <CoombIcon className="w-full h-full" />
        </div>

        {/* Brilho e reflexo */}
        <div className={styles.logoHeroShine}></div>
      </div>
    </div>
  );
};

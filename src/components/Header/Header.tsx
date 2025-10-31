import styles from './header.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Пошук турів</h1>
    </header>
  );
}



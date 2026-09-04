import { Link } from 'react-router';
import styles from './DashboardPage.module.css';

type DashboardPageProps = {
  userName: string;
};

function DashboardPage({ userName }: DashboardPageProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span aria-hidden="true" className={styles.logo}>
              ÷
            </span>
            <span className={styles.brandName}>Expense Splitter</span>
          </div>
          <div
            aria-label={`Current profile: ${userName}`}
            className={styles.profile}
          >
            <span aria-hidden="true" className={styles.avatar}>
              {userName.charAt(0).toUpperCase()}
            </span>
            <span className={styles.userName}>{userName}</span>
          </div>
        </div>
      </header>

      <section className={styles.content}>
        <h1 className={styles.greeting}>Hi, {userName}</h1>
        <div className={styles.emptyState}>
          <h2>No groups yet</h2>
          <p className={styles.description}>
            Create a group to start splitting expenses.
          </p>
          <Link to="/groups/new" className={styles.createButton}>
            Create a group
          </Link>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;

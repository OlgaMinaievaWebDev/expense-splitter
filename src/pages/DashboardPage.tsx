import { Link } from 'react-router';
import type { Group } from '../types/group';
import styles from './DashboardPage.module.css';

type DashboardPageProps = {
  userName: string;
  groups: Group[];
  onLogout: () => void;
};

function DashboardPage({ userName, groups, onLogout }: DashboardPageProps) {
  const sortedGroups = [...groups].sort((firstGroup, secondGroup) => {
    const firstDate = new Date(firstGroup.createdAt).getTime();
    const secondDate = new Date(secondGroup.createdAt).getTime();

    return secondDate - firstDate;
  });
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
          <button type="button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <section className={styles.content}>
        <h1 className={styles.greeting}>Hi, {userName}</h1>
        {groups.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No groups yet</h2>
            <p className={styles.description}>
              Create a group to start splitting expenses.
            </p>
            <Link to="/groups/new" className={styles.createButton}>
              Create a group
            </Link>
          </div>
        ) : (
          <div>
            <div className={styles.groupsHeader}>
              <h2 className={styles.groupsTitle}>Your groups</h2>
              <Link to="/groups/new" className={styles.createAnotherLink}>
                Create another group
              </Link>
            </div>
            <ul className={styles.groupList}>
              {sortedGroups.map((group) => (
                <li key={group.id} className={styles.groupCard}>
                  <Link to={`/groups/${group.id}`} className={styles.groupLink}>
                    <h2 className={styles.groupName}>{group.name}</h2>
                    <p className={styles.groupMeta}>
                      Currency: {group.baseCurrency}
                    </p>
                    <p className={styles.groupMeta}>
                      {group.members.length > 1
                        ? `${group.members.length} members`
                        : `${group.members.length} member`}
                    </p>
                    <p className={styles.groupMeta}>
                      Created: {new Date(group.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;

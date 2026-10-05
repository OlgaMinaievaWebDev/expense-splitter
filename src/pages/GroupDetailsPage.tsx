import { Link, useParams } from 'react-router';
import type { Group } from '../types/group';
import styles from './GroupDetailsPage.module.css';

type GroupDetailsPageProps = {
  groups: Group[];
};

function GroupDetailsPage({ groups }: GroupDetailsPageProps) {
  const { groupId } = useParams<{ groupId: string }>();

  const selectedGroup = groups.find((group) => group.id === groupId);
  if (!selectedGroup)
    return (
      <div className={styles.page}>
        <Link to="/" className={styles.backLink}>
          Back to Dashboard
        </Link>
        <h1 className={styles.title}>Group not found</h1>
        <p>This group doesn’t exist or may have been deleted.</p>
      </div>
    );

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        Back to Dashboard
      </Link>
      <h1 className={styles.title}>{selectedGroup.name}</h1>
      <p className={styles.meta}>Base currency: {selectedGroup.baseCurrency}</p>
      <Link to={`/groups/${selectedGroup.id}/expenses/new`}>Add Expense</Link>
      <section className={styles.membersCard}>
        <h2 className={styles.sectionTitle}>Members</h2>
        <ul className={styles.memberList}>
          {selectedGroup.members.map((member) => (
            <li key={member.id} className={styles.memberItem}>
              {member.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default GroupDetailsPage;

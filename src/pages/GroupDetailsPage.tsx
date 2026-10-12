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

  const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: selectedGroup.baseCurrency,
  });
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  });

  const sortedExpenses = [...selectedGroup.expenses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        Back to Dashboard
      </Link>
      <h1 className={styles.title}>{selectedGroup.name}</h1>
      <p className={styles.meta}>Base currency: {selectedGroup.baseCurrency}</p>
      <Link
        to={`/groups/${selectedGroup.id}/expenses/new`}
        className={styles.addExpenseLink}
      >
        Add Expense
      </Link>
      <section className={styles.expensesCard}>
        <h2 className={styles.sectionTitle}>Expenses</h2>
        {selectedGroup.expenses.length === 0 ? (
          <p className={styles.emptyExpenses}>No expenses yet.</p>
        ) : (
          <ul className={styles.expenseList}>
            {sortedExpenses.map((expense) => {
              const payer = selectedGroup.members.find(
                (member) => member.id === expense.paidByMemberId
              );
              const participantCount = expense.participantIds.length;
              return (
                <li key={expense.id} className={styles.expenseItem}>
                  <h3 className={styles.expenseDescription}>
                    {expense.description}
                  </h3>
                  <p className={styles.expenseAmount}>
                    {currencyFormatter.format(expense.amountInCents / 100)}
                  </p>
                  <p className={styles.expenseMeta}>
                    Paid by: {payer?.name ?? 'Unknown member'}
                  </p>
                  <p className={styles.expenseMeta}>
                    Split between {participantCount}{' '}
                    {participantCount === 1 ? 'person' : 'people'}
                  </p>
                  <p className={styles.expenseMeta}>
                    Added {dateFormatter.format(new Date(expense.createdAt))}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
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

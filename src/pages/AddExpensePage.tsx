import { Link, useNavigate, useParams } from 'react-router';
import { useState, type SubmitEvent } from 'react';
import type { Group } from '../types/group';
import type { Expense } from '../types/expense';
import styles from './AddExpensePage.module.css';

type AddExpenseProps = {
  groups: Group[];
  onAddExpense: (groupId: string, expense: Expense) => void;
};
function AddExpensePage({ groups, onAddExpense }: AddExpenseProps) {
  const [participantError, setParticipantError] = useState('');
  const { groupId } = useParams<{ groupId: string }>();
  const matchingGroup = groups.find((group) => group.id === groupId);
  const navigate = useNavigate();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const description = formData.get('description');
    const amount = formData.get('amount');
    const paidByMemberId = formData.get('paidByMemberId');
    const participantIds = formData.getAll('participantIds');

    if (
      typeof description !== 'string' ||
      typeof amount !== 'string' ||
      typeof paidByMemberId !== 'string'
    )
      return;
    if (!participantIds.every((id) => typeof id === 'string')) return;
    if (participantIds.length === 0) {
      setParticipantError('Select at least one participant');
      return;
    }
    setParticipantError('');

    const normalizedDescription = description.trim();
    const numericAmount = Number(amount);
    const amountInCents = Math.round(numericAmount * 100);

    if (
      !normalizedDescription ||
      !Number.isFinite(numericAmount) ||
      amountInCents < 1
    )
      return;

    const expense: Expense = {
      id: crypto.randomUUID(),
      description: normalizedDescription,
      amountInCents,
      paidByMemberId,
      participantIds,
      createdAt: new Date().toISOString(),
    };
    if (!matchingGroup) return;
    onAddExpense(matchingGroup.id, expense);
    navigate(`/groups/${matchingGroup.id}`);
  };

  if (!matchingGroup) {
    return (
      <div className={styles.page}>
        <Link to="/" className={styles.backLink}>
          Back to Dashboard
        </Link>
        <h1 className={styles.title}>Group not found</h1>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to={`/groups/${matchingGroup.id}`} className={styles.backLink}>
        Back to group
      </Link>
      <h1 className={styles.title}>Add expense to {matchingGroup.name}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Expense details</legend>
          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <input
              className={styles.control}
              type="text"
              id="description"
              name="description"
              required
              placeholder="Dinner"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="amount" className={styles.label}>
              Amount ({matchingGroup.baseCurrency})
            </label>
            <input
              className={styles.control}
              type="number"
              id="amount"
              name="amount"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="paid-by" className={styles.label}>
              Paid by
            </label>
            <select
              name="paidByMemberId"
              id="paid-by"
              required
              defaultValue=""
              className={styles.control}
            >
              <option value="" disabled>
                Select payer
              </option>
              {matchingGroup.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </fieldset>
        <fieldset
          className={styles.fieldset}
          aria-describedby={participantError ? 'participant-error' : undefined}
        >
          <legend className={styles.legend}>Split between</legend>
          {matchingGroup.members.map((member) => (
            <div key={member.id} className={styles.participantRow}>
              <input
                className={styles.checkbox}
                id={`participant-${member.id}`}
                type="checkbox"
                name="participantIds"
                value={member.id}
                defaultChecked
              />
              <label
                htmlFor={`participant-${member.id}`}
                className={styles.participantLabel}
              >
                {member.name}
              </label>
            </div>
          ))}
          {participantError && (
            <p id="participant-error" role="alert" className={styles.error}>
              {participantError}
            </p>
          )}
        </fieldset>
        <button type="submit" className={styles.submitButton}>
          Add expense
        </button>
      </form>
    </div>
  );
}

export default AddExpensePage;

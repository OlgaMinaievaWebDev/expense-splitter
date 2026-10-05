import { Link, useNavigate, useParams } from 'react-router';
import { useState, type SubmitEvent } from 'react';
import type { Group } from '../types/group';
import type { Expense } from '../types/expense';

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
      <div>
        <p>Group not found</p>
        <Link to="/">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Add expense to {matchingGroup.name}</h1>
      <Link to={`/groups/${matchingGroup.id}`}>Back to group</Link>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Expense details</legend>
          <div>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              required
              placeholder="Dinner"
            />
          </div>
          <div>
            <label htmlFor="amount">
              Amount ({matchingGroup.baseCurrency})
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              required
            />
          </div>
          <div>
            <label htmlFor="paid-by">Paid by</label>
            <select name="paidByMemberId" id="paid-by" required defaultValue="">
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
          aria-describedby={participantError ? 'participant-error' : undefined}
        >
          <legend>Split between</legend>
          {matchingGroup.members.map((member) => (
            <div key={member.id}>
              <input
                id={`participant-${member.id}`}
                type="checkbox"
                name="participantIds"
                value={member.id}
                defaultChecked
              />
              <label htmlFor={`participant-${member.id}`}>{member.name}</label>
            </div>
          ))}
          {participantError && (
            <p id="participant-error" role="alert">
              {participantError}
            </p>
          )}
        </fieldset>
        <button type="submit">Add expense</button>
      </form>
    </div>
  );
}

export default AddExpensePage;

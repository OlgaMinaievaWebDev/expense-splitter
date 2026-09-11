import { useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import type { Group } from '../types/group';

type CreateGroupPageProps = {
  userName: string;
  onCreateGroup: (group: Group) => void;
};

const currencies = ['CAD', 'USD', 'EUR', 'GBP'];

function CreateGroupPage({ userName, onCreateGroup }: CreateGroupPageProps) {
  const [memberName, setMemberName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [memberError, setMemberError] = useState('');

  const navigate = useNavigate();

  const handleAddMember = () => {
    const sanitizedMemberName = memberName.trim();
    if (!sanitizedMemberName) {
      setMemberError('Enter a member name');
      return;
    }
    const existingNames = [userName, ...members];
    const nameExist = existingNames.some(
      (existingName) =>
        existingName.toLowerCase() === sanitizedMemberName.toLowerCase()
    );
    if (nameExist) {
      setMemberError('This person is already in the group');
      return;
    }
    setMembers((prevMembers) => [...prevMembers, sanitizedMemberName]);
    setMemberName('');
    setMemberError('');
  };

  const handleRemoveMember = (name: string) => {
    setMembers((prev) => prev.filter((member) => member !== name));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (members.length === 0) {
      setMemberError('Add at least one other member');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const formValues = {
      groupName: formData.get('groupName'),
      baseCurrency: formData.get('baseCurrency'),
    };

    if (
      typeof formValues.groupName !== 'string' ||
      typeof formValues.baseCurrency !== 'string'
    )
      return;

    const groupNameTrimmed = formValues.groupName.trim();
    if (groupNameTrimmed.length === 0) return;
    const normalizedFormValues = {
      groupName: groupNameTrimmed,
      baseCurrency: formValues.baseCurrency,
    };

    const group: Group = {
      id: crypto.randomUUID(),
      name: normalizedFormValues.groupName,
      baseCurrency: normalizedFormValues.baseCurrency,
      createdAt: new Date().toISOString(),
      members: [
        {
          id: crypto.randomUUID(),
          name: userName,
        },
        ...members.map((member) => ({
          id: crypto.randomUUID(),
          name: member,
        })),
      ],
    };
    onCreateGroup(group);
    navigate('/');
  };

  return (
    <div>
      <Link to="/">← Back to dashboard</Link>
      <h1>Create a group</h1>
      <p>Current user {userName} will be added automatically</p>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Group details</legend>
          <div>
            <label htmlFor="group-name">Group name</label>
            <input
              id="group-name"
              name="groupName"
              type="text"
              placeholder="Toronto trip"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="base-currency">Base currency</label>
            <select
              name="baseCurrency"
              id="base-currency"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select currency
              </option>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </fieldset>
        <fieldset>
          <legend>Members</legend>
          <p>{userName} (you)</p>
          <ul>
            {members.map((member) => (
              <li key={member}>
                <span>{member}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member)}
                  aria-label={`Remove ${member}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <label htmlFor="member-name">Add a member</label>
          <input
            id="member-name"
            name="memberName"
            type="text"
            placeholder="Member name"
            autoComplete="off"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            aria-invalid={Boolean(memberError)}
            aria-describedby={memberError ? 'member-name-error' : undefined}
            autoCapitalize="words"
          />
          {memberError && (
            <p id="member-name-error" role="alert">
              {memberError}
            </p>
          )}
          <button type="button" onClick={handleAddMember}>
            Add member
          </button>
        </fieldset>
        <button type="submit">Create group</button>
      </form>
    </div>
  );
}

export default CreateGroupPage;

import { useRef, useState, type SubmitEvent, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import type { Group } from '../types/group';
import styles from './CreateGroupPage.module.css';

type CreateGroupPageProps = {
  userName: string;
  groups: Group[];
  onCreateGroup: (group: Group) => void;
};

const currencies = ['CAD', 'USD', 'EUR', 'GBP'];

function CreateGroupPage({
  userName,
  groups,
  onCreateGroup,
}: CreateGroupPageProps) {
  const [memberName, setMemberName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [memberError, setMemberError] = useState('');
  const [groupNameError, setGroupNameError] = useState('');
  const groupNameInputRef = useRef<HTMLInputElement>(null);

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

  const handleMemberKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddMember();
    }
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

    const groupNameExists = groups.some(
      (group) =>
        group.name.trim().toLowerCase() === groupNameTrimmed.toLowerCase()
    );

    if (groupNameExists) {
      setGroupNameError('A group with this name already exists');
      groupNameInputRef.current?.focus();
      return;
    }

    setGroupNameError('');

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
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        ← Back to dashboard
      </Link>
      <h1 className={styles.title}>Create a group</h1>
      <p className={styles.intro}>
        Current user {userName} will be added automatically
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Group details</legend>
          <div className={styles.field}>
            <label htmlFor="group-name" className={styles.label}>
              Group name
            </label>
            <input
              ref={groupNameInputRef}
              id="group-name"
              name="groupName"
              type="text"
              placeholder="Toronto trip"
              required
              autoComplete="off"
              className={styles.control}
              onChange={() => {
                if (groupNameError) {
                  setGroupNameError('');
                }
              }}
              aria-invalid={Boolean(groupNameError)}
              aria-describedby={groupNameError ? 'group-name-error' : undefined}
            />
            {groupNameError && (
              <p id="group-name-error" role="alert" className={styles.error}>
                {groupNameError}
              </p>
            )}
          </div>
          <div className={styles.field}>
            <label htmlFor="base-currency" className={styles.label}>
              Base currency
            </label>
            <select
              name="baseCurrency"
              id="base-currency"
              required
              defaultValue=""
              className={styles.control}
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
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Members</legend>
          <p className={styles.currentUser}>{userName} (you)</p>
          <ul className={styles.memberList}>
            {members.map((member) => (
              <li key={member} className={styles.memberItem}>
                <span>{member}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member)}
                  aria-label={`Remove ${member}`}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <label htmlFor="member-name" className={styles.label}>
            Add a member
          </label>
          <div className={styles.memberControls}>
            <input
              id="member-name"
              name="memberName"
              type="text"
              placeholder="Member name"
              autoComplete="off"
              value={memberName}
              onChange={(event) => {
                setMemberName(event.target.value);

                if (memberError) {
                  setMemberError('');
                }
              }}
              onKeyDown={handleMemberKeyDown}
              aria-invalid={Boolean(memberError)}
              aria-describedby={memberError ? 'member-name-error' : undefined}
              autoCapitalize="words"
              className={styles.control}
            />
            <button
              type="button"
              onClick={handleAddMember}
              className={styles.addButton}
            >
              Add member
            </button>
          </div>
          {memberError && (
            <p id="member-name-error" role="alert" className={styles.error}>
              {memberError}
            </p>
          )}
        </fieldset>
        <button type="submit" className={styles.submitButton}>
          Create group
        </button>
      </form>
    </div>
  );
}

export default CreateGroupPage;

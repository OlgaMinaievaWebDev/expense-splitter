import { useState, type SubmitEvent } from 'react';
import styles from './WelcomePage.module.css';

type WelcomePageProps = {
  onContinue: (name: string) => void;
};

function WelcomePage({ onContinue }: WelcomePageProps) {
  const [name, setName] = useState('');

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onContinue(trimmedName);
  };

  return (
    <div className={styles.page}>
      <span aria-hidden="true" className={styles.logo}>
        ÷
      </span>
      <h1>Expense Splitter</h1>
      <p className={styles.tagline}>Split, Track, and Settle Up</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="name">What’s your name?</label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            type="text"
            placeholder="Enter your name"
            required
            autoComplete="name"
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submit}>
          Continue
        </button>
      </form>
    </div>
  );
}

export default WelcomePage;

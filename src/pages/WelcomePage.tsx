import styles from './WelcomePage.module.css';

function WelcomePage() {
  return (
    <div className={styles.page}>
      <span aria-hidden="true" className={styles.logo}>
        ÷
      </span>
      <h1>Expense Splitter</h1>
      <p className={styles.tagline}>Split, Track, and Settle Up</p>

      <form className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name">What’s your name?</label>
          <input
            id="name"
            name="name"
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

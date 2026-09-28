import { useState } from 'react';
import WelcomePage from './pages/WelcomePage';

const CURRENT_USER_STORAGE_KEY = 'expense-splitter-current-user';

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  });

  const handleContinue = (name: string) => {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, name);
    setCurrentUser(name);
  };

  return (
    <main>
      {currentUser ? (
        <h2>Welcome, {currentUser}</h2>
      ) : (
        <WelcomePage onContinue={handleContinue} />
      )}
    </main>
  );
}

export default App;

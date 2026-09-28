import { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';

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
        <DashboardPage userName={currentUser} />
      ) : (
        <WelcomePage onContinue={handleContinue} />
      )}
    </main>
  );
}

export default App;

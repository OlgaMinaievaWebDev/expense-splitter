import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import CreateGroupPage from './pages/CreateGroupPage';

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
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              <DashboardPage userName={currentUser} />
            ) : (
              <WelcomePage onContinue={handleContinue} />
            )
          }
        />
        <Route
          path="/groups/new"
          element={
            currentUser ? (
              <CreateGroupPage userName={currentUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </main>
  );
}

export default App;

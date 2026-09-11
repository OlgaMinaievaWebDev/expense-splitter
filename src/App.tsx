import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import CreateGroupPage from './pages/CreateGroupPage';
import type { Group } from './types/group';

const CURRENT_USER_STORAGE_KEY = 'expense-splitter-current-user';
const GROUPS_STORAGE_KEY = 'groups';

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  });
  const [groups, setGroups] = useState<Group[]>(() => {
    const storedGroups = localStorage.getItem(GROUPS_STORAGE_KEY);
    if (!storedGroups) {
      return [];
    }
    try {
      return JSON.parse(storedGroups) as Group[];
    } catch {
      localStorage.removeItem(GROUPS_STORAGE_KEY);
      return [];
    }
  });

  const handleContinue = (name: string) => {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, name);
    setCurrentUser(name);
  };

  const handleCreateGroup = (group: Group) => {
    setGroups((previousGroups) => {
      const updatedGroups = [...previousGroups, group];
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));
      return updatedGroups;
    });
  };

  return (
    <main>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              <DashboardPage userName={currentUser} groups={groups} />
            ) : (
              <WelcomePage onContinue={handleContinue} />
            )
          }
        />
        <Route
          path="/groups/new"
          element={
            currentUser ? (
              <CreateGroupPage
                userName={currentUser}
                onCreateGroup={handleCreateGroup}
              />
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

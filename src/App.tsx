import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import CreateGroupPage from './pages/CreateGroupPage';
import GroupDetailsPage from './pages/GroupDetailsPage';
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
      const parsedGroups: unknown = JSON.parse(storedGroups);
      if (!Array.isArray(parsedGroups)) {
        localStorage.removeItem(GROUPS_STORAGE_KEY);
        return [];
      }
      return parsedGroups as Group[];
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

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setCurrentUser(null);
  };

  return (
    <main>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              <DashboardPage
                userName={currentUser}
                groups={groups}
                onLogout={handleLogout}
              />
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
                groups={groups}
                onCreateGroup={handleCreateGroup}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/groups/:groupId"
          element={
            currentUser ? (
              <GroupDetailsPage groups={groups} />
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

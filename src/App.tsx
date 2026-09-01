import { useState } from 'react';
import WelcomePage from './pages/WelcomePage';

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleContinue = (name: string) => {
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

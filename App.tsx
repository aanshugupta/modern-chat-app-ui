
import React, { useState, useEffect, useCallback } from 'react';
import { User } from './types';
import AuthPage from './components/auth/AuthPage';
import ChatLayout from './components/chat/ChatLayout';
import { useMockData, initialUsers } from './hooks/useMockData';

export const AppContext = React.createContext<{
  toggleDarkMode: () => void;
  darkMode: boolean;
  currentUser: User | null;
  logout: () => void;
}>({
  toggleDarkMode: () => {},
  darkMode: false,
  currentUser: null,
  logout: () => {},
});


function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { users, ...chatData } = useMockData(currentUser);
  const [darkMode, setDarkMode] = useState(true);
  
  useEffect(() => {
    // Sync currentUser state if it's updated in the main users list (e.g., from profile update)
    if (currentUser) {
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users, currentUser]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    chatData.updateUser(updatedUser);
  };

  return (
    <AppContext.Provider value={{ toggleDarkMode, darkMode, currentUser, logout: handleLogout }}>
      <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
        {currentUser ? (
          <ChatLayout 
            user={currentUser} 
            allUsers={users}
            mockData={chatData}
            onUserUpdate={handleUpdateUser}
          />
        ) : (
          <AuthPage onLogin={handleLogin} mockUser={initialUsers[0]} />
        )}
      </div>
    </AppContext.Provider>
  );
}

export default App;
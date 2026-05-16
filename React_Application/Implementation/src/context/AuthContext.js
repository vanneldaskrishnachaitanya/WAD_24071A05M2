import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'eduexam-user';
const ACCOUNTS_STORAGE_KEY = 'eduexam-accounts';

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const MOCK_USER = {
  name: 'Arjun Sharma',
  email: 'arjun@example.com',
  avatar: 'AS',
  enrolled: ['Mathematics', 'Physics', 'Computer Science', 'Chemistry'],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage(USER_STORAGE_KEY, null));
  const [accounts, setAccounts] = useState(() => readStorage(ACCOUNTS_STORAGE_KEY, []));

  useEffect(() => {
    if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  const buildUser = (name, email) => {
    const emailPrefix = email.split('@')[0];
    const avatar = emailPrefix.slice(0, 2).toUpperCase();
    return { ...MOCK_USER, name, email, avatar, testScores: [] };
  };

  const login = (email, password) => {
    if (!email || !password || password.length < 4) return false;

    const savedAccount = accounts.find((account) => account.email === email);
    if (savedAccount) {
      if (savedAccount.password !== password) return false;
      setUser(buildUser(savedAccount.name || savedAccount.email, savedAccount.email));
      return true;
    }

    setUser(buildUser(email, email));
    return true;
  };

  const register = ({ name, email, password }) => {
    if (!name || !email || !password || password.length < 4) return false;
    if (accounts.some((account) => account.email === email)) return false;

    const nextAccount = { name, email, password };
    setAccounts([...accounts, nextAccount]);
    setUser(buildUser(name, email));
    return true;
  };

  const logout = () => setUser(null);

  const saveScore = (testData, pct, timeSpent) => {
    if (!user) return;
    const newScore = {
      id: `s${Date.now()}`,
      subject: testData.subject,
      test: testData.title,
      score: pct,
      total: 100,
      date: new Date().toISOString().split('T')[0],
      time: timeSpent,
      rank: Math.floor(Math.random() * 500) + 1,
    };
    setUser({ ...user, testScores: [...(user.testScores || []), newScore] });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, saveScore }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

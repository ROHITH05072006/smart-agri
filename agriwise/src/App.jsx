import React, { useState, useEffect } from 'react';
import LoginScreen from './pages/LoginScreen';
import AdminDashboard from './pages/AdminDashboard';
import FarmerDashboard from './pages/FarmerDashboard';

export default function App() {
  // 1. Initialize state from LocalStorage (if it exists)
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('appUserRole') || null;
  });
  
  const [lang, setLang] = useState('en');

  // 2. Whenever userRole changes, save it to LocalStorage
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('appUserRole', userRole);
    } else {
      localStorage.removeItem('appUserRole');
    }
  }, [userRole]);

  if (!userRole) {
    return <LoginScreen setUserRole={setUserRole} />;
  }

  if (userRole === 'admin') {
    return (
      <AdminDashboard 
        lang={lang} 
        setLang={setLang} 
        setUserRole={setUserRole} 
      />
    );
  }

  return (
    <FarmerDashboard 
      lang={lang} 
      setLang={setLang} 
      setUserRole={setUserRole} 
    />
  );
}
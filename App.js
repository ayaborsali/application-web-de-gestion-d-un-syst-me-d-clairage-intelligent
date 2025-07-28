import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResetPassword from './components/ResetPassword';
import Uploader from './Uploader';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import ForgetPassword from './components/ForgetPassword';
import MainApp from './MainApp';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Redirige vers /mainapp si déjà connecté */}
        <Route
          path="/signin"
          element={isAuthenticated ? <Navigate to="/mainapp" /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/mainapp" /> : <SignUp />}
        />
        <Route
          path="/forget-password"
          element={isAuthenticated ? <Navigate to="/mainapp" /> : <ForgetPassword />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/mainapp" /> : <SignIn />}
        />
        <Route
          path="/mainapp"
          element={isAuthenticated ? <MainApp /> : <Navigate to="/signin" />}
        />
          <Route
            path="/uploader"
            element={isAuthenticated ? <Uploader /> : <Navigate to="/signin" />}
        />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>  
    </Router>
  );
}

export default App;

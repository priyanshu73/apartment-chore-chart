// App.js
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './style.css';
import TaskTable from './components/TaskTable';
import Header from './components/Header'; 
import { Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';


import MainPage from './components/MainPage';

function App() {
  return (
    <>
    <GoogleOAuthProvider  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <div className="App">
    
    <Router>
    <ConditionalHeader />
        <Routes>
        <Route path="/" element={< MainPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/task" element={<TaskTable />} />
        </Routes>
      </Router>
      
    </div>
    </GoogleOAuthProvider>
    </>
  );
}

const ConditionalHeader = () => {
  const location = useLocation();
  
  // Check if the current path is the main page
  const isMainPage = location.pathname === '/';

  return !isMainPage ? <Header /> : null; // Render Header only if not on MainPage
};

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" replace />;
};

export default App;
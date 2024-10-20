// App.js
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './style.css';
import TaskTable from './components/TaskTable';
import Header from './components/Header'; 
import { Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';


function App() {
  return (
    <>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <div className="App">
    <Header />
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/task" element={<TaskTable />} />
        </Routes>
      </Router>
      
    </div>
    </GoogleOAuthProvider>
    </>
  );
}

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" replace />;
};

export default App;
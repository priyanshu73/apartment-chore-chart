// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css'; // Import custom styles for Home component

const MainPage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to the login route
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Apartment Chore Chart Management App!</h1>
      <p>Manage your chores effectively and keep your apartment tidy.</p>
      <button className="login-button" onClick={handleLoginRedirect}>
        Login
      </button>
    </div>
  );
};

export default MainPage;

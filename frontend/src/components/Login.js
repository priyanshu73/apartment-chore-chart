import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../style.css'; // Import the CSS file for styling

const Login = () => {
  const navigate = useNavigate();

  const onSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Email:', decoded.email);
    console.log('Name:', decoded.name);

    // Save user info to state or context
    localStorage.setItem('user', JSON.stringify(decoded));
    localStorage.setItem('name', decoded.name);
    
    // Redirect to dashboard
    navigate('/task');
  };

  const onError = () => {
    console.log('Login Failed');
  };

  return (
    <div className="login-container">
      <h2>Sign-In using your Google Account to get started</h2>
      <div className="google-login-wrapper">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          useOneTap
          className="custom-google-login" // Add a custom class here
        />
      </div>
    </div>
  );
};

export default Login;

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const onSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Email:', decoded.email);
    console.log('Name:', decoded.name);
    
    // Save user info to state or context
    // For example, using localStorage (not secure for sensitive data):
    localStorage.setItem('user', JSON.stringify(decoded));
    
    // Redirect to dashboard
    navigate('/task');
  };

  const onError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      useOneTap
    />
  );
};

export default Login;
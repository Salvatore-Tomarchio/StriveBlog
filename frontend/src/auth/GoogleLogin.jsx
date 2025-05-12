import React from "react";

const GoogleLogin = () => {
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return <button onClick={handleLogin}>Accedi con Google</button>;
};

export default GoogleLogin;

import React from "react";

const GoogleLogin = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:3002/auth/google";
  };

  return <button onClick={handleLogin}>Accedi con Google</button>;
};

export default GoogleLogin;

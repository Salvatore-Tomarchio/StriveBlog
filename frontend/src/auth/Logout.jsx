import React from "react";

const Logout = ({ setToken }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;

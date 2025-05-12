import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import BlogPost from "./views/blogpost/BlogPost";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Logout from "./auth/Logout";
import GoogleLogin from "./auth/GoogleLogin";
import ProtectedRoute from "./auth/ProtectedRoute";
import NewPost from "./views/new/New";
import Blog from "./views/blog/Blog";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [searchQuery, setSearchQuery] = useState("");

  // questa è la funzione che devi passare al NavBar
  const handleSearchChange = (value) => {
    console.log("Search query changed:", value);
    setSearchQuery(value);
  };

  useEffect(() => {
    // Estrai token dalla query string, es. /?token=...
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      setToken(urlToken);
      localStorage.setItem("token", urlToken);

      // Pulisci la query string (rimuove `?token=...`)
      window.history.replaceState({}, document.title, "/");
    } else {
      const local = localStorage.getItem("token");
      if (local) setToken(local);
    }
  }, []);

  return (
    <Router>
      <NavBar
        token={token}
        setToken={setToken}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />      
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery}/>} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blogpost/:id" element={<BlogPost />} />
        <Route
          path="/new"
          element={
            <ProtectedRoute token={token}>
              <NewPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/me"
          element={
            <ProtectedRoute token={token}>
              <Blog />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

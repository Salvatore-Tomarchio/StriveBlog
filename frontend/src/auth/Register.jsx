import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    data_di_nascita: "",
    avatar: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/authors`, formData);
      alert("Registrazione completata!");
    } catch (error) {
      alert("Errore nella registrazione");
    }
  };

  return (
    <div style={{ marginTop: "100px", padding: "2rem" }}>
      <form onSubmit={handleSubmit}>
        <h2>Registrati</h2>
        <input
          name="nome"
          placeholder="Nome"
          onChange={handleChange}
          required
        />
        <input
          name="cognome"
          placeholder="Cognome"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
        />
        <input
          name="data_di_nascita"
          placeholder="Data di nascita"
          onChange={handleChange}
          required
        />
        <input
          name="avatar"
          placeholder="URL Avatar"
          onChange={handleChange}
          required
        />
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
};

export default Register;

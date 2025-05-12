import React, { useState } from "react";
import axios from "axios";

const UploadImage = ({ type, id }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token");

    try {
      await axios.patch(
        `http://localhost:3002/${type}/${id}/${type === "authors" ? "avatar" : "cover"}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      alert("Immagine caricata!");
    } catch (err) {
      alert("Errore nel caricamento.");
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Carica immagine</button>
    </div>
  );
};

export default UploadImage;

import React, { useEffect, useState } from "react";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem("token");

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Errore nel recupero dei commenti:", error);
    }
  };

  const fetchMe = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCurrentUser(data.email);
    } catch (err) {
      console.error("Errore nel recupero utente:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });
      const data = await res.json();
      setComments(data);
      setNewComment("");
    } catch (error) {
      console.error("Errore nell'aggiunta del commento:", error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts/${postId}/comment/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setComments(prev => prev.filter(c => c._id !== commentId));
      }
    } catch (err) {
      console.error("Errore nella cancellazione:", err);
    }
  };

  const handleEdit = async (commentId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts/${postId}/comment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: editingContent })
      });
      const updated = await res.json();
      setComments(prev => prev.map(c => (c._id === updated._id ? updated : c)));
      setEditingCommentId(null);
      setEditingContent("");
    } catch (err) {
      console.error("Errore nella modifica:", err);
    }
  };

  useEffect(() => {
    fetchMe();
    fetchComments();
  }, [postId]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h4>Commenti</h4>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <textarea
          rows="3"
          className="form-control"
          placeholder="Scrivi un commento..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" className="btn btn-dark mt-2">Invia</button>
      </form>

      <ul className="list-group">
        {comments.map((c) => (
          <li key={c._id} className="list-group-item">
            <strong>{c.author}</strong>
            {editingCommentId === c._id ? (
              <>
                <textarea
                  className="form-control mt-2"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <button className="btn btn-sm btn-success mt-1 me-2" onClick={() => handleEdit(c._id)}>Salva</button>
                <button className="btn btn-sm btn-secondary mt-1" onClick={() => setEditingCommentId(null)}>Annulla</button>
              </>
            ) : (
              <>
                <p className="mb-1">{c.content}</p>
                <small>{new Date(c.createdAt).toLocaleString()}</small>
                {currentUser === c.author && (
                  <div className="mt-1">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setEditingCommentId(c._id); setEditingContent(c.content); }}>Modifica</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>Elimina</button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;

import React, { useCallback, useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from "draftjs-to-html";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./styles.css";

const NewBlogPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Categoria 1");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [authorEmail, setAuthorEmail] = useState("");

  // ✅ Recupera autore da /me per completare post in modo sicuro
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.SERVER_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setAuthorEmail(data.email))
        .catch(err => console.error("Errore fetch /me:", err));
    }
  }, []);

  const handleEditorChange = useCallback((state) => {
    setEditorState(state);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Devi essere loggato per pubblicare un post");

    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    try {
      const res = await fetch(`${process.env.SERVER_URL}/blogPosts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          title,
          cover: "https://placekitten.com/800/400",
          readTime: { value: 5, unit: "min" },
          content
        })
      });

      if (!res.ok) throw new Error("Errore nel salvataggio del post");
      alert("✅ Post pubblicato!");
      setTitle("");
      setCategory("Categoria 1");
      setEditorState(EditorState.createEmpty());

    } catch (err) {
      alert("❌ Errore: " + err.message);
    }
  };

  return (
    <Container className="new-blog-container" style={{ marginTop: "6rem" }}>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Titolo del blog"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Categoria 1</option>
            <option>Categoria 2</option>
            <option>Categoria 3</option>
            <option>Categoria 4</option>
            <option>Categoria 5</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            wrapperClassName="new-blog-editor-wrapper"
            editorClassName="new-blog-content"
            toolbarClassName="toolbar-class"
          />
        </Form.Group>

        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark" className="me-2">
            Reset
          </Button>
          <Button type="submit" size="lg" variant="dark">
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;

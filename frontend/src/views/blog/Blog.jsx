import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import UploadImage from "../../components/UploadImage";
import BlogItem from "../../components/blog/blog-item/BlogItem";
import "./styles.css";

const Blog = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchAuthor = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.SERVER_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAuthor(data);
    } catch (err) {
      console.error("Errore nel fetch da /me:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${process.env.SERVER_URL}/authors/${author._id}/blogPosts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Errore nel fetch dei post dell'autore:", err);
    }
  };

  useEffect(() => {
    fetchAuthor();
    fetchPosts();
  }, [id]);

  if (!author) return <div>Caricamento autore...</div>;

  return (
    <Container style={{ marginTop: "6rem" }}>
      <Row className="mb-4 align-items-center">
        <Col xs={12} md={3}>
          <Image src={author.avatar} roundedCircle fluid />
          <UploadImage type="authors" id={author._id} onUploaded={setAuthor} />
        </Col>
        <Col>
          <h2>
            {author.nome} {author.cognome}
          </h2>
          <p>Email: {author.email}</p>
          <p>Nato il: {author.data_di_nascita}</p>
        </Col>
      </Row>

      <h3>Articoli scritti</h3>
      <Row>
        {posts.map((post, index) => (
          <Col md={4} key={index} className="mb-4">
            <BlogItem {...post} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Blog;

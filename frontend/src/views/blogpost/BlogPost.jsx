import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Comments from '../../components/Comments';
import "./styles.css";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const fetchPost = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts/${id}`);
      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error("Errore nel fetch del post:", err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (!post) return <div>Caricamento post...</div>;

  return (
    <Container style={{ marginTop: "6rem" }}>
      <Row className="mb-4">
        <Col>
          <Image src={post.cover} fluid className="mb-3" />
          <h1>{post.title}</h1>
          <p className="text-muted">
            Categoria: {post.category} | Tempo di lettura: {post.readTime.value}{" "}
            {post.readTime.unit}
          </p>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Comments postId={post._id} />
        </Col>
      </Row>
    </Container>
  );
};

export default BlogPost;

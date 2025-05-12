import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";

const BlogList = ({ searchQuery }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = searchQuery ? `?title=${encodeURIComponent(searchQuery)}` : "";
        const response = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts${query}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Errore nel fetch dei post:", error);
      }
    };

    fetchPosts();
  }, [searchQuery]);

  return (
    <Row>
      {posts.map((post, i) => (
        <Col key={`item-${i}`} md={4} style={{ marginBottom: 50 }}>
          <BlogItem {...post} />
        </Col>
      ))}
    </Row>
  );
};

export default BlogList;

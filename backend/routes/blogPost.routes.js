const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const BlogPost = require('../models/blogPost.model');
const authMiddleware = require('../middleware/auth');
const { parser } = require('../utils/cloudinary');
const { sendNewPostNotification } = require('../utils/email');

// GET blog posts with optional title search and pagination
router.get('/blogPosts', async (req, res) => {
    const { title = "", page = 1, limit = 50 } = req.query;
    try {
        const posts = await BlogPost.find({ title: { $regex: title, $options: 'i' } })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single blog post
router.get('/blogPosts/:id', async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const post = await BlogPost.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new blog post with enforced authenticated author
router.post('/blogPosts', authMiddleware, async (req, res) => {
    try {
        const post = new BlogPost({
            ...req.body,
            author: req.user.email
        });
        const saved = await post.save();
        await sendNewPostNotification(req.user.email, req.body.title);
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update blog post
router.put('/blogPosts/:id', authMiddleware, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const updated = await BlogPost.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE blog post
router.delete('/blogPosts/:id', authMiddleware, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        await BlogPost.findByIdAndDelete(id);
        res.status(200).json({ message: "Blog post eliminato" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH upload cover image
router.patch('/blogPosts/:id/cover', authMiddleware, parser.single("image"), async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const updated = await BlogPost.findByIdAndUpdate(
            id,
            { cover: req.file.path },
            { new: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ======================= COMMENTI =======================

// GET all comments of a post
router.get('/blogPosts/:id/comments', authMiddleware, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const post = await BlogPost.findById(id);
        if (!post) return res.status(404).json({ error: "Post non trovato" });
        res.status(200).json(post.comments || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET a specific comment
router.get('/blogPosts/:id/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const post = await BlogPost.findById(id);
        if (!post) return res.status(404).json({ error: "Post non trovato" });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ error: "Commento non trovato" });

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new comment to a post
router.post('/blogPosts/:id', authMiddleware, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const post = await BlogPost.findById(id);
        if (!post) return res.status(404).json({ error: "Post non trovato" });

        const comment = {
            content: req.body.content,
            author: req.user.email,
            createdAt: new Date()
        };

        post.comments.push(comment);
        await post.save();
        res.status(201).json(post.comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT edit a comment
router.put('/blogPosts/:id/comment/:commentId', authMiddleware, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const post = await BlogPost.findById(id);
        if (!post) return res.status(404).json({ error: "Post non trovato" });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ error: "Commento non trovato" });

        comment.content = req.body.content;
        comment.updatedAt = new Date();
        await post.save();

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/blogPosts/:id/comment/:commentId', authMiddleware, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const post = await BlogPost.findById(id);
        if (!post) return res.status(404).json({ error: "Post non trovato" });

        const originalLength = post.comments.length;

        post.comments = post.comments.filter(
            (comment) => comment._id.toString() !== req.params.commentId
        );

        if (post.comments.length === originalLength) {
            return res.status(404).json({ error: "Commento non trovato" });
        }

        await post.save();
        res.status(200).json({ message: "Commento eliminato" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;

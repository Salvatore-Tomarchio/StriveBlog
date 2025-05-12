const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const router = express.Router();
const Author = require('../models/author.model');
const BlogPost = require('../models/blogPost.model');
const authMiddleware = require('../middleware/auth');
const { sendWelcomeEmail } = require('../utils/email');
const { parser } = require('../utils/cloudinary');

// === GOOGLE AUTH ===

// Redirect al provider Google
router.get('/auth/google', passport.authenticate("google", {
    scope: ["profile", "email"]
}));

// Callback da Google dopo login
router.get('/auth/google/callback', passport.authenticate("google", {
    failureRedirect: "/login",
    session: false
  }), async (req, res) => {
    try {
      const email = req.user.emails[0].value;
      const nome = req.user.name.givenName || "Nome";
      const cognome = req.user.name.familyName || "Cognome";
      const avatar = req.user.photos[0]?.value || "https://via.placeholder.com/150";
  
      // 🔍 Cerca se esiste già un autore con quell'email
      let author = await Author.findOne({ email });
  
      if (!author) {
        const googleFakePassword = await bcrypt.hash("google-oauth", 10);

        // 👤 Se non esiste, crealo
        author = new Author({
          nome,
          cognome,
          email,
          password: googleFakePassword, // oppure null, o un hash fittizio
          data_di_nascita: "N/A",
          avatar
        });
  
        await author.save();
      }
  
      // ✅ Genera JWT
      const token = jwt.sign({ id: author._id, email: author.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      // 🔁 Redirigi con token
      res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth`);
    }
  });
  

// === ROUTES ===

// GET all authors (paginated)
router.get('/authors', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const authors = await Author.find()
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single author
router.get('/authors/:id', async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const author = await Author.findById(id);
        res.status(200).json(author);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// REGISTER new author with email check
router.post('/authors', async (req, res) => {
    try {
        const { nome, cognome, email, password, data_di_nascita, avatar } = req.body;

        // 🔒 Verifica che l'email non esista già
        const existing = await Author.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: "Email già registrata." }); // 409 = Conflict
        }

        const hashed = await bcrypt.hash(password, 10);
        const author = new Author({
            nome,
            cognome,
            email,
            password: hashed,
            data_di_nascita,
            avatar
        });

        const saved = await author.save();
        // await sendWelcomeEmail(email, nome);
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// LOGIN with JWT
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Author.findOne({ email });
        if (!user) return res.status(404).json({ error: "Utente non trovato" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(403).json({ error: "Credenziali non valide" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET current user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await Author.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update author
router.put('/authors/:id', authMiddleware, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const updated = await Author.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE author
router.delete('/authors/:id', authMiddleware, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        await Author.findByIdAndDelete(id);
        res.status(200).json({ message: "Autore eliminato" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all blogPosts by author ID
router.get('/authors/:id/blogPosts', async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const author = await Author.findById(id);
        const posts = await BlogPost.find({ author: author.email });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH upload avatar image
router.patch('/authors/:id/avatar', authMiddleware, parser.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Nessun file caricato" });
        const id = new mongoose.Types.ObjectId(req.params.id);
        const updated = await Author.findByIdAndUpdate(
            id,
            { avatar: req.file.path },
            { new: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

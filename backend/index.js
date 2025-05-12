const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./config/passport'); // configura strategia Google

const app = express();
const port = process.env.PORT || 3002;
const dbName = process.env.dbName;

// === Middleware globali ===
app.use(cors({
  origin: process.env.CLIENT_URL, // o metti "*" in dev
  credentials: true
}));

app.use(express.json());

// === Sessioni per Passport ===
app.use(session({
  secret: process.env.SESSION_SECRET || "striveblogsecret",
  resave: false,
  saveUninitialized: false
}));

// === Inizializzazione Passport ===
app.use(passport.initialize());
app.use(passport.session());

// === Rotte ===
const authorRoutes = require('./routes/author.routes');
const blogRoutes = require('./routes/blogPost.routes');
app.use(authorRoutes);
app.use(blogRoutes);

// === Connessione al DB ===
mongoose.connect(process.env.MongoDB_URL + dbName)
  .then(() => app.listen(port, () =>
    console.log(`Server attivo sulla porta: ${port}`)))
  .catch(err => console.error("Errore connessione MongoDB:", err));

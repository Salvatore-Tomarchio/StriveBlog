const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true }, // email dell'autore
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const blogPostSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String, required: true },
  readTime: {
    value: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  author: { type: String, required: true }, // email autore
  content: { type: String, required: true },
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model("BlogPost", blogPostSchema);

const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    data_di_nascita: { type: String, required: true },
    avatar: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);

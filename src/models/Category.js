const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    descripcion: {type: String, required: true},
    orden: { type: Number, default: 0 },
    mensaje: String,
    is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
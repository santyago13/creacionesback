const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'] 
    },
    descripcionCorta: { 
        type: String, 
        required: true 
    },
    descripcionLarga: { 
        type: String, 
        required: true 
    },
    
    // --- LÓGICA DE PRECIOS ---
    precio: { 
        type: Number, 
        default: 0,        
    },
    precioPersonalizado: { 
        type: Boolean, 
        default: false // Si es true, ignoramos el "precio" y mostramos el texto
    },
    textoPrecioPersonalizado: { 
        type: String, 
        default: "Consultar precio por tamaño/diseño" 
    },
    sinPrecio: {
        type: Boolean,
        default: false
    },

    // --- CONSERVACIÓN ---
    conservacion: {
        type: String,
        default: "" // Ej: "Mantener refrigerado entre 4°C y 8°C. Consumir dentro de los 3 días."
    },

    disponible: {
        type: Boolean,
        default: true
    },
    visible: {
        type: Boolean,
        default: true
    },
    categoria: { 
        type: String, 
        required: true 
    },
    imagenes: { 
        type: [String], 
        required: true 
    },
    atributos: [{
        titulo: { type: String, required: true }, 
        items: { type: [String], required: true } 
    }],
    tags: { 
        type: [String],
        default: [] 
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    orden: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
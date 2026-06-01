const Category = require('../models/Category');
const Product = require('../models/Product'); // Traemos las tortas para cambiarles la etiqueta

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ orden: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const categoriaVieja = await Category.findById(req.params.id);
        
        if (!categoriaVieja) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        // Sacamos espacios en blanco por las dudas
        const nombreViejo = categoriaVieja.nombre.trim();
        const nombreNuevo = req.body.nombre.trim();

        // 1. Actualizamos la categoría
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        
        // 2. Si le cambiaste el nombre, vamos a buscar las tortas y les cambiamos la etiqueta
        if (nombreNuevo && nombreViejo !== nombreNuevo) {
            
            // Este console.log nos va a chismosear en la terminal qué está pasando
            console.log(`ATENCIÓN: Voy a buscar todo lo que diga "${nombreViejo}" y le pondré "${nombreNuevo}"`);
            
            const resultado = await Product.updateMany(
                { categoria: nombreViejo }, 
                { $set: { categoria: nombreNuevo } } 
            );
            
            console.log("Misión cumplida. Cambios realizados:", resultado);
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ message: "No encontrada" });
        res.status(200).json({ message: "Eliminada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
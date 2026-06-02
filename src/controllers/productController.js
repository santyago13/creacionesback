const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const { nombre, descripcionCorta, descripcionLarga, precio, categoria, disponible, slug } = req.body;

        const tagsParseados = req.body.tags ? JSON.parse(req.body.tags) : [];
        const atributosParseados = req.body.atributos ? JSON.parse(req.body.atributos) : [];

        const imagenesUrls = req.files ? req.files.map(file => file.path) : [];

        const ultimo = await Product.findOne().sort({ orden: -1 });
        const nuevoOrden = ultimo ? ultimo.orden + 1 : 0;

        const newProduct = new Product({
            nombre,
            descripcionCorta,
            descripcionLarga,
            precio,
            
            // LÓGICA DE PRECIOS Y CONSERVACIÓN
            precioPersonalizado: req.body.precioPersonalizado === 'true',
            textoPrecioPersonalizado: req.body.textoPrecioPersonalizado,
            sinPrecio: req.body.sinPrecio === 'true', // <-- NUEVO CAMPO
            conservacion: req.body.conservacion,

            categoria,
            disponible: disponible === 'true',
            visible: req.body.visible !== undefined ? req.body.visible === 'true' : true,
            slug,
            tags: tagsParseados,
            atributos: atributosParseados,
            imagenes: imagenesUrls,
            orden: nuevoOrden
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(400).json({ message: "Error al crear producto", error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ orden: 1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { nombre, descripcionCorta, descripcionLarga, precio, categoria, disponible, slug } = req.body;
        
        const tagsParseados = req.body.tags ? JSON.parse(req.body.tags) : [];
        const atributosParseados = req.body.atributos ? JSON.parse(req.body.atributos) : [];
        
        let imagenesFinales = req.body.imagenesExistentes ? JSON.parse(req.body.imagenesExistentes) : [];
        
        if (req.files && req.files.length > 0) {
            const nuevasUrls = req.files.map(file => file.path);
            imagenesFinales = [...imagenesFinales, ...nuevasUrls];
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            {
                nombre,
                descripcionCorta,
                descripcionLarga,
                precio,
                
                // LÓGICA DE PRECIOS Y CONSERVACIÓN
                precioPersonalizado: req.body.precioPersonalizado === 'true',
                textoPrecioPersonalizado: req.body.textoPrecioPersonalizado,
                sinPrecio: req.body.sinPrecio === 'true', // <-- NUEVO CAMPO
                conservacion: req.body.conservacion,

                categoria,
                disponible: disponible === 'true',
                visible: req.body.visible !== undefined ? req.body.visible === 'true' : true,
                slug,
                tags: tagsParseados,
                atributos: atributosParseados,
                imagenes: imagenesFinales
            }, 
            { new: true } 
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(400).json({ message: "Error al actualizar", error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al borrar", error: error.message });
    }
};

exports.toggleDisponible = async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        producto.disponible = !producto.disponible;
        await producto.save();
        
        res.status(200).json(producto);
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        res.status(500).json({ message: "Error al cambiar estado", error: error.message });
    }
};

exports.toggleVisible = async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        producto.visible = !producto.visible;
        await producto.save();

        res.status(200).json(producto);
    } catch (error) {
        console.error("Error al cambiar visibilidad:", error);
        res.status(500).json({ message: "Error al cambiar visibilidad", error: error.message });
    }
};

exports.reorderProducts = async (req, res) => {
    try {
        const { orden } = req.body; // [{ id, orden }, ...]
        await Promise.all(orden.map(({ id, orden }) =>
            Product.findByIdAndUpdate(id, { orden })
        ));
        res.status(200).json({ message: 'Orden actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al reordenar', error: error.message });
    }
};

// Obtener un solo producto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error al buscar producto por ID:", error);
        res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
};
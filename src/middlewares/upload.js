const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Le damos las llaves a Cloudinary para que sepa que es tu cuenta
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configuramos dónde y cómo se guardan las fotos
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'creaciones-carolina', // Va a crear esta carpeta en tu Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Formatos permitidos
    },
});

// 3. Empaquetamos todo en multer y lo exportamos
const upload = multer({ storage: storage });

module.exports = upload;
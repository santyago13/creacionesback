const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');
const verificarToken = require('../middlewares/auth');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

router.post('/', verificarToken, upload.array('imagenes', 5), productController.createProduct);
router.put('/:id', verificarToken, upload.array('imagenes', 5), productController.updateProduct);
router.delete('/:id', verificarToken, productController.deleteProduct);
router.patch('/:id/toggle', verificarToken, productController.toggleDisponible);
router.patch('/:id/toggle-visible', verificarToken, productController.toggleVisible);
router.patch('/reorder/bulk', verificarToken, productController.reorderProducts);

module.exports = router;
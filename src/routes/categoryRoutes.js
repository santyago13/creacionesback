const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verificarToken = require('../middlewares/auth');

router.get('/', categoryController.getCategories);
router.post('/', verificarToken, categoryController.createCategory);
router.put('/:id', verificarToken, categoryController.updateCategory);
router.delete('/:id', verificarToken, categoryController.deleteCategory);

module.exports = router;
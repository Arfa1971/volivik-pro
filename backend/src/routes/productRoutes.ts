import express from 'express';
import { ProductController } from '../controllers/productController';

const router = express.Router();
const productController = new ProductController();

// Rutas para productos
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);

export default router;
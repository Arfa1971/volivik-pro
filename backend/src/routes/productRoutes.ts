import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();
const productController = new ProductController();

// Rutas de productos
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/by-category', productController.getProductsByCategory);

export default router;

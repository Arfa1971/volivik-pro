import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getAllProducts = async (req: Request, res: Response) => {
    try {
      console.log('Obteniendo todos los productos...');
      const products = await this.productService.findAll();
      console.log(`Se encontraron ${products.length} productos`);
      
      res.json(products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  };

  searchProducts = async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
      }

      const products = await this.productService.search(query);
      res.json(products);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      res.status(500).json({ error: 'Error al buscar productos' });
    }
  };

  getProductsByCategory = async (req: Request, res: Response) => {
    try {
      const { catalogo } = req.query;
      if (!catalogo || typeof catalogo !== 'string') {
        return res.status(400).json({ error: 'Se requiere especificar un catálogo' });
      }

      const products = await this.productService.findByCategory(catalogo);
      console.log(`Se encontraron ${products.length} productos en el catálogo ${catalogo}`);
      res.json(products);
    } catch (error) {
      console.error('Error al obtener productos por catálogo:', error);
      res.status(500).json({ error: 'Error al obtener los productos por catálogo' });
    }
  };
}
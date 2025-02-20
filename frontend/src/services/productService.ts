const API_URL = import.meta.env.VITE_API_URL;

export const productService = {
  async getAllProducts() {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`Error al cargar los productos: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async getProductsByCategory(catalogo: string) {
    const response = await fetch(`${API_URL}/products/by-category?catalogo=${catalogo}`);
    if (!response.ok) {
      throw new Error(`Error al cargar los productos por catálogo: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
};

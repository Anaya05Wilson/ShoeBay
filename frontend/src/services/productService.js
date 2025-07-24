import api from './api';

export const productService = {
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  },

  searchProducts: async (searchTerm, filters = {}) => {
    try {
      const response = await api.get('/products/search', {
        params: { q: searchTerm, ...filters }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  },

  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products by category');
    }
  },

  getProductsByBrand: async (brand) => {
    try {
      const response = await api.get(`/products/brand/${brand}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products by brand');
    }
  },

  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/products/featured');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch featured products');
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  getBrands: async (searchTerm = '') => {
    try {
      const response = await api.get('/products/brands', {
        params: searchTerm ? { search: searchTerm } : {}
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch brands');
    }
  },

  // Admin/Seller functions
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },

  createProductWithImages: async (formData) => {
    try {
      console.log('🚀 Sending request to /products/with-images');
      console.log('📋 FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (key === 'images') {
          console.log(`  ${key}:`, value.name, value.type, value.size);
        } else {
          console.log(`  ${key}:`, value);
        }
      }
      
      const response = await api.post('/products/with-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Response received:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ Error in createProductWithImages:', error);
      console.error('❌ Response data:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to create product with images');
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  },

  uploadProductImages: async (productId, images) => {
    try {
      const formData = new FormData();
      images.forEach(image => {
        formData.append('images', image);
      });

      const response = await api.post(`/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload images');
    }
  }
};

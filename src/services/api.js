import api from './axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
/**
 * API Service for Master Data
 */
export const masterDataAPI = {
  // ==========================================
  // BOX MODELS
  // ==========================================
  
  /**
   * Get all active box models
   */
  getBoxModels: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models`);
    return response.json();
  },

  /**
   * Get all box models (including inactive) - for admin
   */
  getAllBoxModels: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models/all`);
    return response.json();
  },

  /**
   * Get box model by ID
   */
  getBoxModelById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models/${id}`);
    return response.json();
  },

  /**
   * Create new box model
   */
  createBoxModel: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Update box model
   */
  updateBoxModel: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Delete box model
   */
  deleteBoxModel: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  /**
   * Toggle box model active status
   */
  toggleBoxModelStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.json();
  },

  // ==========================================
  // MATERIALS
  // ==========================================

  /** Get all active materials */
  getMaterials: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials`);
    return response.json();
  },

  /** Get all materials (including inactive) - for admin */
  getAllMaterials: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/all`);
    return response.json();
  },

  /** Get material by ID */
  getMaterialById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/${id}`);
    return response.json();
  },

  /** Get material by code */
  getMaterialByCode: async (code) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/code/${code}`);
    return response.json();
  },

  /** Get available thickness options for a material code (from MaterialPrice table) */
  getThicknessByMaterialCode: async (code) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/code/${code}/thicknesses`);
    return response.json();
  },

  /** Create new material */
  createMaterial: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Update material */
  updateMaterial: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Delete material */
  deleteMaterial: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  /** Toggle material active status */
  toggleMaterialStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.json();
  },

  // ==========================================
  // FINISHING OPTIONS
  // ==========================================

  /** Get all active finishing options */
  getFinishingOptions: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options`);
    return response.json();
  },

  /** Get all finishing options incl. inactive - admin */
  getAllFinishingOptions: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options/all`);
    return response.json();
  },

  /** Get finishing option by ID */
  getFinishingOptionById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options/${id}`);
    return response.json();
  },

  /** Create finishing option */
  createFinishingOption: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Update finishing option */
  updateFinishingOption: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Delete finishing option */
  deleteFinishingOption: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  /** Toggle finishing option status */
  toggleFinishingOptionStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.json();
  },



  // ==========================================
  // CMYK BLOK PRICES
  // ==========================================

  getCmykBlokPrices: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/cmyk-blok-prices`);
    return response.json();
  },

  getAllCmykBlokPrices: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/cmyk-blok-prices/all`);
    return response.json();
  },

  createCmykBlokPrice: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/cmyk-blok-prices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateCmykBlokPrice: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/cmyk-blok-prices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteCmykBlokPrice: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/cmyk-blok-prices/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  toggleCmykBlokPriceStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/cmyk-blok-prices/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.json();
  },

  // ==========================================
  // PRICING CONFIG
  // ==========================================

  getPricingConfig: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/pricing-config`);
    return response.json();
  },

  updatePricingConfig: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/pricing-config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // ==========================================
  // BANK ACCOUNTS
  // ==========================================

  /** Get all active bank accounts (for checkout dropdown) */
  getBankAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts`);
    return response.json();
  },

  /** Get all bank accounts (both active & inactive) - admin */
  getAllBankAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts/all`);
    return response.json();
  },

  /** Get bank account by ID */
  getBankAccountById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts/${id}`);
    return response.json();
  },

  /** Create bank account */
  createBankAccount: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Update bank account */
  updateBankAccount: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Delete bank account */
  deleteBankAccount: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  /** Toggle bank account status */
  toggleBankAccountStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.json();
  },

  // ==========================================
  // PRICE CALCULATION
  // ==========================================

  // ==========================================
  // PLANO TYPES
  // ==========================================

  getAllPlanoTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/plano-types`);
    return response.json();
  },

  createPlanoType: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/plano-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updatePlanoType: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/plano-types/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deletePlanoType: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/plano-types/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  togglePlanoTypeStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/plano-types/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.json();
  },

  // ==========================================
  // MATERIAL PRICES
  // ==========================================

  getAllMaterialPrices: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/material-prices`);
    return response.json();
  },

  createMaterialPrice: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/material-prices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateMaterialPrice: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/material-prices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteMaterialPrice: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/material-prices/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

/**
 * API Service for Cloudinary Uploads
 */
export const uploadAPI = {
  /**
   * Upload design file (Max 10MB)
   * Allowed formats: JPG, PNG, PDF, AI, PSD, SVG
   */
  uploadDesign: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/upload/design`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  /**
   * Upload payment proof (Max 5MB)
   * Allowed formats: JPG, PNG
   */
  uploadPayment: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/upload/payment`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  /**
   * Upload box model image (Max 2MB)
   * Allowed formats: JPG, PNG, SVG
   */
  uploadBoxModel: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/upload/box-model`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  /**
   * Delete uploaded file from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   */
  deleteFile: async (publicId) => {
    const encodedPublicId = publicId.replace(/\//g, '-');
    const response = await fetch(`${API_BASE_URL}/upload/${encodedPublicId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

/**
 * API Service for Pricing Calculator
 */
export const calculatorAPI = {
  /**
   * Calculate plano recommendation based on box dimensions
   * POST /api/v1/calculator/plano
   */
  calculatePlano: async (data) => {
    const response = await fetch(`${API_BASE_URL}/calculator/plano`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Calculate progressive price breakdown
   * POST /api/v1/calculator/price
   */
  calculatePrice: async (data) => {
    const response = await fetch(`${API_BASE_URL}/calculator/price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Calculate full order price (for order submission)
   * POST /api/v1/calculator/full
   */
  calculateFullPrice: async (data) => {
    const response = await fetch(`${API_BASE_URL}/calculator/full`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

/**
 * API Service for Orders
 */
export const orderAPI = {
  /**
   * Create new order without payment
   */
  createOrder: async (data) => {
    const response = await api.post('/orders', { orderData: data });
    return response.data;
  },

  /**
   * Submit new order along with payment proof
   */
  submitOrderWithPayment: async (data) => {
    const response = await api.post('/orders/with-payment', data);
    return response.data;
  },

  /**
   * Submit payment proof for existing order
   */
  submitPaymentProof: async (orderId, data) => {
    const response = await api.post(`/orders/${orderId}/payment`, data);
    return response.data;
  },

  /**
   * Get user orders
   */
  getUserOrders: async (params) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  /**
   * Get all orders (Admin Only)
   */
  getAdminOrders: async (params) => {
    const response = await api.get('/orders/admin/all', { params });
    return response.data;
  },

  /**
   * Update order status (Admin Only)
   */
  updateOrderStatus: async (id, data) => {
    const response = await api.put(`/orders/admin/${id}/status`, data);
    return response.data;
  },
  /**
   * Complete order (User Only)
   */
  completeOrder: async (id) => {
    const response = await api.put(`/orders/${id}/complete`);
    return response.data;
  },
};

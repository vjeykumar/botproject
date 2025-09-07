const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

async function makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    console.log('Making API request to:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error('API request failed for', url, ':', {
      url,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running on http://localhost:5000');
    }
    
    throw error;
  }
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Authentication
  async register(userData: { name: string; email: string; password: string }) {
    console.log('Registering user:', userData.email);
    const response = await makeRequest(`${API_BASE_URL}/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    console.log('Registration response:', result);
    
    if (result.access_token) {
      localStorage.setItem('access_token', result.access_token);
    }
    
    return result;
  }

  async login(credentials: { email: string; password: string }) {
    console.log('Logging in user:', credentials.email);
    const response = await makeRequest(`${API_BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    const result = await response.json();
    console.log('Login response:', result);
    
    if (result.access_token) {
      localStorage.setItem('access_token', result.access_token);
    }
    
    return result;
  }

  async getProfile() {
    const response = await makeRequest(`${API_BASE_URL}/profile`, {
      headers: this.getAuthHeaders()
    });
    
    return response.json();
  }

  // Orders
  async createOrder(orderData: {
    items: any[];
    total_amount: number;
    payment_method: string;
    billing_info: any;
  }) {
    const response = await makeRequest(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    
    return response.json();
  }

  async getOrders() {
    const response = await makeRequest(`${API_BASE_URL}/orders`, {
      headers: this.getAuthHeaders()
    });
    
    return response.json();
  }

  async getOrder(orderId: number) {
    const response = await makeRequest(`${API_BASE_URL}/orders/${orderId}`, {
      headers: this.getAuthHeaders()
    });
    
    return response.json();
  }

  // Payment
  async processPayment(paymentData: {
    payment_method: string;
    amount: number;
    card_details?: any;
    upi_id?: string;
    bank?: string;
  }) {
    const response = await makeRequest(`${API_BASE_URL}/payment/process`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(paymentData)
    });
    
    return response.json();
  }

  // Reviews
  async createReview(reviewData: {
    product_id: string;
    rating: number;
    comment?: string;
  }) {
    const response = await makeRequest(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    
    return response.json();
  }

  async getReviews(productId: string) {
    const response = await makeRequest(`${API_BASE_URL}/reviews/${productId}`, {
      headers: this.getAuthHeaders()
    });
    
    return response.json();
  }

  // Health check
  async healthCheck() {
    const response = await makeRequest(`${API_BASE_URL}/health`);
    return response.json();
  }

  // Products
  async getProducts(category?: string) {
    const url = category 
      ? `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/products`;
    
    const response = await makeRequest(url);
    return response.json();
  }

  async getProduct(productId: string) {
    const response = await makeRequest(`${API_BASE_URL}/products/${productId}`);
    return response.json();
  }

  async createProduct(productData: any) {
    const response = await makeRequest(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return response.json();
  }

  // Cart
  async getCart() {
    const response = await makeRequest(`${API_BASE_URL}/cart`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async addToCart(itemData: any) {
    const response = await makeRequest(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(itemData)
    });
    return response.json();
  }

  async updateCartItem(itemId: string, updateData: any) {
    const response = await makeRequest(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return response.json();
  }

  async removeFromCart(itemId: string) {
    const response = await makeRequest(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async clearCart() {
    const response = await makeRequest(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  logout() {
    localStorage.removeItem('access_token');
  }
}

export const apiService = new ApiService();
import axios, { AxiosInstance } from 'axios';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '../data/mockProducts';
import { Product, Review, Order, CustomerOrderInfo, CartItem, OrderStatus, ContactMessage } from '../types';

const ORDERS_STORAGE_KEY = 'auradecor_orders_v3';
const WISHLIST_STORAGE_KEY = 'auradecor_wishlist_v3';
const PRODUCTS_STORAGE_KEY = 'auradecor_products_v3';
const CONTACT_STORAGE_KEY = 'auradecor_contact_messages_v3';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class CandleApiService {
  private static isBackendLive: boolean | null = null;

  static getBaseUrl(): string {
    return API_BASE_URL;
  }

  // Health check to detect if Spring Boot is running on localhost:8080
  static async checkBackendHealth(): Promise<boolean> {
    try {
      await axiosClient.get('/products', { timeout: 1500 });
      this.isBackendLive = true;
      return true;
    } catch {
      this.isBackendLive = false;
      return false;
    }
  }

  static getStoredProducts(): Product[] {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // initialize storage with mock products
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
    return [...MOCK_PRODUCTS];
  }

  // Fetch all products with filtering & search
  static async getProducts(params?: {
    category?: string;
    fragranceFamily?: string;
    search?: string;
    sortBy?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  }): Promise<Product[]> {
    // Attempt live Spring Boot REST API
    try {
      const response = await axiosClient.get<Product[]>('/products', {
        params: {
          category: params?.category && params.category !== 'All Creations' && params.category !== 'All' ? params.category : undefined,
          fragranceFamily: params?.fragranceFamily && params.fragranceFamily !== 'All' ? params.fragranceFamily : undefined,
          search: params?.search || undefined,
        },
      });
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        this.isBackendLive = true;
        return response.data;
      }
    } catch {
      this.isBackendLive = false;
    }

    // Client-side fallback with simulated latency
    await new Promise((r) => setTimeout(r, 40));
    let results = this.getStoredProducts();

    if (params?.category && params.category !== 'All Creations' && params.category !== 'All') {
      results = results.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.fragranceFamily && params.fragranceFamily !== 'All') {
      results = results.filter((p) => p.fragranceFamily === params.fragranceFamily);
    }

    if (params?.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase();
      results = results.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.scentPyramid.topNotes.some((n) => n.toLowerCase().includes(q)) ||
        p.scentPyramid.heartNotes.some((n) => n.toLowerCase().includes(q)) ||
        p.scentPyramid.baseNotes.some((n) => n.toLowerCase().includes(q))
      );
    }

    if (params?.sortBy) {
      if (params.sortBy === 'price-asc') {
        results.sort((a, b) => a.price - b.price);
      } else if (params.sortBy === 'price-desc') {
        results.sort((a, b) => b.price - a.price);
      } else if (params.sortBy === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
      } else if (params.sortBy === 'newest') {
        results.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      }
    }

    return results;
  }

  static async getProductById(id: string): Promise<Product | undefined> {
    try {
      const response = await axiosClient.get<Product>(`/products/${id}`);
      if (response.data) {
        return response.data;
      }
    } catch {
      // fallback
    }
    const products = this.getStoredProducts();
    return products.find((p) => p.id === id);
  }

  // Admin: Create product
  static async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const response = await axiosClient.post<Product>('/products', productData, {
        auth: { username: 'admin', password: 'blossomglow2026!' },
      });
      if (response.data) return response.data;
    } catch {
      // fallback
    }

    const current = this.getStoredProducts();
    const newProduct: Product = {
      id: `bg-${Date.now()}`,
      name: productData.name || 'Artisanal Candle',
      tagline: productData.tagline || 'Handcrafted botanical candle',
      category: productData.category || 'Decorative Candles',
      fragranceFamily: productData.fragranceFamily || 'Floral',
      price: productData.price || 499,
      originalPrice: productData.originalPrice || Math.round((productData.price || 499) * 1.25),
      rating: 5.0,
      reviewsCount: 1,
      image: productData.image || '/src/assets/products/floral-garden.jpg',
      galleryImages: [productData.image || '/src/assets/products/floral-garden.jpg'],
      burnTimeHours: productData.burnTimeHours || 40,
      weightGrams: productData.weightGrams || 250,
      scentIntensity: productData.scentIntensity || 4,
      scentPyramid: productData.scentPyramid || {
        topNotes: ['Rose Water', 'Bergamot'],
        heartNotes: ['Jasmine Petals', 'Mogra'],
        baseNotes: ['White Sandalwood', 'Amber'],
      },
      description: productData.description || 'Handcrafted with attention to detail and love.',
      artisanStory: productData.artisanStory || 'Poured in small batches in our botanical studio.',
      availableVessels: ['Fluted Ivory', 'Matte Blush Cream'],
      availableWicks: ['Organic Cotton Wick', 'Crackling Wood Wick'],
      inStock: productData.inStock !== false,
      stockQuantity: productData.stockQuantity || 50,
      isBestSeller: !!productData.isBestSeller,
      isNewArrival: true,
      waxType: productData.waxType || '100% Organic Soy Wax',
    };

    current.unshift(newProduct);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(current));
    return newProduct;
  }

  // Admin: Update product
  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const response = await axiosClient.put<Product>(`/products/${id}`, updates, {
        auth: { username: 'admin', password: 'blossomglow2026!' },
      });
      if (response.data) return response.data;
    } catch {
      // fallback
    }

    const current = this.getStoredProducts();
    const idx = current.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Product not found');

    const updated = { ...current[idx], ...updates };
    current[idx] = updated;
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(current));
    return updated;
  }

  // Admin: Delete product
  static async deleteProduct(id: string): Promise<boolean> {
    try {
      await axiosClient.delete(`/products/${id}`, {
        auth: { username: 'admin', password: 'blossomglow2026!' },
      });
    } catch {
      // fallback
    }

    const current = this.getStoredProducts();
    const filtered = current.filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  // Admin: Get all orders
  static async getAllOrders(): Promise<Order[]> {
    try {
      const response = await axiosClient.get<Order[]>('/orders', {
        auth: { username: 'admin', password: 'blossomglow2026!' },
      });
      if (response.data && Array.isArray(response.data)) return response.data;
    } catch {
      // fallback
    }

    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Admin: Update order status
  static async updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string): Promise<Order> {
    try {
      const response = await axiosClient.put<Order>(`/orders/${orderId}/status`, { status, trackingNumber }, {
        auth: { username: 'admin', password: 'blossomglow2026!' },
      });
      if (response.data) return response.data;
    } catch {
      // fallback
    }

    const orders = await this.getAllOrders();
    const idx = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (idx === -1) throw new Error('Order not found');

    orders[idx].status = status;
    if (trackingNumber) orders[idx].trackingNumber = trackingNumber;
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    return orders[idx];
  }

  // Customer Checkout / Create order
  static async createOrder(payload: {
    items: CartItem[];
    customerInfo: CustomerOrderInfo;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
    discountCode?: string;
  }): Promise<Order> {
    // Attempt Spring Boot REST API
    try {
      const response = await axiosClient.post<Order>('/orders', {
        fullName: payload.customerInfo.fullName,
        email: payload.customerInfo.email,
        phone: payload.customerInfo.phone,
        shippingAddress: payload.customerInfo.address,
        city: payload.customerInfo.city,
        state: payload.customerInfo.state,
        pincode: payload.customerInfo.pincode,
        paymentMethod: payload.paymentMethod,
        specialInstructions: payload.customerInfo.specialInstructions,
        items: payload.items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPrice: i.itemPrice,
          selectedVessel: i.selectedVessel,
          selectedWick: i.selectedWick,
          selectedSize: i.selectedSize,
        })),
      });
      if (response.data) {
        return response.data;
      }
    } catch {
      // Fallback
    }

    await new Promise((r) => setTimeout(r, 200));

    const subtotal = payload.items.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
    let discount = 0;
    if (payload.discountCode?.toUpperCase() === 'GLOW10') {
      discount = Math.round(subtotal * 0.1);
    } else if (payload.discountCode?.toUpperCase() === 'AUTUMN20') {
      discount = Math.round(subtotal * 0.2);
    }

    const shippingFee = subtotal >= 1199 ? 0 : 99;
    const totalAmount = Math.max(0, subtotal - discount + shippingFee);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BG-${randomSuffix}`;
    const trackingNumber = `BLUEDART-BG${Date.now().toString().slice(-6)}`;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      items: payload.items,
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      customerInfo: payload.customerInfo,
      paymentMethod: payload.paymentMethod,
      status: 'Confirmed',
      trackingNumber,
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    };

    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    const orders: Order[] = stored ? JSON.parse(stored) : [];
    orders.unshift(newOrder);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

    return newOrder;
  }

  static async getOrderByTracking(query: string): Promise<Order | undefined> {
    try {
      const response = await axiosClient.get<Order>(`/orders/track/${query.trim()}`);
      if (response.data) return response.data;
    } catch {
      // fallback
    }

    await new Promise((r) => setTimeout(r, 60));
    const clean = query.trim().toUpperCase();
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    const orders: Order[] = stored ? JSON.parse(stored) : [];

    return orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === clean ||
        o.trackingNumber.toUpperCase() === clean ||
        o.id.toUpperCase() === clean
    );
  }

  // Contact form submission
  static async submitContact(data: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<boolean> {
    try {
      const response = await axiosClient.post('/contact', data);
      if (response.data) return true;
    } catch {
      // fallback
    }

    const stored = localStorage.getItem(CONTACT_STORAGE_KEY);
    const messages: ContactMessage[] = stored ? JSON.parse(stored) : [];
    messages.unshift({
      id: `msg-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(messages));
    return true;
  }

  // Wishlist
  static getWishlist(): string[] {
    try {
      const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static toggleWishlist(productId: string): string[] {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter((id) => id !== productId) : [...list, productId];
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  // Reviews
  static async getReviews(productId?: string): Promise<Review[]> {
    const stored = localStorage.getItem('blossomglow_reviews_v2');
    const allReviews: Review[] = stored ? JSON.parse(stored) : MOCK_REVIEWS;

    if (productId) {
      return allReviews.filter((r) => r.productId === productId);
    }
    return allReviews;
  }

  static async addReview(reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> {
    const stored = localStorage.getItem('blossomglow_reviews_v2');
    const allReviews: Review[] = stored ? JSON.parse(stored) : [...MOCK_REVIEWS];

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      date: new Date().toISOString().split('T')[0],
      verified: reviewData.verified ?? true,
    };

    allReviews.unshift(newReview);
    localStorage.setItem('blossomglow_reviews_v2', JSON.stringify(allReviews));
    return newReview;
  }

  // Scent Quiz Candle Recommendation
  static recommendCandle(answers: { mood: string; profile: string; space: string }): Product {
    const products = this.getStoredProducts();
    if (answers.profile === 'floral') {
      const match = products.find((p) => p.fragranceFamily === 'Floral');
      if (match) return match;
    }
    if (answers.profile === 'woody') {
      const match = products.find((p) => p.fragranceFamily === 'Woody & Amber');
      if (match) return match;
    }
    if (answers.profile === 'fresh') {
      const match = products.find((p) => p.fragranceFamily === 'Fresh & Herbal');
      if (match) return match;
    }
    if (answers.profile === 'spicy' || answers.profile === 'gourmand') {
      const match = products.find((p) => p.fragranceFamily === 'Gourmand & Warm');
      if (match) return match;
    }
    // Default recommendation: Flagship Floral Garden or Buddha candle
    return products[0];
  }
}

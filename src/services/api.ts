import axios, { AxiosInstance } from 'axios';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '../data/mockProducts';
import { Product, Review, Order, CustomerOrderInfo, CartItem, OrderStatus, ContactMessage, UserProfile, AuthResponse, FragranceFamily } from '../types';
import { normalizeProduct } from '../utils/productNormalizer';

const ORDERS_STORAGE_KEY = 'auradecor_orders_v3';
const WISHLIST_STORAGE_KEY = 'auradecor_wishlist_v3';
const PRODUCTS_STORAGE_KEY = 'auradecor_products_v3';
const CONTACT_STORAGE_KEY = 'auradecor_contact_messages_v3';
const REVIEWS_STORAGE_KEY = 'auradecor_reviews_v3';
const AUTH_TOKEN_KEY = 'bg_jwt_token';
const AUTH_USER_KEY = 'bg_auth_user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3500,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject JWT Bearer token into all requests (skip mock tokens)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token && !token.startsWith('mock-jwt-') && token.split('.').length === 3 && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class CandleApiService {
  private static isBackendLive: boolean | null = null;

  static getBaseUrl(): string {
    return API_BASE_URL;
  }

  static getLiveStatus(): boolean | null {
    return this.isBackendLive;
  }

  // Health check to detect if Spring Boot is running on localhost:8080
  static async checkBackendHealth(): Promise<boolean> {
    try {
      await axiosClient.get('/products', { timeout: 2000 });
      this.isBackendLive = true;
      return true;
    } catch {
      this.isBackendLive = false;
      return false;
    }
  }

  // =========================================================================
  // AUTHENTICATION & USER SESSIONS (Spring Security + JWT)
  // =========================================================================

  static getStoredToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  static getStoredUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static async login(usernameOrEmail: string, password: string): Promise<UserProfile> {
    // Attempt live Spring Boot Auth API
    try {
      const response = await axiosClient.post<AuthResponse>('/auth/login', {
        username: usernameOrEmail,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        const profile: UserProfile = {
          id: String(response.data.id || '1'),
          username: response.data.username,
          email: response.data.email,
          fullName: response.data.fullName,
          role: response.data.role,
          token: response.data.token,
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
        this.isBackendLive = true;
        return profile;
      }
    } catch (err: any) {
      // If network fails (backend not running), handle graceful mock auth
      if (err.code === 'ERR_NETWORK' || !err.response) {
        this.isBackendLive = false;
      } else {
        throw new Error(err.response?.data?.message || 'Invalid username or password');
      }
    }

    // Local / Offline Simulation for demo and immediate testing
    if (usernameOrEmail.toLowerCase().includes('admin') || password === 'blossomglow2026!') {
      const adminProfile: UserProfile = {
        id: '0',
        username: 'admin',
        email: 'admin@blossomglow.com',
        fullName: 'Atelier Administrator',
        role: 'ROLE_ADMIN',
        token: 'mock-jwt-admin-token-2026',
      };
      localStorage.setItem(AUTH_TOKEN_KEY, adminProfile.token!);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(adminProfile));
      return adminProfile;
    }

    const customerProfile: UserProfile = {
      id: `cust-${Date.now()}`,
      username: usernameOrEmail.split('@')[0],
      email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@example.com`,
      fullName: usernameOrEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      role: 'ROLE_CUSTOMER',
      token: 'mock-jwt-customer-token-2026',
    };
    localStorage.setItem(AUTH_TOKEN_KEY, customerProfile.token!);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(customerProfile));
    return customerProfile;
  }

  static async register(data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }): Promise<UserProfile> {
    try {
      const response = await axiosClient.post<AuthResponse>('/auth/register', data);
      if (response.data && response.data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        const profile: UserProfile = {
          id: String(response.data.id),
          username: response.data.username,
          email: response.data.email,
          fullName: response.data.fullName,
          role: response.data.role,
          phone: data.phone,
          token: response.data.token,
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
        this.isBackendLive = true;
        return profile;
      }
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        this.isBackendLive = false;
      } else {
        throw new Error(err.response?.data?.message || 'Registration failed');
      }
    }

    // Local / Offline Simulation
    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: 'ROLE_CUSTOMER',
      token: `mock-jwt-${Date.now()}`,
    };
    localStorage.setItem(AUTH_TOKEN_KEY, newProfile.token!);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newProfile));
    return newProfile;
  }

  static logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  // =========================================================================
  // PRODUCTS & ARTISAN INVENTORY
  // =========================================================================

  static getStoredProducts(): Product[] {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map(normalizeProduct);
          this.saveStoredProducts(sanitized);
          return sanitized;
        }
      }
    } catch {
      // ignore
    }
    const defaultList = MOCK_PRODUCTS.map(normalizeProduct);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(defaultList));
    return defaultList;
  }

  static saveStoredProducts(products: Product[]): void {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }

  static async getProducts(params?: {
    category?: string;
    fragranceFamily?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    sortBy?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  }): Promise<Product[]> {
    // 1. Attempt live Spring Boot REST API
    try {
      const response = await axiosClient.get<any[]>('/products', {
        params: {
          category: params?.category && params.category !== 'All Creations' && params.category !== 'All' ? params.category : undefined,
          fragranceFamily: params?.fragranceFamily && params.fragranceFamily !== 'All' ? params.fragranceFamily : undefined,
          search: params?.search || undefined,
        },
      });
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        this.isBackendLive = true;
        // Normalize backend DTO items (ensures image, galleryImages, category, types are solid)
        let apiResults = response.data.map(normalizeProduct);

        // Apply client filters if backend returned full set
        if (params?.minPrice !== undefined) {
          apiResults = apiResults.filter((p) => p.price >= params.minPrice!);
        }
        if (params?.maxPrice !== undefined) {
          apiResults = apiResults.filter((p) => p.price <= params.maxPrice!);
        }
        if (params?.inStockOnly) {
          apiResults = apiResults.filter((p) => p.inStock);
        }
        if (params?.sortBy) {
          if (params.sortBy === 'price-asc') apiResults.sort((a, b) => a.price - b.price);
          else if (params.sortBy === 'price-desc') apiResults.sort((a, b) => b.price - a.price);
          else if (params.sortBy === 'rating') apiResults.sort((a, b) => b.rating - a.rating);
          else if (params.sortBy === 'newest') apiResults.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        }
        return apiResults;
      }
    } catch {
      this.isBackendLive = false;
    }

    // 2. Client-side local persistent fallback
    await new Promise((r) => setTimeout(r, 60));
    let results = this.getStoredProducts();

    if (params?.category && params.category !== 'All Creations' && params.category !== 'All') {
      results = results.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.fragranceFamily && params.fragranceFamily !== 'All') {
      results = results.filter((p) => p.fragranceFamily === params.fragranceFamily);
    }

    if (params?.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.scentPyramid?.topNotes && p.scentPyramid.topNotes.some((n) => n.toLowerCase().includes(q))) ||
          (p.scentPyramid?.heartNotes && p.scentPyramid.heartNotes.some((n) => n.toLowerCase().includes(q))) ||
          (p.scentPyramid?.baseNotes && p.scentPyramid.baseNotes.some((n) => n.toLowerCase().includes(q)))
      );
    }

    if (params?.minPrice !== undefined) {
      results = results.filter((p) => p.price >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= params.maxPrice!);
    }

    if (params?.inStockOnly) {
      results = results.filter((p) => p.inStock);
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
      const response = await axiosClient.get<any>(`/products/${id}`);
      if (response.data) return normalizeProduct(response.data);
    } catch {
      // fallback
    }
    const products = this.getStoredProducts();
    return products.find((p) => p.id === id);
  }

  // =========================================================================
  // REVIEWS & RATINGS
  // =========================================================================

  static getStoredReviews(): Review[] {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(MOCK_REVIEWS));
    return [...MOCK_REVIEWS];
  }

  static async getReviewsForProduct(productId: string): Promise<Review[]> {
    try {
      // Try backend
      const response = await axiosClient.get<Review[]>(`/reviews/product/${productId}`);
      if (response.data && response.data.length > 0) {
        return response.data;
      }
    } catch {
      // fallback
    }
    const all = this.getStoredReviews();
    return all.filter((r) => r.productId === productId);
  }

  static getReviews(): Review[] {
    return this.getStoredReviews();
  }

  static async addReview(reviewData: {
    productId: string;
    author: string;
    rating: number;
    title: string;
    comment: string;
    candleName: string;
    location?: string;
    verified?: boolean;
  }): Promise<Review> {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: reviewData.productId,
      author: reviewData.author,
      location: reviewData.location || 'Verified Collector, India',
      rating: reviewData.rating,
      date: 'Just now',
      title: reviewData.title,
      comment: reviewData.comment,
      verified: reviewData.verified !== undefined ? reviewData.verified : true,
      candleName: reviewData.candleName,
    };

    try {
      await axiosClient.post('/reviews', {
        productId: reviewData.productId,
        authorName: reviewData.author,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        verified: true,
      });
    } catch {
      // ignore
    }

    const current = this.getStoredReviews();
    current.unshift(newRev);
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(current));
    return newRev;
  }

  // =========================================================================
  // ORDERS & CHECKOUT
  // =========================================================================

  static getStoredOrders(): Order[] {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  }

  static async placeOrder(orderData: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    shippingFee: number;
    totalAmount: number;
    customerInfo: CustomerOrderInfo;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  }): Promise<Order> {
    const orderNumber = `BG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `BD-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shippingFee: orderData.shippingFee,
      totalAmount: orderData.totalAmount,
      customerInfo: orderData.customerInfo,
      paymentMethod: orderData.paymentMethod,
      status: 'Confirmed',
      trackingNumber,
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    // Attempt backend POST /api/orders
    try {
      const payload = {
        orderNumber,
        fullName: orderData.customerInfo.fullName,
        email: orderData.customerInfo.email,
        phone: orderData.customerInfo.phone,
        shippingAddress: orderData.customerInfo.address,
        city: orderData.customerInfo.city,
        state: orderData.customerInfo.state,
        pincode: orderData.customerInfo.pincode,
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        shippingFee: orderData.shippingFee,
        totalAmount: orderData.totalAmount,
        paymentMethod: orderData.paymentMethod,
        items: orderData.items.map((i) => ({
          productId: i.productId,
          productName: i.product.name,
          quantity: i.quantity,
          unitPrice: i.itemPrice,
          totalPrice: i.itemPrice * i.quantity,
          selectedVessel: i.selectedVessel,
          selectedWick: i.selectedWick,
          selectedSize: i.selectedSize,
        })),
      };
      await axiosClient.post('/orders', payload);
      this.isBackendLive = true;
    } catch {
      this.isBackendLive = false;
    }

    // Always persist to local customer order history
    const existing = this.getStoredOrders();
    existing.unshift(newOrder);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existing));

    return newOrder;
  }

  static async createOrder(orderData: {
    items: CartItem[];
    customerInfo: CustomerOrderInfo;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
    discountCode?: string;
  }): Promise<Order> {
    const subtotal = orderData.items.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
    const discount = orderData.discountCode ? Math.round(subtotal * 0.1) : 0;
    const shippingFee = subtotal > 999 ? 0 : 99;
    const totalAmount = Math.max(0, subtotal - discount + shippingFee);

    return this.placeOrder({
      items: orderData.items,
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      customerInfo: orderData.customerInfo,
      paymentMethod: orderData.paymentMethod,
    });
  }

  static async getOrders(): Promise<Order[]> {
    try {
      const response = await axiosClient.get<Order[]>('/orders');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch {
      // fallback
    }
    return this.getStoredOrders();
  }

  static async getAllOrders(): Promise<Order[]> {
    return this.getOrders();
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    try {
      await axiosClient.put(`/orders/${orderId}/status`, { status });
    } catch {
      // fallback
    }

    const orders = this.getStoredOrders();
    const idx = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      return orders[idx];
    }
    return null;
  }

  static async trackOrder(orderNumber: string): Promise<Order | null> {
    try {
      const response = await axiosClient.get<Order>(`/orders/track/${orderNumber}`);
      if (response.data) return response.data;
    } catch {
      // fallback
    }
    const orders = this.getStoredOrders();
    return orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase().trim()) || null;
  }

  // =========================================================================
  // WISHLIST
  // =========================================================================

  static getWishlist(): string[] {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return raw ? JSON.parse(raw) : ['bg-lotus-glow', 'bg-fluted-marbled-tray-duo'];
    } catch {
      return ['bg-lotus-glow'];
    }
  }

  static toggleWishlist(productId: string): string[] {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter((id) => id !== productId) : [...list, productId];
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  // =========================================================================
  // ADMIN DASHBOARD & PRODUCT CRUD
  // =========================================================================

  static async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const response = await axiosClient.post<Product>('/products', productData);
      if (response.data) {
        this.isBackendLive = true;
        return response.data;
      }
    } catch {
      // fallback
    }

    const current = this.getStoredProducts();
    const newProduct: Product = {
      id: `bg-${Date.now()}`,
      name: productData.name || 'Artisanal Candle Creation',
      tagline: productData.tagline || 'Hand-poured pure soy candle',
      category: productData.category || 'Decorative Candles',
      fragranceFamily: productData.fragranceFamily || 'Floral',
      price: Number(productData.price) || 499,
      originalPrice: productData.originalPrice || Math.round((Number(productData.price) || 499) * 1.25),
      rating: 5.0,
      reviewsCount: 1,
      image: productData.image || '/src/assets/products/floral-garden.jpg',
      galleryImages: productData.galleryImages || [productData.image || '/src/assets/products/floral-garden.jpg'],
      burnTimeHours: productData.burnTimeHours || 40,
      weightGrams: productData.weightGrams || 250,
      scentIntensity: productData.scentIntensity || 4,
      scentPyramid: productData.scentPyramid || {
        topNotes: ['Bergamot', 'Mandarin'],
        heartNotes: ['Jasmine Petals', 'Rose Water'],
        baseNotes: ['Amber', 'Sandalwood'],
      },
      description: productData.description || 'Poured with 100% natural botanical wax and clean lead-free wicks.',
      artisanStory: productData.artisanStory || 'Handcrafted in small batches by master artisans at BlossomGlow Atelier.',
      availableVessels: productData.availableVessels || ['Fluted Ivory', 'Matte Blush Cream'],
      availableWicks: productData.availableWicks || ['Organic Cotton Wick', 'Crackling Wood Wick'],
      inStock: productData.inStock ?? true,
      stockQuantity: productData.stockQuantity || 30,
      isBestSeller: productData.isBestSeller || false,
      isNewArrival: true,
      seasonRelease: 'Atelier Release 2026',
      waxType: productData.waxType || '100% Organic Soy Wax',
      dimensions: productData.dimensions || '8cm x 9cm',
    };

    current.unshift(newProduct);
    this.saveStoredProducts(current);
    return newProduct;
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const response = await axiosClient.put<Product>(`/products/${id}`, updates);
      if (response.data) return response.data;
    } catch {
      // fallback
    }

    const current = this.getStoredProducts();
    const idx = current.findIndex((p) => p.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...updates };
      this.saveStoredProducts(current);
      return current[idx];
    }
    return null;
  }

  static async deleteProduct(id: string): Promise<boolean> {
    try {
      await axiosClient.delete(`/products/${id}`);
    } catch {
      // fallback
    }

    const current = this.getStoredProducts();
    const filtered = current.filter((p) => p.id !== id);
    this.saveStoredProducts(filtered);
    return true;
  }

  // =========================================================================
  // CONTACT & INQUIRIES
  // =========================================================================

  static async submitContactMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<ContactMessage> {
    try {
      await axiosClient.post('/contact', data);
    } catch {
      // fallback
    }

    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem(CONTACT_STORAGE_KEY);
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newMsg);
      localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }

    return newMsg;
  }

  static async submitContact(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<ContactMessage> {
    return this.submitContactMessage(data);
  }

  static async getOrderByTracking(trackingNumber: string): Promise<Order | null> {
    return this.trackOrder(trackingNumber);
  }

  static recommendCandle(answers: { mood: string; profile: string; space: string }): Product {
    const products = this.getStoredProducts();
    const moodLower = (answers.mood || '').toLowerCase();
    const profileLower = (answers.profile || '').toLowerCase();

    const matched = products.find((p) => {
      const text = `${p.name} ${p.fragranceFamily} ${p.tagline} ${p.description}`.toLowerCase();
      return (profileLower && text.includes(profileLower)) || (moodLower && text.includes(moodLower));
    });

    return matched || products.find((p) => p.isBestSeller) || products[0];
  }
}

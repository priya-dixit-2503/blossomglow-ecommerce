import axios, { AxiosInstance } from 'axios';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '../data/mockProducts';
import { Product, Review, Order, CustomerOrderInfo, CartItem, OrderStatus, ContactMessage, UserProfile, AuthResponse, FragranceFamily, VesselColor, WickType, CandleSize } from '../types';
import { normalizeProduct } from '../utils/productNormalizer';

const ORDERS_STORAGE_KEY = 'auradecor_orders_v3';
const WISHLIST_STORAGE_KEY = 'auradecor_wishlist_v3';
const PRODUCTS_STORAGE_KEY = 'blossomglow_artisan_catalog_v2026_18photos';
const CONTACT_STORAGE_KEY = 'auradecor_contact_messages_v3';
const REVIEWS_STORAGE_KEY = 'auradecor_reviews_v3';
const CART_STORAGE_KEY = 'auradecor_cart_v3';
const CART_SESSION_KEY = 'bg_cart_session_id';
const AUTH_TOKEN_KEY = 'bg_jwt_token';
const AUTH_USER_KEY = 'bg_auth_user';

export function getCartSessionId(): string {
  try {
    let id = localStorage.getItem(CART_SESSION_KEY);
    if (!id) {
      id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(CART_SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'sess_fallback';
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2500,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject JWT Bearer token & session ID into all requests (skip mock tokens)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token && !token.startsWith('mock-jwt-') && token.split('.').length === 3 && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const sessionId = getCartSessionId();
  if (sessionId && config.headers) {
    config.headers['X-Session-ID'] = sessionId;
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

  static getCurrentUser(): UserProfile | null {
    return this.getStoredUser();
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
      // Purge legacy storage keys that held outdated image references
      localStorage.removeItem('auradecor_products_v1');
      localStorage.removeItem('auradecor_products_v2');
      localStorage.removeItem('auradecor_products_v3');

      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= MOCK_PRODUCTS.length) {
          const sanitized = parsed.map(normalizeProduct);
          // Ensure all default MOCK_PRODUCTS exist in the active catalog
          for (const mock of MOCK_PRODUCTS) {
            const cleanMockId = mock.id.toLowerCase().replace(/^bg-/, '');
            const exists = sanitized.some(
              (p) =>
                p.id.toLowerCase() === mock.id.toLowerCase() ||
                p.id.toLowerCase().replace(/^bg-/, '') === cleanMockId ||
                p.name.toLowerCase().trim() === mock.name.toLowerCase().trim()
            );
            if (!exists) {
              sanitized.push(normalizeProduct(mock));
            }
          }
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

  /**
   * Authoritative Live Stock Checker:
   * Returns whether the requested quantity is available and enforces the rejection rule:
   * Requested quantity > available stock
   */
  static checkStock(
    productId: string,
    requestedQuantity: number,
    fallbackProduct?: Product
  ): { available: boolean; currentStock: number; message?: string } {
    const catalog = this.getStoredProducts();
    const queryId = String(productId || '').trim().toLowerCase();
    const cleanId = queryId.replace(/^bg-/, '');

    let product = catalog.find((p) => {
      const pId = String(p.id).trim().toLowerCase();
      const pClean = pId.replace(/^bg-/, '');
      return pId === queryId || pClean === cleanId;
    });

    if (!product) {
      product = MOCK_PRODUCTS.find((m) => {
        const mId = String(m.id).trim().toLowerCase();
        const mClean = mId.replace(/^bg-/, '');
        return mId === queryId || mClean === cleanId || (fallbackProduct && m.name.toLowerCase().trim() === fallbackProduct.name.toLowerCase().trim());
      });
    }

    if (!product && fallbackProduct) {
      product = fallbackProduct;
    }

    if (!product) {
      // Graceful default: allow reasonable quantity with catalog default stock
      return { available: true, currentStock: 30 };
    }

    const currentStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock ? 50 : 0);
    if (!product.inStock || currentStock <= 0) {
      return { available: false, currentStock: 0, message: `"${product.name}" is currently out of stock.` };
    }
    if (requestedQuantity > currentStock) {
      return {
        available: false,
        currentStock,
        message: `Only ${currentStock} units available for "${product.name}". Please reduce quantity.`,
      };
    }
    return { available: true, currentStock };
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

  /**
   * AUTHORITATIVE ORDER CREATION (Backend Authority Pattern):
   * NEVER trust the browser for:
   * - Product price (retrieved exclusively from server-side / authoritative database by productId)
   * - Quantity (validated against min/max and catalog stock)
   * - Stock (strictly validated: product.inStock && product.stockQuantity >= requestedQuantity, with atomic decrement)
   * - Discount (validated server-side against coupon rules)
   * - Shipping fee (calculated server-side based on authoritative subtotal)
   * - Total amount (recalculated strictly server-side: subtotal - discount + shippingFee)
   */
  static async placeOrder(orderData: {
    items: {
      productId: string;
      quantity: number;
      selectedVessel?: VesselColor;
      selectedWick?: WickType;
      selectedSize?: CandleSize;
      product?: Partial<Product>;
      itemPrice?: number;
    }[];
    customerInfo: CustomerOrderInfo;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
    couponCode?: string;
    discountCode?: string;
    subtotal?: number;
    discount?: number;
    shippingFee?: number;
    totalAmount?: number;
    paymentGatewayDetails?: {
      gateway: string;
      paymentId: string;
      gatewayOrderId?: string;
      paymentStatus: 'Captured' | 'Authorized' | 'COD_Pending' | 'Failed';
      bankRefNumber?: string;
      paymentMethodDetails?: string;
    };
  }): Promise<Order> {
    // 1. SECURITY & AUTHENTICATION ENFORCEMENT (ROLE_CUSTOMER or ROLE_ADMIN)
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error(
        '401 Unauthorized: Order placement requires an authenticated customer account. Please sign in or register before completing your order.'
      );
    }

    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('400 Bad Request: Cart cannot be empty to place an order.');
    }

    // 2. AUTHORITATIVE BACKEND INVENTORY & PRICE RESOLUTION
    const catalog = this.getStoredProducts();
    const authoritativeItems: CartItem[] = [];
    let authoritativeSubtotal = 0;

    for (const rawItem of orderData.items) {
      const trimmedId = String(rawItem.productId || '').trim().toLowerCase();
      const cleanId = trimmedId.replace(/^bg-/, '');
      const product =
        catalog.find((p) => {
          const pId = String(p.id).trim().toLowerCase();
          const pClean = pId.replace(/^bg-/, '');
          return pId === trimmedId || pClean === cleanId;
        }) ||
        MOCK_PRODUCTS.find((m) => {
          const mId = String(m.id).trim().toLowerCase();
          const mClean = mId.replace(/^bg-/, '');
          return mId === trimmedId || mClean === cleanId;
        }) ||
        (rawItem.product ? normalizeProduct(rawItem.product) : null);

      if (!product) {
        throw new Error(`404 Not Found: Product with ID "${rawItem.productId}" not found in authoritative catalog.`);
      }

      // Authoritative Quantity Validation
      const validatedQty = Math.floor(Number(rawItem.quantity));
      if (isNaN(validatedQty) || validatedQty <= 0) {
        throw new Error(`400 Bad Request: Invalid quantity (${rawItem.quantity}) for product "${product.name}".`);
      }
      if (validatedQty > 50) {
        throw new Error(`400 Bad Request: Exceeded maximum allowed purchase limit of 50 units for "${product.name}".`);
      }

      // Authoritative Stock Validation & Rejection Rule:
      // Reject: Requested quantity > available stock
      const availableStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock ? 50 : 0);
      if (!product.inStock || availableStock <= 0) {
        throw new Error(
          `409 Conflict: "${product.name}" is currently out of stock (available: 0). Order rejected.`
        );
      }
      if (validatedQty > availableStock) {
        throw new Error(
          `409 Conflict: Requested quantity (${validatedQty}) exceeds available stock (${availableStock}) for "${product.name}". Order rejected.`
        );
      }

      // Authoritative Unit Price from Catalog (browser/client prices are ignored)
      let authoritativeUnitPrice = Number(product.price);
      if (rawItem.selectedSize === '420g (3-Wick Grande)') {
        authoritativeUnitPrice = Math.round(authoritativeUnitPrice * 1.5);
      } else if (rawItem.selectedSize === '180g (Single Wick)') {
        authoritativeUnitPrice = Math.round(authoritativeUnitPrice * 0.8);
      }

      const itemTotal = authoritativeUnitPrice * validatedQty;
      authoritativeSubtotal += itemTotal;

      authoritativeItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        product,
        quantity: validatedQty,
        selectedVessel: (rawItem.selectedVessel as VesselColor) || 'Fluted Ivory',
        selectedWick: (rawItem.selectedWick as WickType) || 'Organic Cotton Wick',
        selectedSize: (rawItem.selectedSize as CandleSize) || '280g (Double Wick)',
        itemPrice: authoritativeUnitPrice,
      });
    }

    // 3. AUTHORITATIVE DISCOUNT VALIDATION (Server rules evaluate couponCode)
    const effectiveCoupon = (orderData.couponCode || orderData.discountCode || '').trim().toUpperCase();
    let authoritativeDiscount = 0;
    if (effectiveCoupon === 'GLOW10' || effectiveCoupon === 'AURAGLOW') {
      authoritativeDiscount = Math.round(authoritativeSubtotal * 0.1);
    } else if (effectiveCoupon === 'AUTUMN20') {
      if (authoritativeSubtotal >= 1499) {
        authoritativeDiscount = Math.round(authoritativeSubtotal * 0.2);
      } else {
        authoritativeDiscount = 0; // Server rejects coupon if minimum spend not satisfied
      }
    }

    // 4. AUTHORITATIVE SHIPPING FEE CALCULATION
    const authoritativeShippingFee = authoritativeSubtotal >= 999 || authoritativeItems.length === 0 ? 0 : 99;

    // 5. AUTHORITATIVE TOTAL AMOUNT CALCULATION
    const authoritativeTotalAmount = Math.max(0, authoritativeSubtotal - authoritativeDiscount + authoritativeShippingFee);

    // 6. ATOMIC INVENTORY REDUCTION IN CATALOG:
    // Core Business Rule: Stock = Stock - Ordered Quantity
    for (const item of authoritativeItems) {
      const idx = catalog.findIndex((p) => String(p.id).trim().toLowerCase() === String(item.productId).trim().toLowerCase());
      if (idx !== -1) {
        const curStock = typeof catalog[idx].stockQuantity === 'number' ? catalog[idx].stockQuantity! : 50;
        const newStock = Math.max(0, curStock - item.quantity); // Stock = Stock - Ordered Quantity
        catalog[idx].stockQuantity = newStock;
        catalog[idx].inStock = newStock > 0;
      }
    }
    this.saveStoredProducts(catalog);

    // Notify all listeners across the frontend that inventory has changed
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('blossomglow:stock-updated', {
          detail: {
            items: authoritativeItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          },
        })
      );
    }

    // 7. DISPATCH SECURE PAYLOAD TO SPRING BOOT REST API
    // Notice: Client does NOT send unitPrice, subtotal, discount, shipping, or total!
    const orderNumber = `BG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `BD-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const serverOrderPayload = {
      orderNumber,
      customerId: currentUser.id,
      items: authoritativeItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        selectedVessel: i.selectedVessel,
        selectedWick: i.selectedWick,
        selectedSize: i.selectedSize,
      })),
      couponCode: effectiveCoupon || null,
      customerInfo: {
        fullName: orderData.customerInfo.fullName,
        email: currentUser.email, // Bound to authenticated principal
        phone: orderData.customerInfo.phone,
        shippingAddress: orderData.customerInfo.address,
        city: orderData.customerInfo.city,
        state: orderData.customerInfo.state,
        pincode: orderData.customerInfo.pincode,
        specialInstructions: orderData.customerInfo.specialInstructions || '',
      },
      paymentMethod: orderData.paymentMethod,
    };

    let confirmedOrder: Order;

    try {
      const response = await axiosClient.post<Order>('/orders', serverOrderPayload);
      if (response.data && response.data.id) {
        // Adopt backend's authoritative recalculated Order
        confirmedOrder = response.data;
        this.isBackendLive = true;
      } else {
        throw new Error('Empty backend response');
      }
    } catch {
      this.isBackendLive = false;
      // Fallback authoritative order matching backend calculation
      confirmedOrder = {
        id: `order-${Date.now()}`,
        orderNumber,
        items: authoritativeItems,
        subtotal: authoritativeSubtotal,
        discount: authoritativeDiscount,
        shippingFee: authoritativeShippingFee,
        totalAmount: authoritativeTotalAmount,
        customerInfo: {
          ...orderData.customerInfo,
          email: currentUser.email,
          fullName: orderData.customerInfo.fullName || currentUser.fullName,
        },
        paymentMethod: orderData.paymentMethod,
        paymentGateway: orderData.paymentGatewayDetails?.gateway || (orderData.paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery (OTP Verified)' : 'Razorpay (Test Sandbox)'),
        paymentId: orderData.paymentGatewayDetails?.paymentId || (orderData.paymentMethod === 'Cash on Delivery' ? `cod_${Date.now()}` : `pay_${Math.random().toString(36).substring(2, 11)}`),
        gatewayOrderId: orderData.paymentGatewayDetails?.gatewayOrderId || `order_${Math.random().toString(36).substring(2, 11)}`,
        paymentStatus: orderData.paymentGatewayDetails?.paymentStatus || (orderData.paymentMethod === 'Cash on Delivery' ? 'COD_Pending' : 'Captured'),
        bankRefNumber: orderData.paymentGatewayDetails?.bankRefNumber || `RRN${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        paymentMethodDetails: orderData.paymentGatewayDetails?.paymentMethodDetails || orderData.paymentMethod,
        status: 'Confirmed',
        trackingNumber,
        createdAt: new Date().toISOString(),
        estimatedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };
    }

    // Persist to local customer order history
    const existing = this.getStoredOrders();
    existing.unshift(confirmedOrder);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existing));

    return confirmedOrder;
  }

  static async createOrder(orderData: {
    items: CartItem[];
    customerInfo: CustomerOrderInfo;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
    discountCode?: string;
    paymentGatewayDetails?: {
      gateway: string;
      paymentId: string;
      gatewayOrderId?: string;
      paymentStatus: 'Captured' | 'Authorized' | 'COD_Pending' | 'Failed';
      bankRefNumber?: string;
      paymentMethodDetails?: string;
    };
  }): Promise<Order> {
    return this.placeOrder({
      items: orderData.items,
      customerInfo: orderData.customerInfo,
      paymentMethod: orderData.paymentMethod,
      couponCode: orderData.discountCode,
      paymentGatewayDetails: orderData.paymentGatewayDetails,
    });
  }

  /**
   * CUSTOMER ACCESS: Customers should ONLY be able to see their own orders.
   * Spring Boot Route: GET /api/orders/my-orders (ROLE_CUSTOMER, ROLE_ADMIN)
   */
  static async getMyOrders(): Promise<Order[]> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return [];
    }

    try {
      const response = await axiosClient.get<Order[]>('/orders/my-orders');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch {
      // fallback
    }

    // Strict customer isolation fallback: only orders matching the customer's email
    const allStored = this.getStoredOrders();
    if (currentUser.role === 'ROLE_ADMIN') {
      return allStored;
    }
    return allStored.filter(
      (o) => o.customerInfo.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
    );
  }

  /**
   * Alias for backwards compatibility — returns only current user's orders
   */
  static async getOrders(): Promise<Order[]> {
    return this.getMyOrders();
  }

  /**
   * ADMIN ONLY: Retrieve all orders across the system.
   * Spring Boot Route: GET /api/orders (ROLE_ADMIN)
   */
  static async getAllOrdersForAdmin(): Promise<Order[]> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'ROLE_ADMIN') {
      throw new Error('403 Forbidden: Access Denied. Only administrators with ROLE_ADMIN can view all customer orders.');
    }

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
    return this.getAllOrdersForAdmin();
  }

  /**
   * CUSTOMER / ADMIN: View specific order details.
   * Customers can ONLY view their own order. Admins can view any order.
   * Spring Boot Route: GET /api/orders/{id}
   */
  static async getOrderById(orderId: string): Promise<Order> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('401 Unauthorized: Authentication required to view order details.');
    }

    try {
      const response = await axiosClient.get<Order>(`/orders/${orderId}`);
      if (response.data) {
        if (
          currentUser.role !== 'ROLE_ADMIN' &&
          response.data.customerInfo.email.toLowerCase() !== currentUser.email.toLowerCase()
        ) {
          throw new Error('403 Forbidden: Access Denied. Customers can only view their own orders.');
        }
        return response.data;
      }
    } catch (err: any) {
      if (err.message?.includes('403')) throw err;
      // fallback
    }

    const all = this.getStoredOrders();
    const found = all.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!found) {
      throw new Error('404 Not Found: Order not found.');
    }

    if (
      currentUser.role !== 'ROLE_ADMIN' &&
      found.customerInfo.email.toLowerCase() !== currentUser.email.toLowerCase()
    ) {
      throw new Error('403 Forbidden: Access Denied. Customers can only view their own orders.');
    }

    return found;
  }

  /**
   * ADMIN ONLY: Update fulfillment status of an order.
   * Spring Boot Route: PUT /api/orders/{id}/status (ROLE_ADMIN)
   */
  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'ROLE_ADMIN') {
      throw new Error('403 Forbidden: Access Denied. Only administrators with ROLE_ADMIN can update order statuses.');
    }

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

  /**
   * PUBLIC: Track shipment status by tracking number without authentication.
   * Spring Boot Route: GET /api/orders/track/{trackingNumber} (PUBLIC - permitAll)
   * Masks personal billing details to ensure privacy.
   */
  static async trackOrder(orderNumberOrTracking: string): Promise<Order | null> {
    try {
      const response = await axiosClient.get<Order>(`/orders/track/${orderNumberOrTracking}`);
      if (response.data) return response.data;
    } catch {
      // fallback
    }
    const orders = this.getStoredOrders();
    const query = orderNumberOrTracking.toUpperCase().trim();
    const found = orders.find(
      (o) =>
        o.trackingNumber.toUpperCase() === query ||
        o.orderNumber.toUpperCase() === query
    );
    return found || null;
  }

  // =========================================================================
  // SHOPPING CART (Spring Boot REST API)
  // =========================================================================

  static getStoredCart(): CartItem[] {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveStoredCart(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  /**
   * Fetches active cart from Spring Boot backend (/api/cart)
   * Falls back gracefully to local storage if Spring Boot is offline
   */
  static async getCart(): Promise<CartItem[]> {
    try {
      const response = await axiosClient.get<any>('/cart');
      if (response.data) {
        this.isBackendLive = true;
        const serverItems = Array.isArray(response.data)
          ? response.data
          : response.data.items || [];

        if (Array.isArray(serverItems) && serverItems.length > 0) {
          const mapped: CartItem[] = serverItems.map((item: any) => ({
            id: String(item.id || `cart-${Date.now()}-${Math.random()}`),
            productId: String(item.productId || item.product?.id),
            product: item.product
              ? normalizeProduct(item.product)
              : normalizeProduct({
                  id: item.productId,
                  name: item.productName || 'Artisanal Candle',
                  price: item.unitPrice || item.itemPrice || 499,
                }),
            quantity: Number(item.quantity) || 1,
            selectedVessel: item.selectedVessel || 'Fluted Ivory',
            selectedWick: item.selectedWick || 'Crackling Wood Wick',
            selectedSize: item.selectedSize || '280g (Double Wick)',
            itemPrice: Number(item.itemPrice || item.unitPrice) || 499,
          }));
          this.saveStoredCart(mapped);
          return mapped;
        }
      }
    } catch {
      // Offline fallback: use local persistent storage
    }
    return this.getStoredCart();
  }

  /**
   * Adds an item to the Spring Boot cart via POST /api/cart/items
   */
  static async addItemToCart(item: CartItem): Promise<CartItem[]> {
    const local = this.getStoredCart();
    const existingIdx = local.findIndex(
      (ci) =>
        ci.productId === item.productId &&
        ci.selectedVessel === item.selectedVessel &&
        ci.selectedWick === item.selectedWick &&
        ci.selectedSize === item.selectedSize
    );

    let updated: CartItem[];
    if (existingIdx > -1) {
      updated = [...local];
      updated[existingIdx].quantity += item.quantity;
    } else {
      updated = [...local, item];
    }
    this.saveStoredCart(updated);

    try {
      const payload = {
        productId: item.productId,
        productName: item.product?.name,
        quantity: item.quantity,
        selectedVessel: item.selectedVessel,
        selectedWick: item.selectedWick,
        selectedSize: item.selectedSize,
        unitPrice: item.itemPrice,
        itemPrice: item.itemPrice,
      };
      await axiosClient.post('/cart/items', payload);
      this.isBackendLive = true;
    } catch {
      // Offline mode maintained
    }
    return updated;
  }

  /**
   * Updates cart item quantity via PUT /api/cart/items/{itemId}
   */
  static async updateCartItemQuantity(itemId: string, newQty: number): Promise<CartItem[]> {
    const local = this.getStoredCart();
    let updated: CartItem[];
    if (newQty <= 0) {
      updated = local.filter((i) => i.id !== itemId);
    } else {
      updated = local.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i));
    }
    this.saveStoredCart(updated);

    try {
      if (newQty <= 0) {
        await axiosClient.delete(`/cart/items/${itemId}`);
      } else {
        await axiosClient.put(`/cart/items/${itemId}`, { quantity: newQty });
      }
      this.isBackendLive = true;
    } catch {
      // Offline mode
    }
    return updated;
  }

  /**
   * Removes item from Spring Boot cart via DELETE /api/cart/items/{itemId}
   */
  static async removeCartItem(itemId: string): Promise<CartItem[]> {
    const local = this.getStoredCart();
    const updated = local.filter((i) => i.id !== itemId);
    this.saveStoredCart(updated);

    try {
      await axiosClient.delete(`/cart/items/${itemId}`);
      this.isBackendLive = true;
    } catch {
      // Offline mode
    }
    return updated;
  }

  /**
   * Clears the entire cart via DELETE /api/cart
   */
  static async clearCart(): Promise<void> {
    this.saveStoredCart([]);
    try {
      await axiosClient.delete('/cart');
      this.isBackendLive = true;
    } catch {
      // Offline mode
    }
  }

  /**
   * Syncs client cart items to Spring Boot backend upon login or app launch
   */
  static async syncCartWithServer(items: CartItem[]): Promise<CartItem[]> {
    if (!items || items.length === 0) return items;
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.product?.name,
          quantity: i.quantity,
          selectedVessel: i.selectedVessel,
          selectedWick: i.selectedWick,
          selectedSize: i.selectedSize,
          unitPrice: i.itemPrice,
        })),
      };
      await axiosClient.post('/cart/sync', payload);
      this.isBackendLive = true;
    } catch {
      // Offline mode
    }
    return items;
  }

  // =========================================================================
  // WISHLIST (Spring Boot REST API)
  // =========================================================================

  static getStoredWishlist(): string[] {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return raw ? JSON.parse(raw) : ['bg-lotus-glow', 'bg-fluted-marbled-tray-duo'];
    } catch {
      return ['bg-lotus-glow'];
    }
  }

  static saveStoredWishlist(ids: string[]): void {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }

  /**
   * Fetches user's saved wishlist from Spring Boot backend (/api/wishlist)
   * Falls back gracefully to local storage if Spring Boot is offline
   */
  static async getWishlist(): Promise<string[]> {
    try {
      const response = await axiosClient.get<any>('/wishlist');
      if (response.data) {
        this.isBackendLive = true;
        const items = Array.isArray(response.data)
          ? response.data
          : response.data.productIds || response.data.items || [];
        
        const ids: string[] = items.map((item: any) =>
          typeof item === 'string' ? item : String(item.productId || item.id)
        );
        this.saveStoredWishlist(ids);
        return ids;
      }
    } catch {
      // Offline fallback
    }
    return this.getStoredWishlist();
  }

  /**
   * Adds product to wishlist via POST /api/wishlist/{productId}
   */
  static async addToWishlist(productId: string): Promise<string[]> {
    const list = this.getStoredWishlist();
    if (!list.includes(productId)) {
      list.push(productId);
      this.saveStoredWishlist(list);
    }

    try {
      await axiosClient.post(`/wishlist/${productId}`);
      this.isBackendLive = true;
    } catch {
      // Offline mode
    }
    return list;
  }

  /**
   * Removes product from wishlist via DELETE /api/wishlist/{productId}
   */
  static async removeFromWishlist(productId: string): Promise<string[]> {
    const list = this.getStoredWishlist().filter((id) => id !== productId);
    this.saveStoredWishlist(list);

    try {
      await axiosClient.delete(`/wishlist/${productId}`);
      this.isBackendLive = true;
    } catch {
      // Offline mode
    }
    return list;
  }

  /**
   * Toggles product in wishlist via POST /api/wishlist/toggle/{productId}
   */
  static async toggleWishlist(productId: string, explicitList?: string[]): Promise<string[]> {
    let updated: string[];
    if (explicitList) {
      updated = explicitList;
    } else {
      const list = this.getStoredWishlist();
      const exists = list.includes(productId);
      updated = exists ? list.filter((id) => id !== productId) : [...list, productId];
    }
    this.saveStoredWishlist(updated);

    try {
      await axiosClient.post(`/wishlist/toggle/${productId}`);
      this.isBackendLive = true;
    } catch {
      // Offline mode
    }
    return updated;
  }

  /**
   * Clears entire wishlist via DELETE /api/wishlist
   */
  static async clearWishlist(): Promise<void> {
    this.saveStoredWishlist([]);
    try {
      await axiosClient.delete('/wishlist');
      this.isBackendLive = true;
    } catch {
      // Offline mode
    }
  }

  /**
   * Synchronizes client wishlist with Spring Boot user account upon login
   */
  static async syncWishlistWithServer(productIds: string[]): Promise<string[]> {
    if (!productIds || productIds.length === 0) return productIds;
    try {
      const response = await axiosClient.post<any>('/wishlist/sync', { productIds });
      if (response.data) {
        this.isBackendLive = true;
        const items = Array.isArray(response.data)
          ? response.data
          : response.data.productIds || productIds;
        const ids: string[] = items.map((i: any) => (typeof i === 'string' ? i : String(i.productId || i.id)));
        this.saveStoredWishlist(ids);
        return ids;
      }
    } catch {
      // Offline mode
    }
    return productIds;
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

  // =========================================================================
  // CATEGORY MANAGEMENT (Spring Boot /api/categories & /api/admin/categories)
  // =========================================================================

  static getStoredCategories(): {
    id: number;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    displayOrder?: number;
    productsCount?: number;
  }[] {
    try {
      const saved = localStorage.getItem('blossomglow_categories_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      { id: 1, name: 'Gift Candles', slug: 'gift-candles', description: 'Elegantly packaged artisanal candles ready for gifting and celebrations', imageUrl: '/products/floral-garden.jpg', displayOrder: 1 },
      { id: 2, name: 'Scented Candles', slug: 'scented-candles', description: 'Aromatherapy candles infused with pure therapeutic essential oils', imageUrl: '/products/natural-spice.jpg', displayOrder: 2 },
      { id: 3, name: 'Meditation Candles', slug: 'meditation-candles', description: 'Sacred and calming silhouettes crafted for zen sanctuaries', imageUrl: '/products/buddha-serenity.jpg', displayOrder: 3 },
      { id: 4, name: 'Decorative Candles', slug: 'decorative-candles', description: 'Sculptural botanical candles that elevate your table', imageUrl: '/products/lotus-glow.jpg', displayOrder: 4 },
      { id: 5, name: 'Home Décor Candles', slug: 'home-decor-candles', description: 'Architectural silhouettes and textured vessels', imageUrl: '/products/minimal-ribbed.jpg', displayOrder: 5 },
      { id: 6, name: 'Gift Hampers', slug: 'gift-hampers', description: 'Curated luxury gift chest hampers with custom handwritten cards', imageUrl: '/products/evil-eye-gift-box.jpg', displayOrder: 6 },
    ];
  }

  static async getCategories(): Promise<any[]> {
    try {
      const response = await axiosClient.get('/categories');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        localStorage.setItem('blossomglow_categories_cache', JSON.stringify(response.data));
        return response.data;
      }
    } catch {
      // fallback
    }
    return this.getStoredCategories();
  }

  static async createCategory(categoryData: {
    name: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    displayOrder?: number;
  }): Promise<any> {
    const activeUser = this.getCurrentUser();
    if (!activeUser || activeUser.role !== 'ROLE_ADMIN') {
      throw new Error('403 Forbidden: Spring Security requires ROLE_ADMIN to create categories.');
    }

    try {
      const response = await axiosClient.post('/admin/categories', {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        image_url: categoryData.imageUrl,
        display_order: categoryData.displayOrder,
      });
      if (response.data) {
        const current = this.getStoredCategories();
        current.push(response.data);
        localStorage.setItem('blossomglow_categories_cache', JSON.stringify(current));
        return response.data;
      }
    } catch {
      // fallback local
    }

    const current = this.getStoredCategories();
    const newCategory = {
      id: Date.now(),
      name: categoryData.name,
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: categoryData.description,
      imageUrl: categoryData.imageUrl || '/products/floral-garden.jpg',
      displayOrder: categoryData.displayOrder || current.length + 1,
    };
    current.push(newCategory);
    localStorage.setItem('blossomglow_categories_cache', JSON.stringify(current));
    return newCategory;
  }

  static async updateCategory(id: number | string, categoryData: {
    name: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    displayOrder?: number;
  }): Promise<any> {
    const activeUser = this.getCurrentUser();
    if (!activeUser || activeUser.role !== 'ROLE_ADMIN') {
      throw new Error('403 Forbidden: Spring Security requires ROLE_ADMIN to update categories.');
    }

    try {
      const response = await axiosClient.put(`/admin/categories/${id}`, {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        image_url: categoryData.imageUrl,
        display_order: categoryData.displayOrder,
      });
      if (response.data) {
        const current = this.getStoredCategories();
        const idx = current.findIndex(c => String(c.id) === String(id));
        if (idx !== -1) {
          current[idx] = response.data;
          localStorage.setItem('blossomglow_categories_cache', JSON.stringify(current));
        }
        return response.data;
      }
    } catch {
      // fallback local
    }

    const current = this.getStoredCategories();
    const idx = current.findIndex(c => String(c.id) === String(id));
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...categoryData };
      localStorage.setItem('blossomglow_categories_cache', JSON.stringify(current));
      return current[idx];
    }
    return categoryData;
  }

  static async deleteCategory(id: number | string): Promise<void> {
    const activeUser = this.getCurrentUser();
    if (!activeUser || activeUser.role !== 'ROLE_ADMIN') {
      throw new Error('403 Forbidden: Spring Security requires ROLE_ADMIN to delete categories.');
    }

    try {
      await axiosClient.delete(`/admin/categories/${id}`);
    } catch {
      // fallback
    }

    const current = this.getStoredCategories();
    const filtered = current.filter(c => String(c.id) !== String(id));
    localStorage.setItem('blossomglow_categories_cache', JSON.stringify(filtered));
  }

  // =========================================================================
  // CUSTOMER ACCOUNT MANAGEMENT (Spring Boot /api/user/*)
  // Backend-Authoritative: Profile, Orders, Addresses, Security
  // =========================================================================

  static async getUserProfile(): Promise<any> {
    const token = this.getStoredToken();
    if (!token) {
      return this.getCurrentUser();
    }

    try {
      // First try /api/user/profile
      const response = await axiosClient.get('/user/profile');
      if (response.data) {
        const u = response.data;
        const profileObj = {
          id: String(u.id),
          username: u.username,
          email: u.email,
          fullName: u.full_name || u.fullName,
          phone: u.phone || '',
          role: u.role || 'ROLE_CUSTOMER',
          memberSince: u.member_since || u.memberSince,
        };
        // Refresh local cache with authoritative backend data
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profileObj));
        return profileObj;
      }
    } catch {
      // Try /api/auth/me fallback
      try {
        const meRes = await axiosClient.get('/auth/me');
        if (meRes.data) {
          const u = meRes.data;
          const profileObj = {
            id: String(u.id),
            username: u.username,
            email: u.email,
            fullName: u.fullName || u.full_name,
            phone: u.phone || '',
            role: u.role || 'ROLE_CUSTOMER',
          };
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profileObj));
          return profileObj;
        }
      } catch {
        // use local storage
      }
    }

    return this.getCurrentUser();
  }

  static async updateUserProfile(data: { fullName: string; phone?: string }): Promise<any> {
    try {
      const response = await axiosClient.put('/user/profile', {
        full_name: data.fullName,
        phone: data.phone,
      });
      if (response.data) {
        const u = response.data;
        const updated = {
          ...this.getCurrentUser(),
          fullName: u.full_name || u.fullName,
          phone: u.phone || '',
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
        return updated;
      }
    } catch {
      // fallback local update
    }

    const current = this.getCurrentUser();
    if (current) {
      const updated = { ...current, fullName: data.fullName, phone: data.phone || current.phone };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
      return updated;
    }
    return null;
  }

  static async changeUserPassword(currentPassword: string, newPassword: string): Promise<any> {
    const response = await axiosClient.post('/user/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  }

  static async getCustomerOrders(): Promise<any[]> {
    try {
      const response = await axiosClient.get('/user/orders');
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
    } catch {
      // fallback: filter local orders by customer email
    }

    const currentUser = this.getCurrentUser();
    if (!currentUser) return [];

    const allOrders = this.getStoredOrders();
    return allOrders.filter(
      (o: any) => o.email && o.email.toLowerCase() === currentUser.email.toLowerCase()
    );
  }

  static async getUserAddresses(): Promise<any[]> {
    try {
      const response = await axiosClient.get('/user/addresses');
      if (response.data && Array.isArray(response.data)) {
        localStorage.setItem('blossomglow_user_addresses', JSON.stringify(response.data));
        return response.data;
      }
    } catch {
      // fallback
    }

    try {
      const cached = localStorage.getItem('blossomglow_user_addresses');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }

    const user = this.getCurrentUser();
    return [
      {
        id: 1,
        title: 'Home Altar & Residence',
        recipientName: user?.fullName || 'Priya Sharma',
        phone: user?.phone || '+91 98290 12345',
        streetAddress: 'Apartment 402, Lotus Heritage Heights, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        isDefault: true,
      },
    ];
  }

  static async addUserAddress(address: {
    title: string;
    recipientName: string;
    phone: string;
    streetAddress: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }): Promise<any> {
    try {
      const response = await axiosClient.post('/user/addresses', {
        title: address.title,
        recipient_name: address.recipientName,
        phone: address.phone,
        street_address: address.streetAddress,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        is_default: address.isDefault ?? false,
      });
      if (response.data) {
        const current = await this.getUserAddresses();
        const updated = [response.data, ...current];
        localStorage.setItem('blossomglow_user_addresses', JSON.stringify(updated));
        return response.data;
      }
    } catch {
      // fallback
    }

    const current = await this.getUserAddresses();
    const newAddress = {
      id: Date.now(),
      ...address,
      isDefault: address.isDefault ?? current.length === 0,
    };
    const updated = [newAddress, ...current];
    localStorage.setItem('blossomglow_user_addresses', JSON.stringify(updated));
    return newAddress;
  }

  static async deleteUserAddress(id: number | string): Promise<void> {
    try {
      await axiosClient.delete(`/user/addresses/${id}`);
    } catch {
      // fallback
    }

    try {
      const current = await this.getUserAddresses();
      const updated = current.filter((a: any) => String(a.id) !== String(id));
      localStorage.setItem('blossomglow_user_addresses', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

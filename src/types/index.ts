export type FragranceFamily = 'Floral' | 'Woody & Amber' | 'Fresh & Herbal' | 'Gourmand & Warm' | 'All';

export type WickType = 'Crackling Wood Wick' | 'Organic Cotton Wick';
export type VesselColor = 'Frosted Amber' | 'Matte Blush Cream' | 'Fluted Ivory' | 'Slate Obsidian';
export type CandleSize = '180g (Single Wick)' | '280g (Double Wick)' | '420g (3-Wick Grande)';

export interface ScentPyramid {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
}

export type ProductCategory =
  | 'All'
  | 'All Creations'
  | 'Pillar Candles'
  | 'Jar & Container Candles'
  | 'Floating & Urli Candles'
  | 'Floating & Urli Sets'
  | 'Sculptural Candles'
  | 'Diffusers & Oils'
  | 'Diffusers & Home Accents'
  | 'Luxury Gift Hampers'
  | 'Botanical Bowls & Shells'
  | 'Home Décor & Tapers'
  | 'Gift Candles'
  | 'Scented Candles'
  | 'Meditation Candles'
  | 'Decorative Candles'
  | 'Home Décor Candles'
  | 'Gift Sets'
  | 'Meditation & Wellness'
  | 'Home Décor'
  | 'Festive Collection'
  | 'Gift Hampers'
  | 'Aromatherapy Jars'
  | 'Artisanal Decor';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  fragranceFamily: 'Floral' | 'Woody & Amber' | 'Fresh & Herbal' | 'Gourmand & Warm';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  galleryImages: string[];
  burnTimeHours: number;
  weightGrams: number;
  scentIntensity: number; // 1 to 5
  scentPyramid: ScentPyramid;
  description: string;
  artisanStory: string;
  availableVessels: VesselColor[];
  availableWicks: WickType[];
  inStock: boolean;
  stockQuantity?: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  seasonRelease?: string;
  waxType?: string;
  dimensions?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedVessel: VesselColor;
  selectedWick: WickType;
  selectedSize: CandleSize;
  itemPrice: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  candleName: string;
}

export interface CustomerOrderInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  specialInstructions?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  customerInfo: CustomerOrderInfo;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  status: OrderStatus;
  trackingNumber: string;
  createdAt: string;
  estimatedDeliveryDate: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface HamperCustomization {
  selectedCandles: Product[];
  boxFinish: 'Matte Ivory & Gold' | 'Heritage Emerald' | 'Midnight Obsidian';
  ribbonColor: 'Champagne Satin' | 'Deep Amber Grosgrain' | 'Forest Velvet';
  giftMessage: string;
  recipientName: string;
  brassSnufferIncluded: boolean;
}

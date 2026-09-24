/**
 * BlossomGlow Candle Creations - Announcement Bar Configuration
 *
 * Make announcement text editable from this single configuration file.
 */

export interface AnnouncementItem {
  id: string;
  text: string;
  badge?: string;
  code?: string;
  linkText?: string;
}

export const ANNOUNCEMENT_CONFIG: {
  enabled: boolean;
  autoRotate: boolean;
  rotationIntervalMs: number;
  announcements: AnnouncementItem[];
} = {
  enabled: true,
  autoRotate: true,
  rotationIntervalMs: 4500,
  announcements: [
    {
      id: 'shipping-promo',
      text: 'Free Pan-India Delivery on Orders Above ₹999 | Code: GLOW10',
      badge: 'Free Shipping',
      code: 'GLOW10',
      linkText: 'Apply Code for 10% Off',
    },
    {
      id: 'festive-urli',
      text: 'Festive Special: Handcrafted Floating Flower Candles & Hammered Golden Urli Sets Now In Stock ✨',
      badge: 'Festive Edit',
    },
    {
      id: 'pillars',
      text: 'Signature Scented Pillar Candles: 100% Smokeless Burn & Natural Essential Oils 🌿',
      badge: 'Bestseller',
    },
    {
      id: 'corporate-gifting',
      text: 'Luxury Corporate & Festive Wedding Gift Hampers Available for Custom Orders',
      badge: 'Gifting Studio',
    },
  ],
};

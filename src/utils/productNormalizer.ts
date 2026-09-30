import { Product, ProductCategory, FragranceFamily } from '../types';
import { PRODUCT_ASSETS } from '../assets/products';
import { MOCK_PRODUCTS } from '../data/mockProducts';

// Fast direct lookup map for all known slugs & image filenames
const ASSET_LOOKUP: Record<string, string> = {
  'floral-garden': PRODUCT_ASSETS.floralGarden,
  'natural-spice': PRODUCT_ASSETS.naturalSpice,
  'buddha-serenity': PRODUCT_ASSETS.buddhaSerenity,
  'lotus-glow': PRODUCT_ASSETS.lotusGlow,
  'minimal-ribbed': PRODUCT_ASSETS.minimalRibbed,
  'evil-eye-gift-box': PRODUCT_ASSETS.evilEyeBox,
  'evil-eye-box': PRODUCT_ASSETS.evilEyeBox,
  'wooden-dough-bowl': PRODUCT_ASSETS.woodenDoughBowl,
  'gilded-lotus-hamper': PRODUCT_ASSETS.gildedLotusHamper,
  'fluted-marbled-tray-duo': PRODUCT_ASSETS.flutedMarbledTrayDuo,
  'fluted-carousel-jar': PRODUCT_ASSETS.flutedCarouselJar,
  'terrazzo-arch-vase': PRODUCT_ASSETS.terrazzoArchVase,
  'hollow-arch-bud-vase': PRODUCT_ASSETS.hollowArchBudVase,
  'wavy-ripple-tray': PRODUCT_ASSETS.wavyRippleTray,
  'concrete-arch-clock': PRODUCT_ASSETS.concreteArchClock,
  'teddy-baby-shower': PRODUCT_ASSETS.teddyBabyShower,
  'baby-elephant': PRODUCT_ASSETS.babyElephant,
};

/**
 * Resolves any raw image URL, database image_url, slug, or product title
 * into a verified, high-resolution bundled asset URL that works everywhere.
 */
export function resolveImage(rawUrl?: string, slug?: string, name?: string): string {
  // 1. Check if rawUrl matches a known key directly or as a filename
  if (rawUrl && typeof rawUrl === 'string') {
    // Already an in-memory/bundled asset (Vite asset, data URL, blob)
    if (rawUrl.startsWith('data:') || rawUrl.startsWith('blob:') || rawUrl.includes('/assets/')) {
      return rawUrl;
    }

    const clean = rawUrl.toLowerCase().replace(/\\/g, '/');
    const filename = clean.split('/').pop()?.replace(/\.(jpg|jpeg|png|webp|avif)$/, '') || '';

    if (filename && ASSET_LOOKUP[filename]) {
      return ASSET_LOOKUP[filename];
    }

    for (const [key, asset] of Object.entries(ASSET_LOOKUP)) {
      if (clean.includes(key)) {
        return asset;
      }
    }

    // Direct public static path
    if (clean.startsWith('/products/')) {
      return clean;
    }

    // Legacy or database path starting with /src/assets/products/
    if (clean.startsWith('/src/assets/products/')) {
      const publicPath = clean.replace('/src/assets/products/', '/products/');
      return publicPath;
    }
  }

  // 2. Check by slug
  if (slug) {
    const s = slug.toLowerCase().replace(/^bg-/, '');
    if (ASSET_LOOKUP[s]) return ASSET_LOOKUP[s];
    for (const [key, asset] of Object.entries(ASSET_LOOKUP)) {
      if (s.includes(key)) return asset;
    }
  }

  // 3. Check by product name keywords
  if (name) {
    const n = name.toLowerCase();
    if (n.includes('floral') || n.includes('rose')) return PRODUCT_ASSETS.floralGarden;
    if (n.includes('spice') || n.includes('coconut')) return PRODUCT_ASSETS.naturalSpice;
    if (n.includes('buddha') || n.includes('serenity')) return PRODUCT_ASSETS.buddhaSerenity;
    if (n.includes('lotus')) return PRODUCT_ASSETS.lotusGlow;
    if (n.includes('ribbed') || n.includes('minimal')) return PRODUCT_ASSETS.minimalRibbed;
    if (n.includes('evil eye')) return PRODUCT_ASSETS.evilEyeBox;
    if (n.includes('dough bowl') || n.includes('wooden')) return PRODUCT_ASSETS.woodenDoughBowl;
    if (n.includes('hamper')) return PRODUCT_ASSETS.gildedLotusHamper;
    if (n.includes('marbled')) return PRODUCT_ASSETS.flutedMarbledTrayDuo;
    if (n.includes('carousel')) return PRODUCT_ASSETS.flutedCarouselJar;
    if (n.includes('terrazzo')) return PRODUCT_ASSETS.terrazzoArchVase;
    if (n.includes('hollow arch')) return PRODUCT_ASSETS.hollowArchBudVase;
    if (n.includes('ripple') || n.includes('wavy')) return PRODUCT_ASSETS.wavyRippleTray;
    if (n.includes('clock')) return PRODUCT_ASSETS.concreteArchClock;
    if (n.includes('teddy')) return PRODUCT_ASSETS.teddyBabyShower;
    if (n.includes('elephant')) return PRODUCT_ASSETS.babyElephant;
  }

  // 4. Return valid non-empty rawUrl or default to signature floral garden
  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim().length > 0) {
    return rawUrl;
  }

  return PRODUCT_ASSETS.floralGarden;
}

/**
 * Normalizes any product object coming from MySQL/Spring Boot API or local storage,
 * guaranteeing all required fields, images, categories, and numeric types exist.
 */
export function normalizeProduct(raw: any): Product {
  if (!raw) {
    return MOCK_PRODUCTS[0];
  }

  const slug = raw.slug || (raw.id ? `bg-${raw.id}` : 'bg-product');
  const matchingMock = MOCK_PRODUCTS.find(
    (m) =>
      m.id === slug ||
      m.id === raw.id ||
      m.name.toLowerCase() === (raw.name || '').toLowerCase()
  );

  const rawImage = raw.image || raw.imageUrl;
  const resolvedMainImage = resolveImage(rawImage, slug, raw.name);

  // Resolve gallery images
  let resolvedGallery: string[] = [];
  if (Array.isArray(raw.galleryImages) && raw.galleryImages.length > 0) {
    resolvedGallery = raw.galleryImages.map((img: string) => resolveImage(img, slug, raw.name));
  } else if (matchingMock && matchingMock.galleryImages && matchingMock.galleryImages.length > 0) {
    resolvedGallery = matchingMock.galleryImages;
  } else {
    resolvedGallery = [resolvedMainImage];
  }

  if (!resolvedGallery.includes(resolvedMainImage)) {
    resolvedGallery.unshift(resolvedMainImage);
  }

  return {
    id: slug,
    name: raw.name || matchingMock?.name || 'Artisan Candle Creation',
    tagline: raw.tagline || matchingMock?.tagline || 'Handcrafted pure soy artisan candle',
    category: (raw.category || raw.categoryName || matchingMock?.category || 'Gift Candles') as ProductCategory,
    fragranceFamily: (raw.fragranceFamily && raw.fragranceFamily !== 'All'
      ? raw.fragranceFamily
      : matchingMock?.fragranceFamily || 'Floral') as Product['fragranceFamily'],
    price: typeof raw.price === 'number' ? raw.price : parseFloat(raw.price) || (matchingMock?.price ?? 499),
    originalPrice: raw.originalPrice
      ? typeof raw.originalPrice === 'number'
        ? raw.originalPrice
        : parseFloat(raw.originalPrice)
      : matchingMock?.originalPrice,
    rating: typeof raw.rating === 'number' ? raw.rating : parseFloat(raw.rating) || (matchingMock?.rating ?? 5.0),
    reviewsCount:
      typeof raw.reviewsCount === 'number'
        ? raw.reviewsCount
        : parseInt(raw.reviewsCount, 10) || (matchingMock?.reviewsCount ?? 24),
    image: resolvedMainImage,
    galleryImages: resolvedGallery,
    burnTimeHours: raw.burnTimeHours || matchingMock?.burnTimeHours || 45,
    weightGrams: raw.weightGrams || matchingMock?.weightGrams || 250,
    scentIntensity: raw.scentIntensity || matchingMock?.scentIntensity || 4,
    scentPyramid: raw.scentPyramid || matchingMock?.scentPyramid || {
      topNotes: ['Morning Rosebud Dew', 'Bulgarian Rose Water', 'Sweet Lychee'],
      heartNotes: ['Velvet Damask Rose Petals', 'White Peony', 'Wild Geranium'],
      baseNotes: ['White Cedarwood', 'Cashmere Musk', 'Subtle Amber Veil'],
    },
    description:
      raw.description ||
      matchingMock?.description ||
      'An elegant artisanal candle beautifully presented in a gift-ready vessel. Poured with 100% natural, biodegradable soy wax for a clean, non-toxic burn.',
    artisanStory:
      raw.artisanStory ||
      matchingMock?.artisanStory ||
      'Handcrafted and molded by our women candle artisans with mindful care and clean botanical essences.',
    availableVessels:
      raw.availableVessels ||
      matchingMock?.availableVessels || ['Fluted Ivory', 'Matte Blush Cream', 'Frosted Amber'],
    availableWicks:
      raw.availableWicks ||
      matchingMock?.availableWicks || ['Organic Cotton Wick', 'Crackling Wood Wick'],
    inStock:
      raw.stockQuantity !== undefined
        ? Number(raw.stockQuantity) > 0 && Boolean(raw.inStock ?? true)
        : raw.inStock !== undefined
        ? Boolean(raw.inStock)
        : true,
    stockQuantity:
      raw.stockQuantity !== undefined
        ? Math.max(0, Number(raw.stockQuantity))
        : (matchingMock?.stockQuantity ?? 35),
    isBestSeller: Boolean(raw.isBestSeller),
    isNewArrival: Boolean(raw.isNewArrival),
    seasonRelease: raw.seasonRelease || matchingMock?.seasonRelease || 'Atelier Collection',
    waxType: raw.waxType || matchingMock?.waxType || '100% Organic Soy Wax',
    dimensions: raw.dimensions || matchingMock?.dimensions || '8.5cm x 9.5cm',
  };
}

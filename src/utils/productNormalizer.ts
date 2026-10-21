import { Product, ProductCategory, FragranceFamily } from '../types';
import { PRODUCT_ASSETS } from '../assets/products';
import { MOCK_PRODUCTS } from '../data/mockProducts';

// Fast direct lookup map for all known slugs & image filenames
const ASSET_LOOKUP: Record<string, string> = {
  'floral-garden': PRODUCT_ASSETS.floralGarden,
  'floral_garden': PRODUCT_ASSETS.floralGarden,
  'bloom-rose': PRODUCT_ASSETS.floralGarden,
  'bloom_rose': PRODUCT_ASSETS.floralGarden,
  'bloom_rose_candles': PRODUCT_ASSETS.floralGarden,
  'whatsapp image 2026-09-09 at 08.58.16 (3)': PRODUCT_ASSETS.floralGarden,

  'natural-spice': PRODUCT_ASSETS.naturalSpice,
  'natural_spice': PRODUCT_ASSETS.naturalSpice,
  'coconut-shell': PRODUCT_ASSETS.naturalSpice,
  'coconut_shell': PRODUCT_ASSETS.naturalSpice,
  'coconut_shell_candle': PRODUCT_ASSETS.naturalSpice,
  'whatsapp image 2026-09-09 at 08.58.17 (2)': PRODUCT_ASSETS.naturalSpice,

  'buddha-serenity': PRODUCT_ASSETS.buddhaSerenity,
  'buddha_serenity': PRODUCT_ASSETS.buddhaSerenity,
  'meditating-buddha': PRODUCT_ASSETS.buddhaSerenity,
  'meditating_buddha': PRODUCT_ASSETS.buddhaSerenity,
  'meditating_buddha_candle': PRODUCT_ASSETS.buddhaSerenity,
  'whatsapp image 2026-09-09 at 08.58.16 (1)': PRODUCT_ASSETS.buddhaSerenity,

  'lotus-glow': PRODUCT_ASSETS.lotusGlow,
  'lotus_glow': PRODUCT_ASSETS.lotusGlow,
  'twin-lotus': PRODUCT_ASSETS.lotusGlow,
  'twin_lotus': PRODUCT_ASSETS.lotusGlow,
  'twin_lotus_candles': PRODUCT_ASSETS.lotusGlow,
  'whatsapp image 2026-09-09 at 08.58.14': PRODUCT_ASSETS.lotusGlow,

  'minimal-ribbed': PRODUCT_ASSETS.minimalRibbed,
  'minimal_ribbed': PRODUCT_ASSETS.minimalRibbed,

  'evil-eye-gift-box': PRODUCT_ASSETS.evilEyeBox,
  'evil_eye_gift_box': PRODUCT_ASSETS.evilEyeBox,
  'evil-eye-box': PRODUCT_ASSETS.evilEyeBox,
  'evil_eye_box': PRODUCT_ASSETS.evilEyeBox,
  'whatsapp image 2026-09-09 at 08.58.16 (2)': PRODUCT_ASSETS.evilEyeBox,

  'wooden-dough-bowl': PRODUCT_ASSETS.woodenDoughBowl,
  'wooden_dough_bowl': PRODUCT_ASSETS.woodenDoughBowl,
  'dough-bowl': PRODUCT_ASSETS.woodenDoughBowl,
  'dough_bowl': PRODUCT_ASSETS.woodenDoughBowl,
  'whatsapp image 2026-09-09 at 08.58.17 (1)': PRODUCT_ASSETS.woodenDoughBowl,

  'gilded-lotus-hamper': PRODUCT_ASSETS.gildedLotusHamper,
  'gilded_lotus_hamper': PRODUCT_ASSETS.gildedLotusHamper,
  'whatsapp image 2026-09-09 at 08.58.16': PRODUCT_ASSETS.gildedLotusHamper,

  'fluted-marbled-tray-duo': PRODUCT_ASSETS.flutedMarbledTrayDuo,
  'fluted_marbled_tray_duo': PRODUCT_ASSETS.flutedMarbledTrayDuo,
  'whatsapp image 2026-09-09 at 08.58.13 (1)': PRODUCT_ASSETS.flutedMarbledTrayDuo,

  'fluted-carousel-jar': PRODUCT_ASSETS.flutedCarouselJar,
  'fluted_carousel_jar': PRODUCT_ASSETS.flutedCarouselJar,
  'whatsapp image 2026-09-09 at 08.58.14 (2)': PRODUCT_ASSETS.flutedCarouselJar,

  'terrazzo-arch-vase': PRODUCT_ASSETS.terrazzoArchVase,
  'terrazzo_arch_vase': PRODUCT_ASSETS.terrazzoArchVase,
  'whatsapp image 2026-09-09 at 08.58.18': PRODUCT_ASSETS.terrazzoArchVase,

  'hollow-arch-bud-vase': PRODUCT_ASSETS.hollowArchBudVase,
  'hollow_arch_bud_vase': PRODUCT_ASSETS.hollowArchBudVase,
  'whatsapp image 2026-09-09 at 08.58.14 (1)': PRODUCT_ASSETS.hollowArchBudVase,

  'wavy-ripple-tray': PRODUCT_ASSETS.wavyRippleTray,
  'wavy_ripple_tray': PRODUCT_ASSETS.wavyRippleTray,
  'whatsapp image 2026-09-09 at 08.58.18 (1)': PRODUCT_ASSETS.wavyRippleTray,

  'concrete-arch-clock': PRODUCT_ASSETS.concreteArchClock,
  'concrete_arch_clock': PRODUCT_ASSETS.concreteArchClock,
  'concrete-arch-clocks': PRODUCT_ASSETS.concreteArchClock,
  'whatsapp image 2026-09-09 at 08.58.15 (1)': PRODUCT_ASSETS.concreteArchClock,

  'teddy-baby-shower': PRODUCT_ASSETS.teddyBabyShower,
  'teddy_baby_shower': PRODUCT_ASSETS.teddyBabyShower,
  'baby-shower-teddies': PRODUCT_ASSETS.teddyBabyShower,
  'teddy_baby_candles': PRODUCT_ASSETS.teddyBabyShower,
  'whatsapp image 2026-09-09 at 08.58.15 (2)': PRODUCT_ASSETS.teddyBabyShower,

  'baby-elephant': PRODUCT_ASSETS.babyElephant,
  'baby_elephant': PRODUCT_ASSETS.babyElephant,
  'baby-elephant-candle': PRODUCT_ASSETS.babyElephant,
  'baby_elephant_candle': PRODUCT_ASSETS.babyElephant,
  'whatsapp image 2026-09-09 at 08.58.17': PRODUCT_ASSETS.babyElephant,

  'abstract-thinkers': PRODUCT_ASSETS.abstractThinkers,
  'abstract_thinkers': PRODUCT_ASSETS.abstractThinkers,
  'abstract-thinker': PRODUCT_ASSETS.abstractThinkers,
  'abstract-thinker-statues': PRODUCT_ASSETS.abstractThinkers,
  'whatsapp image 2026-09-09 at 08.58.15': PRODUCT_ASSETS.abstractThinkers,

  'teddy-lotus-blossom': PRODUCT_ASSETS.teddyLotusBlossom,
  'teddy_lotus_blossom': PRODUCT_ASSETS.teddyLotusBlossom,
  'teddy-lotus': PRODUCT_ASSETS.teddyLotusBlossom,
  'teddy_lotus': PRODUCT_ASSETS.teddyLotusBlossom,
  'whatsapp image 2026-09-09 at 08.58.11': PRODUCT_ASSETS.teddyLotusBlossom,

  'oceanic-seashell': PRODUCT_ASSETS.oceanicSeashell,
  'oceanic_seashell': PRODUCT_ASSETS.oceanicSeashell,
  'conch-seashell': PRODUCT_ASSETS.oceanicSeashell,
  'conch_seashell_candle': PRODUCT_ASSETS.oceanicSeashell,
  'oceanic-seashell-candles': PRODUCT_ASSETS.oceanicSeashell,
  'whatsapp image 2026-09-09 at 08.58.13': PRODUCT_ASSETS.oceanicSeashell,
};

/**
 * Resolves any raw image URL, database image_url, slug, or product title
 * into a verified, high-resolution bundled asset URL that works everywhere.
 */
export function resolveImage(rawUrl?: string, slug?: string, name?: string): string {
  // 1. In-memory user-uploaded or live blob images (canvas exports, uploads)
  if (rawUrl && typeof rawUrl === 'string') {
    if (rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) {
      return rawUrl;
    }

    // Direct check for wooden dough bowl references
    if (rawUrl.toLowerCase().includes('dough') || rawUrl.toLowerCase().includes('wooden-dough-bowl') || rawUrl.toLowerCase().includes('wooden_dough_bowl')) {
      return PRODUCT_ASSETS.woodenDoughBowl;
    }

    let decoded = rawUrl;
    try {
      decoded = decodeURIComponent(rawUrl);
    } catch {
      decoded = rawUrl;
    }

    const clean = decoded.toLowerCase().replace(/\\/g, '/');
    const filename = clean.split('/').pop()?.split('?')[0]?.replace(/\.(jpg|jpeg|png|webp|avif)$/, '') || '';

    // Direct match against known local assets
    if (filename && ASSET_LOOKUP[filename]) {
      return ASSET_LOOKUP[filename];
    }

    for (const [key, asset] of Object.entries(ASSET_LOOKUP)) {
      if (clean.includes(key)) {
        return asset;
      }
    }

    // Public static /products/ or /images/ path
    if (clean.startsWith('/products/') || clean.startsWith('/images/')) {
      return clean;
    }

    // Legacy or database path starting with /src/assets/products/
    if (clean.startsWith('/src/assets/products/')) {
      const publicPath = clean.replace('/src/assets/products/', '/products/');
      return publicPath;
    }

    // External user-provided HTTP/HTTPS image URL
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl;
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

  // 3. Check by product name keywords only if no explicit user image was given
  if (name && (!rawUrl || rawUrl.trim().length === 0)) {
    const n = name.toLowerCase();
    if (n.includes('dough bowl') || n.includes('wooden dough') || n.includes('dough')) return PRODUCT_ASSETS.woodenDoughBowl;
    if (n.includes('floral') || n.includes('rose')) return PRODUCT_ASSETS.floralGarden;
    if (n.includes('spice') || n.includes('coconut')) return PRODUCT_ASSETS.naturalSpice;
    if (n.includes('buddha') || n.includes('serenity')) return PRODUCT_ASSETS.buddhaSerenity;
    if (n.includes('teddy') && n.includes('lotus')) return PRODUCT_ASSETS.teddyLotusBlossom;
    if (n.includes('lotus')) return PRODUCT_ASSETS.lotusGlow;
    if (n.includes('ribbed') || n.includes('minimal')) return PRODUCT_ASSETS.minimalRibbed;
    if (n.includes('evil eye')) return PRODUCT_ASSETS.evilEyeBox;
    if (n.includes('hamper')) return PRODUCT_ASSETS.gildedLotusHamper;
    if (n.includes('marbled')) return PRODUCT_ASSETS.flutedMarbledTrayDuo;
    if (n.includes('carousel')) return PRODUCT_ASSETS.flutedCarouselJar;
    if (n.includes('terrazzo')) return PRODUCT_ASSETS.terrazzoArchVase;
    if (n.includes('hollow arch')) return PRODUCT_ASSETS.hollowArchBudVase;
    if (n.includes('ripple') || n.includes('wavy')) return PRODUCT_ASSETS.wavyRippleTray;
    if (n.includes('clock')) return PRODUCT_ASSETS.concreteArchClock;
    if (n.includes('teddy')) return PRODUCT_ASSETS.teddyBabyShower;
    if (n.includes('elephant')) return PRODUCT_ASSETS.babyElephant;
    if (n.includes('thinker')) return PRODUCT_ASSETS.abstractThinkers;
    if (n.includes('seashell') || n.includes('conch') || n.includes('oceanic')) return PRODUCT_ASSETS.oceanicSeashell;
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

  let rawId = raw.id !== undefined && raw.id !== null ? String(raw.id).trim() : (raw.slug ? String(raw.slug).trim() : '');
  // Clean any repeated 'bg-' prefixes (e.g. bg-bg-baby-elephant -> bg-baby-elephant)
  while (rawId.startsWith('bg-bg-')) {
    rawId = 'bg-' + rawId.slice(6);
  }
  let slug = rawId || 'bg-product';

  const cleanSlug = slug.toLowerCase().replace(/^bg-/, '');
  const cleanRawId = rawId.toLowerCase().replace(/^bg-/, '');

  // Distinguish custom user-created products from default catalogue products
  const isCustomUserProduct = rawId.startsWith('bg-custom-');

  const matchingMock = !isCustomUserProduct
    ? MOCK_PRODUCTS.find(
        (m) =>
          m.id.toLowerCase() === slug.toLowerCase() ||
          m.id.toLowerCase() === rawId.toLowerCase() ||
          m.id.toLowerCase().replace(/^bg-/, '') === cleanSlug ||
          m.id.toLowerCase().replace(/^bg-/, '') === cleanRawId ||
          (!raw.id && m.name.toLowerCase().trim() === (raw.name || '').toLowerCase().trim())
      )
    : undefined;

  if (matchingMock && !raw.id) {
    slug = matchingMock.id;
  }

  // Resolve main image: Prioritize explicitly supplied user image, then fallback to mock/slug lookup
  let resolvedMainImage = '';
  if (raw.image && typeof raw.image === 'string' && raw.image.trim().length > 0) {
    resolvedMainImage = resolveImage(raw.image, slug, raw.name);
  } else if (raw.imageUrl && typeof raw.imageUrl === 'string' && raw.imageUrl.trim().length > 0) {
    resolvedMainImage = resolveImage(raw.imageUrl, slug, raw.name);
  } else if (matchingMock) {
    resolvedMainImage = matchingMock.image;
  } else {
    resolvedMainImage = resolveImage('', slug, raw.name);
  }

  // Resolve gallery images from Product -> Product Images -> Gallery
  let resolvedGallery: string[] = [];
  const rawImagesList: string[] = Array.isArray(raw.galleryImages) && raw.galleryImages.length > 0
    ? raw.galleryImages
    : Array.isArray(raw.product_images) && raw.product_images.length > 0
    ? raw.product_images.map((pi: any) => pi.image_url || pi.imageUrl)
    : Array.isArray(raw.productImages) && raw.productImages.length > 0
    ? raw.productImages.map((pi: any) => pi.image_url || pi.imageUrl)
    : [];

  if (rawImagesList.length > 0) {
    resolvedGallery = rawImagesList.map((img: string) => resolveImage(img, slug, raw.name));
  } else if (matchingMock && matchingMock.galleryImages && matchingMock.galleryImages.length > 0) {
    resolvedGallery = matchingMock.galleryImages;
  } else {
    resolvedGallery = [resolvedMainImage];
  }

  if (resolvedMainImage && !resolvedGallery.includes(resolvedMainImage)) {
    resolvedGallery.unshift(resolvedMainImage);
  }

  const finalPrice = raw.price !== undefined && raw.price !== null && !isNaN(Number(raw.price))
    ? Number(raw.price)
    : (matchingMock?.price ?? 499);

  const finalOriginalPrice = raw.originalPrice !== undefined && raw.originalPrice !== null && !isNaN(Number(raw.originalPrice))
    ? Number(raw.originalPrice)
    : matchingMock?.originalPrice;

  const finalStockQty = raw.stockQuantity !== undefined && raw.stockQuantity !== null && !isNaN(Number(raw.stockQuantity))
    ? Math.max(0, Number(raw.stockQuantity))
    : (matchingMock?.stockQuantity ?? 35);

  const finalInStock = raw.inStock !== undefined
    ? Boolean(raw.inStock)
    : (raw.stockQuantity !== undefined ? Number(raw.stockQuantity) > 0 : true);

  return {
    id: slug,
    name: (raw.name && String(raw.name).trim().length > 0) ? String(raw.name) : (matchingMock?.name || 'Artisan Candle Creation'),
    tagline: (raw.tagline !== undefined && raw.tagline !== null) ? String(raw.tagline) : (matchingMock?.tagline || 'Handcrafted pure soy artisan candle'),
    category: (raw.category || raw.categoryName || matchingMock?.category || 'Gift Candles') as ProductCategory,
    fragranceFamily: (raw.fragranceFamily && raw.fragranceFamily !== 'All'
      ? raw.fragranceFamily
      : matchingMock?.fragranceFamily || 'Floral') as Product['fragranceFamily'],
    price: finalPrice,
    originalPrice: finalOriginalPrice,
    rating: typeof raw.rating === 'number' ? raw.rating : parseFloat(raw.rating) || (matchingMock?.rating ?? 5.0),
    reviewsCount:
      typeof raw.reviewsCount === 'number'
        ? raw.reviewsCount
        : parseInt(raw.reviewsCount, 10) || (matchingMock?.reviewsCount ?? 24),
    image: resolvedMainImage,
    galleryImages: resolvedGallery,
    burnTimeHours: raw.burnTimeHours !== undefined && !isNaN(Number(raw.burnTimeHours)) ? Number(raw.burnTimeHours) : (matchingMock?.burnTimeHours || 45),
    weightGrams: raw.weightGrams !== undefined && !isNaN(Number(raw.weightGrams)) ? Number(raw.weightGrams) : (matchingMock?.weightGrams || 250),
    scentIntensity: raw.scentIntensity || matchingMock?.scentIntensity || 4,
    scentPyramid: raw.scentPyramid || matchingMock?.scentPyramid || {
      topNotes: ['Morning Rosebud Dew', 'Bulgarian Rose Water', 'Sweet Lychee'],
      heartNotes: ['Velvet Damask Rose Petals', 'White Peony', 'Wild Geranium'],
      baseNotes: ['White Cedarwood', 'Cashmere Musk', 'Subtle Amber Veil'],
    },
    description:
      (raw.description !== undefined && raw.description !== null && String(raw.description).trim().length > 0)
        ? String(raw.description)
        : (matchingMock?.description || 'An elegant artisanal candle beautifully presented in a gift-ready vessel. Poured with 100% natural, biodegradable soy wax for a clean, non-toxic burn.'),
    artisanStory:
      (raw.artisanStory !== undefined && raw.artisanStory !== null && String(raw.artisanStory).trim().length > 0)
        ? String(raw.artisanStory)
        : (matchingMock?.artisanStory || 'Handcrafted and molded by our women candle artisans with mindful care and clean botanical essences.'),
    availableVessels:
      raw.availableVessels ||
      matchingMock?.availableVessels || ['Fluted Ivory', 'Matte Blush Cream', 'Frosted Amber'],
    availableWicks:
      raw.availableWicks ||
      matchingMock?.availableWicks || ['Organic Cotton Wick', 'Crackling Wood Wick'],
    inStock: finalInStock,
    stockQuantity: finalStockQty,
    isBestSeller: Boolean(raw.isBestSeller),
    isNewArrival: Boolean(raw.isNewArrival),
    seasonRelease: raw.seasonRelease || matchingMock?.seasonRelease || 'Atelier Collection',
    waxType: raw.waxType || matchingMock?.waxType || '100% Organic Soy Wax',
    dimensions: raw.dimensions || matchingMock?.dimensions || '8.5cm x 9.5cm',
  };
}

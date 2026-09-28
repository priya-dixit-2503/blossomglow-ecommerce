-- BlossomGlow Candle Creations - Initial Seed Data for MySQL

-- Insert Default Admin User
INSERT INTO users (id, username, email, password_hash, full_name, phone, role)
VALUES
(1, 'admin', 'admin@blossomglow.in', '$2a$10$7Q9E1K4B0j8R3/4QoZ1jIe6uX6qjG3r4jT0uO9iB5vE1r6qjG3r4j', 'BlossomGlow Admin', '+91 98290 12345', 'ROLE_ADMIN')
ON DUPLICATE KEY UPDATE username=username;

-- Insert Categories
INSERT INTO categories (id, name, slug, description, image_url, display_order)
VALUES
(1, 'Gift Candles', 'gift-candles', 'Elegantly packaged artisanal candles ready for gifting and celebrations', '/products/floral-garden.jpg', 1),
(2, 'Scented Candles', 'scented-candles', 'Aromatherapy candles infused with pure therapeutic essential oils', '/products/natural-spice.jpg', 2),
(3, 'Meditation Candles', 'meditation-candles', 'Sacred and calming silhouettes crafted for zen sanctuaries and mindfulness', '/products/buddha-serenity.jpg', 3),
(4, 'Decorative Candles', 'decorative-candles', 'Sculptural botanical candles that elevate your table and mantelpiece', '/products/lotus-glow.jpg', 4),
(5, 'Home Décor Candles', 'home-decor-candles', 'Architectural silhouettes and textured vessels for contemporary living spaces', '/products/minimal-ribbed.jpg', 5),
(6, 'Gift Hampers', 'gift-hampers', 'Curated luxury gift chest hampers with custom handwritten cards', '/products/evil-eye-gift-box.jpg', 6)
ON DUPLICATE KEY UPDATE name=name, image_url=VALUES(image_url);

-- Insert Flagship 5 Products + Curated Catalog
INSERT INTO products (
    id, slug, name, tagline, category_id, category_name, fragrance_family,
    price, original_price, rating, reviews_count, image_url,
    burn_time_hours, weight_grams, scent_intensity, description, artisan_story,
    wax_type, dimensions, in_stock, stock_quantity, is_best_seller, is_new_arrival, season_release
) VALUES
(
    1, 'bg-floral-garden', 'Floral Garden Gift Candle',
    'An elegant floral-inspired decorative candle beautifully presented in a gift-ready box',
    1, 'Gift Candles', 'Floral',
    599.00, 799.00, 5.0, 184, '/products/floral-garden.jpg',
    45, 240, 4,
    'An elegant floral-inspired decorative candle beautifully presented in a gift-ready box. Crowned with intricately hand-sculpted 3D blooming roses and miniature botanical wax hearts, poured in clear apothecary glass capped with a natural grained bamboo lid.',
    'Every single rose petal is molded and hand-placed by our women candle artisans. Poured with 100% natural, biodegradable soy wax and organic cotton wicks for a clean, non-toxic burn.',
    '100% Organic Soy Wax', '8.5cm x 9.5cm', TRUE, 42, TRUE, FALSE, 'Botanical Bloom Edition'
),
(
    2, 'bg-natural-spice', 'Natural Spice Candle Collection',
    'Beautiful candles inspired by warm spices, botanicals and cozy moments',
    2, 'Scented Candles', 'Gourmand & Warm',
    499.00, 649.00, 4.9, 156, '/products/natural-spice.jpg',
    50, 280, 4,
    'Beautiful candles inspired by warm spices, botanicals and cozy moments. Eco-conscious craftsmanship poured into genuine reclaimed coconut halves sanded silky smooth, adorned with whole organic spices and dried rose petals that release a divine, grounding aroma.',
    'Rescued coconut shells from coastal farming communities, upcycled into sustainable aromatic treasures that burn with a warm, steady golden glow.',
    '100% Botanical Soy & Coconut Wax', '11cm x 7cm (Natural Shell)', TRUE, 38, TRUE, FALSE, 'Tropical Spice Sanctuary'
),
(
    3, 'bg-buddha-serenity', 'Buddha Serenity Candle',
    'A peaceful Buddha-shaped candle designed to create a calm and relaxing atmosphere',
    3, 'Meditation Candles', 'Woody & Amber',
    449.00, 599.00, 5.0, 198, '/products/buddha-serenity.jpg',
    35, 270, 4,
    'A peaceful Buddha-shaped candle designed to create a calm and relaxing atmosphere. Sculpted in the meditative Dhyana mudra, it brings tranquility and zen mindfulness to your sacred corner, yoga altar, or reading space.',
    'Each Buddha candle is gently demolded by hand and cold-inspected to guarantee crisp facial serenity, peaceful closed eyelids, and pristine robe drapery folds.',
    'Natural Pure Soy & Beeswax Blend', '7.5cm x 12cm', TRUE, 29, TRUE, FALSE, 'Nirvana Sanctuary'
),
(
    4, 'bg-lotus-glow', 'Lotus Glow Candle',
    'A beautiful lotus-inspired candle that creates a warm and peaceful glow',
    4, 'Decorative Candles', 'Floral',
    349.00, 449.00, 4.9, 142, '/products/lotus-glow.jpg',
    40, 310, 4,
    'A beautiful lotus-inspired candle that creates a warm and peaceful glow. Features delicate sculpted lotus flower petals with crackling organic wooden wicks, evoking peaceful temple ponds and serene sacred dawns.',
    'Inspired by ancient Indian temple pond blooms, each petal flute is molded and hand-polished to evoke pure tranquility, mindfulness, and serenity during meditation or quiet evenings.',
    '100% Organic Soy Wax', '9cm x 6cm', TRUE, 50, FALSE, TRUE, 'Zenith Bloom'
),
(
    5, 'bg-minimal-ribbed', 'Minimal Ribbed Candle',
    'A minimalist ribbed candle designed to complement modern home interiors',
    5, 'Home Décor Candles', 'Fresh & Herbal',
    399.00, 499.00, 4.8, 112, '/products/minimal-ribbed.jpg',
    48, 300, 3,
    'A minimalist ribbed candle designed to complement modern home interiors. Molded with elegant textured ridges that catch the ambient light, casting rhythmic geometric shadows while diffusing a clean, uplifting coastal fragrance.',
    'Crafted using architectural silicone molds, poured with plant-based soy wax and phthalate-free clean aquatic essential oils.',
    '100% Clean Soy Wax', '8cm x 10cm', TRUE, 34, FALSE, TRUE, 'Modernist Sanctuary'
),
(
    6, 'bg-evil-eye-box', 'The Sacred Evil Eye Protection Gift Box',
    'Royal blue candle with beaded evil eye brooch & glass nazar talisman in turquoise-gold box',
    6, 'Gift Hampers', 'Woody & Amber',
    1299.00, 1599.00, 5.0, 234, '/products/evil-eye-gift-box.jpg',
    65, 320, 5,
    'Presented in an ornate turquoise and gold foil floral gift box finished with a luxurious satin gold ribbon. This signature gift set holds a dual-layered royal blue and ivory soy candle adorned with an artisan hand-beaded evil eye medallion and an authentic hanging cobalt glass evil eye talisman.',
    'Handcrafted by our master artisans to ward off negative energy and usher serenity, peace, and abundance into the home.',
    '100% Organic Soy Wax', 'Box: 16cm x 16cm x 10cm', TRUE, 25, TRUE, FALSE, 'Signature Talisman'
),
(
    7, 'bg-wooden-dough-bowl', 'Himalayan Rustic Wood Dough Bowl Candle',
    'Multi-wick soy wax in hand-carved solid wood boat with dried rose petals & botanical pinecones',
    2, 'Scented Candles', 'Woody & Amber',
    1799.00, 2299.00, 5.0, 142, '/products/wooden-dough-bowl.jpg',
    85, 650, 5,
    'Artfully carved from reclaimed natural wood into an oblong rustic trough boat silhouette. Filled with slow-cured soy wax and multiple cotton wicks, lavishly decorated with real dried rosebuds, star anise, and miniature pinecones.',
    'Each wooden vessel is carved by traditional wood artisans, making every piece entirely one-of-a-kind.',
    '100% Organic Soy Wax', '28cm x 14cm x 6cm', TRUE, 15, TRUE, FALSE, 'Heritage Hearth'
)
ON DUPLICATE KEY UPDATE name=name, image_url=VALUES(image_url);

-- Seed Initial Verified Reviews
INSERT INTO reviews (id, product_id, author_name, location, rating, title, comment, verified)
VALUES
(1, 1, 'Ananya Sharma', 'Mumbai, MH', 5, 'Breathtaking 3D Roses & Scent', 'The hand-sculpted roses are even more gorgeous in person. The fragrance filled my entire living room within 15 minutes of lighting. Truly artisanal!', TRUE),
(2, 1, 'Rohan Mehta', 'Bengaluru, KA', 5, 'Perfect Diwali & Housewarming Gift', 'Purchased this for a friend’s housewarming. The packaging was immaculate, and the bamboo lid keeps the scent intact when unlit.', TRUE),
(3, 2, 'Kavita Nair', 'Pune, MH', 5, 'Authentic Coconut Bowl Aesthetic', 'Love that this is made in real reclaimed coconut. The crackling wooden wick sounds like a tiny cozy fireplace. Zero soot!', TRUE),
(4, 3, 'Dr. Aris Thorne', 'Delhi, DL', 5, 'Incredible Zen Aura in My Studio', 'The details on the Buddha face and drapery are extraordinary. It creates an instantly meditative atmosphere in my clinic.', TRUE),
(5, 6, 'Sneha Patel', 'Ahmedabad, GJ', 5, 'The Evil Eye Charm is Real Glass!', 'The packaging is royal luxury! The glass nazar talisman looks stunning hanging by my entryway. Will definitely order again.', TRUE)
ON DUPLICATE KEY UPDATE title=title;


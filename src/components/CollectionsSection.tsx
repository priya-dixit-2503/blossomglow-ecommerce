import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCT_ASSETS } from '../assets/products';

interface CollectionsSectionProps {
  onSelectCollection: (categoryName: string) => void;
}

interface CollectionItem {
  id: string;
  name: string;
  categoryFilter: string;
  description: string;
  image: string;
  tag: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: 'pillars',
    name: 'Scented Pillar Candles',
    categoryFilter: 'Pillar Candles',
    description: 'Coastal Calm & Amber Sandalwood with clean, smokeless radiance and up to 25 hours burn time.',
    image: PRODUCT_ASSETS.naturalSpice,
    tag: '100% Smokeless',
  },
  {
    id: 'amber-jars',
    name: 'Amber Jar Soya Candles',
    categoryFilter: 'Jar & Container Candles',
    description: 'Therapeutic aromatherapy infused with pure essential oils poured into apothecary amber jars.',
    image: PRODUCT_ASSETS.floralGarden,
    tag: 'Pure Soy Wax',
  },
  {
    id: 'floating-urli',
    name: 'Floating Flowers & Urli Sets',
    categoryFilter: 'Floating & Urli Sets',
    description: 'Sculpted floating lotus and rose petals paired with hammered golden urlis for festive pooja spaces.',
    image: PRODUCT_ASSETS.lotusGlow,
    tag: 'Festive Illumination',
  },
  {
    id: 'sculptural',
    name: 'Sculptural & Buddha Candles',
    categoryFilter: 'Sculptural Candles',
    description: 'Meditating Buddha in Dhyana mudra, conch shells, and tactile ribbed geometric sculptures.',
    image: PRODUCT_ASSETS.buddhaSerenity,
    tag: 'Zen Mindfulness',
  },
  {
    id: 'wooden-bowls',
    name: 'Carved Wooden Dough Bowls',
    categoryFilter: 'Botanical Bowls & Shells',
    description: 'Solid wooden boat troughs with crackling wooden wicks, whole cinnamon quills, and star anise.',
    image: PRODUCT_ASSETS.woodenDoughBowl,
    tag: 'Multi-Wick Grand',
  },
  {
    id: 'luxury-hampers',
    name: 'Luxury Gift Hampers',
    categoryFilter: 'Luxury Gift Hampers',
    description: 'Opulent gilded lotus boxes, sacred Evil Eye protection chests, and corporate celebration sets.',
    image: PRODUCT_ASSETS.gildedLotusHamper,
    tag: 'Gold Foil Rigid Boxes',
  },
];

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({ onSelectCollection }) => {
  return (
    <section id="collections" className="py-20 bg-[#F5F1EC] border-t border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-amber-900 block flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Signature Aura Categories
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 leading-tight">
            Our Collections
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Explore handcrafted candles and home accents designed to bring joy, serenity, and illumination into every room.
          </p>
        </div>

        {/* 6 Large Image Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => onSelectCollection(col.categoryFilter)}
              className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col border border-stone-200/80 transform hover:-translate-y-1"
            >
              {/* Image Container with Hover Zoom */}
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={col.image}
                  alt={col.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out filter brightness-[0.95]"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-stone-950/80 text-amber-200 text-[10px] font-mono tracking-widest uppercase rounded-full backdrop-blur-md border border-stone-700">
                    {col.tag}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-editorial text-2xl font-light text-stone-900 group-hover:text-amber-900 transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-stone-500 font-light leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-stone-800 group-hover:text-amber-900">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

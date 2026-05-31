/**
 * Canonical seed catalog — the single source of truth for both:
 *   1. the `npm run seed` script that loads Supabase, and
 *   2. the offline fallback used by lib/products.js before Supabase is wired up.
 *
 * Products are mock data modelled on real-world devices (Apple, Samsung, Vivo,
 * Realme, Xiaomi/Redmi). Prices are illustrative USD. Images are stock tech
 * photos from Unsplash, not official product shots.
 *
 * Shapes here match exactly what the UI components expect (camelCase,
 * colors:[{name,hex}], images:[url], etc).
 */

export const CATEGORIES = [
  {
    slug: 'smartphones',
    name: 'Smartphones',
    tagline: 'Flagship power in your pocket',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'laptops',
    name: 'Laptops',
    tagline: 'Studio-grade performance',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'tablets',
    name: 'Tablets',
    tagline: 'Create anywhere',
    image:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'audio',
    name: 'Audio',
    tagline: 'Immersive, lossless sound',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'smartwatches',
    name: 'Smartwatches',
    tagline: 'Health on your wrist',
    image:
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',
  },
]

// Reusable Unsplash image pools per category (rotated for gallery variety).
const PHONE_IMGS = [
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1200&q=80',
]
const LAPTOP_IMGS = [
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80',
]
const TABLET_IMGS = [
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=1200&q=80',
]
const HEADPHONE_IMGS = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
]
const EARBUD_IMGS = [
  'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1200&q=80',
]
const WATCH_IMGS = [
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
]

/* Rotate an image pool so each product leads with a different shot. */
function gallery(pool, offset = 0) {
  return pool.map((_, i) => pool[(i + offset) % pool.length])
}

export const PRODUCTS = [
  /* ----------------------------- Smartphones ----------------------------- */
  {
    slug: 'apple-iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'smartphones',
    tagline: 'Titanium. A17 Pro. The most powerful iPhone.',
    price: 1199,
    originalPrice: null,
    rating: 4.9,
    reviews: 5421,
    isNew: true,
    colors: [
      { name: 'Natural Titanium', hex: '#c2bcb2' },
      { name: 'Blue Titanium', hex: '#4a5a6a' },
      { name: 'White Titanium', hex: '#f2f1ec' },
      { name: 'Black Titanium', hex: '#3b3b3d' },
    ],
    images: gallery(PHONE_IMGS, 0),
    description:
      'Forged in aerospace-grade titanium, the iPhone 15 Pro Max pairs the blazing A17 Pro chip with a 6.7" Super Retina XDR ProMotion display and a pro-level 5x telephoto camera. USB-C with USB 3 speeds, and the new Action button.',
    highlights: [
      '6.7" Super Retina XDR · 120Hz',
      'A17 Pro · 6-core GPU',
      '48MP main + 5x telephoto',
      'Titanium design, USB-C',
    ],
  },
  {
    slug: 'apple-iphone-15',
    name: 'iPhone 15',
    brand: 'Apple',
    category: 'smartphones',
    tagline: 'Dynamic Island. 48MP camera. USB-C.',
    price: 799,
    originalPrice: 899,
    rating: 4.8,
    reviews: 3987,
    isNew: false,
    colors: [
      { name: 'Pink', hex: '#f5d3d8' },
      { name: 'Blue', hex: '#d0e0ec' },
      { name: 'Green', hex: '#d4e2cf' },
      { name: 'Yellow', hex: '#efe6c8' },
      { name: 'Black', hex: '#4d4f53' },
    ],
    images: gallery(PHONE_IMGS, 1),
    description:
      'The iPhone 15 brings the Dynamic Island, a 48MP main camera with 2x telephoto, and the efficient A16 Bionic chip to the everyday flagship. Now with USB-C and a durable colour-infused glass back.',
    highlights: [
      '6.1" Super Retina XDR OLED',
      'A16 Bionic chip',
      '48MP main camera',
      'Dynamic Island · USB-C',
    ],
  },
  {
    slug: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    tagline: 'Galaxy AI. Built-in S Pen. 200MP camera.',
    price: 1299,
    originalPrice: 1419,
    rating: 4.8,
    reviews: 4210,
    isNew: true,
    colors: [
      { name: 'Titanium Gray', hex: '#6f6f6f' },
      { name: 'Titanium Black', hex: '#2b2b2b' },
      { name: 'Titanium Violet', hex: '#b8aec6' },
      { name: 'Titanium Yellow', hex: '#e9d9a0' },
    ],
    images: gallery(PHONE_IMGS, 2),
    description:
      'The Galaxy S24 Ultra is a powerhouse of Galaxy AI — Circle to Search, Live Translate and generative photo editing — wrapped in a titanium frame with a flat 6.8" QHD+ display, a built-in S Pen and a 200MP camera.',
    highlights: [
      '6.8" QHD+ Dynamic AMOLED 2X',
      'Snapdragon 8 Gen 3 for Galaxy',
      '200MP quad camera, 5x optical',
      'Built-in S Pen · titanium',
    ],
  },
  {
    slug: 'samsung-galaxy-z-flip5',
    name: 'Samsung Galaxy Z Flip5',
    brand: 'Samsung',
    category: 'smartphones',
    tagline: 'A flagship that folds into your palm.',
    price: 999,
    originalPrice: null,
    rating: 4.6,
    reviews: 1876,
    isNew: false,
    colors: [
      { name: 'Mint', hex: '#cfe3d2' },
      { name: 'Graphite', hex: '#2e2e2e' },
      { name: 'Cream', hex: '#efe9dd' },
      { name: 'Lavender', hex: '#d9cfe6' },
    ],
    images: gallery(PHONE_IMGS, 0),
    description:
      'The Galaxy Z Flip5 folds a 6.7" FHD+ AMOLED into a pocketable square, with a large 3.4" Flex Window cover screen for replies, widgets and selfies — all without opening the phone.',
    highlights: [
      '6.7" foldable FHD+ AMOLED',
      '3.4" Flex Window cover screen',
      'Snapdragon 8 Gen 2 for Galaxy',
      'Flex Mode, IPX8 water resistant',
    ],
  },
  {
    slug: 'vivo-x100-pro',
    name: 'Vivo X100 Pro',
    brand: 'Vivo',
    category: 'smartphones',
    tagline: 'ZEISS optics. 100x zoom. Pro photography.',
    price: 899,
    originalPrice: null,
    rating: 4.7,
    reviews: 1342,
    isNew: true,
    colors: [
      { name: 'Asteroid Black', hex: '#2b2b2b' },
      { name: 'Sunset Orange', hex: '#d98b4e' },
    ],
    images: gallery(PHONE_IMGS, 1),
    description:
      'The Vivo X100 Pro is a photography flagship co-engineered with ZEISS — a 50MP 1-inch-type sensor, a 100x ZEISS APO telephoto and the new MediaTek Dimensity 9300, all powered by a huge 5400mAh battery.',
    highlights: [
      '6.78" AMOLED · 120Hz LTPO',
      'MediaTek Dimensity 9300',
      '50MP ZEISS 1" main, 100x zoom',
      '5400mAh · 100W FlashCharge',
    ],
  },
  {
    slug: 'vivo-v30-pro',
    name: 'Vivo V30 Pro',
    brand: 'Vivo',
    category: 'smartphones',
    tagline: 'ZEISS studio portraits, slim and light.',
    price: 499,
    originalPrice: 549,
    rating: 4.5,
    reviews: 980,
    isNew: false,
    colors: [
      { name: 'Peacock Green', hex: '#2f6f5e' },
      { name: 'Classic Black', hex: '#26262a' },
      { name: 'Lava Red', hex: '#a83232' },
    ],
    images: gallery(PHONE_IMGS, 2),
    description:
      'The V30 Pro brings the ZEISS Multifocal Portrait system and a triple 50MP camera to a remarkably slim body, with an Aura Light for soft, flattering studio-style shots day or night.',
    highlights: [
      '6.78" AMOLED · 120Hz',
      'MediaTek Dimensity 8200',
      'Triple 50MP ZEISS camera',
      '5000mAh · 80W charging',
    ],
  },
  {
    slug: 'realme-gt-6',
    name: 'Realme GT 6',
    brand: 'Realme',
    category: 'smartphones',
    tagline: 'Flagship speed at a fearless price.',
    price: 599,
    originalPrice: 649,
    rating: 4.6,
    reviews: 2104,
    isNew: true,
    colors: [
      { name: 'Fluid Silver', hex: '#d6d9dd' },
      { name: 'Razor Green', hex: '#b6e2c0' },
    ],
    images: gallery(PHONE_IMGS, 0),
    description:
      'The Realme GT 6 punches well above its price with the Snapdragon 8s Gen 3, a dazzling 6000-nit display and a 5500mAh battery with 120W charging — built for gamers and power users.',
    highlights: [
      '6.78" AMOLED · 6000 nits peak',
      'Snapdragon 8s Gen 3',
      '50MP Sony LYT-808 main',
      '5500mAh · 120W SuperVOOC',
    ],
  },
  {
    slug: 'realme-12-pro-plus',
    name: 'Realme 12 Pro+',
    brand: 'Realme',
    category: 'smartphones',
    tagline: 'Periscope telephoto, watch-inspired design.',
    price: 399,
    originalPrice: null,
    rating: 4.4,
    reviews: 1530,
    isNew: false,
    colors: [
      { name: 'Submarine Blue', hex: '#3a5a7a' },
      { name: 'Navigator Beige', hex: '#e3d6bf' },
    ],
    images: gallery(PHONE_IMGS, 1),
    description:
      'A standout mid-ranger with a 64MP periscope telephoto for true 3x optical zoom, an elegant vegan-leather, watch-inspired design and a smooth 120Hz curved display.',
    highlights: [
      '6.7" curved AMOLED · 120Hz',
      'Snapdragon 7s Gen 2',
      '64MP periscope, 3x optical',
      '5000mAh · 67W charging',
    ],
  },
  {
    slug: 'redmi-note-13-pro-plus',
    name: 'Redmi Note 13 Pro+',
    brand: 'Redmi',
    category: 'smartphones',
    tagline: '200MP camera. Curved display. Big value.',
    price: 349,
    originalPrice: 399,
    rating: 4.5,
    reviews: 3265,
    isNew: false,
    colors: [
      { name: 'Midnight Black', hex: '#24242a' },
      { name: 'Aurora Purple', hex: '#7d6fb0' },
      { name: 'Moonlight White', hex: '#eef0f2' },
    ],
    images: gallery(PHONE_IMGS, 2),
    description:
      'The Redmi Note 13 Pro+ headlines with a 200MP OIS camera, a 1.5K curved AMOLED display and IP68 protection, plus blistering 120W HyperCharge — flagship features without the flagship price.',
    highlights: [
      '6.67" 1.5K curved AMOLED',
      'MediaTek Dimensity 7200-Ultra',
      '200MP OIS main camera',
      '5000mAh · 120W HyperCharge',
    ],
  },
  {
    slug: 'xiaomi-14',
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    category: 'smartphones',
    tagline: 'Leica optics in a compact flagship.',
    price: 799,
    originalPrice: null,
    rating: 4.7,
    reviews: 1789,
    isNew: true,
    colors: [
      { name: 'Black', hex: '#262629' },
      { name: 'White', hex: '#f0f0f2' },
      { name: 'Jade Green', hex: '#3f7d6a' },
    ],
    images: gallery(PHONE_IMGS, 0),
    description:
      'The Xiaomi 14 packs a Leica Summilux triple camera and the Snapdragon 8 Gen 3 into a compact, comfortable frame with an ultra-bright 3000-nit display and all-day 4610mAh battery.',
    highlights: [
      '6.36" LTPO AMOLED · 3000 nits',
      'Snapdragon 8 Gen 3',
      'Leica 50MP triple camera',
      '4610mAh · 90W HyperCharge',
    ],
  },

  /* ------------------------------- Laptops ------------------------------- */
  {
    slug: 'apple-macbook-air-13-m3',
    name: 'MacBook Air 13" (M3)',
    brand: 'Apple',
    category: 'laptops',
    tagline: 'Strikingly thin. Supercharged by M3.',
    price: 1099,
    originalPrice: null,
    rating: 4.9,
    reviews: 2980,
    isNew: true,
    colors: [
      { name: 'Midnight', hex: '#2e3641' },
      { name: 'Starlight', hex: '#eceadd' },
      { name: 'Space Gray', hex: '#7d7e80' },
      { name: 'Silver', hex: '#e3e4e6' },
    ],
    images: gallery(LAPTOP_IMGS, 0),
    description:
      'The M3 MacBook Air is fanless, silent and ridiculously fast, with up to 18 hours of battery, a brilliant 13.6" Liquid Retina display and support for up to two external monitors.',
    highlights: [
      '13.6" Liquid Retina · 500 nits',
      'Apple M3 · 8-core CPU',
      'Up to 18h battery, fanless',
      '1080p camera · MagSafe',
    ],
  },
  {
    slug: 'samsung-galaxy-book4-pro',
    name: 'Samsung Galaxy Book4 Pro',
    brand: 'Samsung',
    category: 'laptops',
    tagline: 'AMOLED brilliance, Intel Core Ultra.',
    price: 1399,
    originalPrice: 1549,
    rating: 4.6,
    reviews: 612,
    isNew: false,
    colors: [
      { name: 'Moonstone Gray', hex: '#6b6e73' },
      { name: 'Platinum Silver', hex: '#d7dadd' },
    ],
    images: gallery(LAPTOP_IMGS, 1),
    description:
      'Ultra-light and ultra-bright, the Galaxy Book4 Pro pairs a stunning 14" 3K Dynamic AMOLED 2X touchscreen with Intel Core Ultra power and seamless Galaxy ecosystem connectivity.',
    highlights: [
      '14" 3K Dynamic AMOLED 2X',
      'Intel Core Ultra 7',
      '1.23kg, all-metal chassis',
      'Galaxy ecosystem sync',
    ],
  },

  /* ------------------------------- Tablets ------------------------------- */
  {
    slug: 'apple-ipad-pro-13-m4',
    name: 'iPad Pro 13" (M4)',
    brand: 'Apple',
    category: 'tablets',
    tagline: 'Impossibly thin. Tandem OLED. M4.',
    price: 1299,
    originalPrice: null,
    rating: 4.8,
    reviews: 1455,
    isNew: true,
    colors: [
      { name: 'Space Black', hex: '#2b2b2d' },
      { name: 'Silver', hex: '#e3e4e6' },
    ],
    images: gallery(TABLET_IMGS, 0),
    description:
      'The thinnest Apple product ever, the M4 iPad Pro debuts the Ultra Retina XDR tandem-OLED display and tremendous performance, with support for Apple Pencil Pro and the Magic Keyboard.',
    highlights: [
      '13" Ultra Retina XDR tandem OLED',
      'Apple M4 chip',
      'Apple Pencil Pro support',
      'Thunderbolt / USB-4',
    ],
  },
  {
    slug: 'samsung-galaxy-tab-s9',
    name: 'Samsung Galaxy Tab S9',
    brand: 'Samsung',
    category: 'tablets',
    tagline: 'Dynamic AMOLED 2X with S Pen included.',
    price: 799,
    originalPrice: 849,
    rating: 4.7,
    reviews: 908,
    isNew: false,
    colors: [
      { name: 'Graphite', hex: '#33333a' },
      { name: 'Beige', hex: '#e4dccb' },
    ],
    images: gallery(TABLET_IMGS, 1),
    description:
      'The Galaxy Tab S9 brings an 11" Dynamic AMOLED 2X display, Snapdragon 8 Gen 2 performance and an IP68-rated body. The S Pen is in the box, with near-zero latency.',
    highlights: [
      '11" Dynamic AMOLED 2X · 120Hz',
      'Snapdragon 8 Gen 2 for Galaxy',
      'S Pen included · IP68',
      'Quad AKG speakers',
    ],
  },
  {
    slug: 'xiaomi-pad-6',
    name: 'Xiaomi Pad 6',
    brand: 'Xiaomi',
    category: 'tablets',
    tagline: 'Big, bright 144Hz screen. Tiny price.',
    price: 399,
    originalPrice: null,
    rating: 4.5,
    reviews: 1620,
    isNew: false,
    colors: [
      { name: 'Gravity Gray', hex: '#5a5d61' },
      { name: 'Mist Blue', hex: '#9bb4c4' },
      { name: 'Champagne', hex: '#e6d9c2' },
    ],
    images: gallery(TABLET_IMGS, 2),
    description:
      'A superb value tablet with an 11" 2.8K 144Hz display, Snapdragon 870 performance and a 33W-charging 8840mAh battery — great for streaming, study and light creation.',
    highlights: [
      '11" 2.8K display · 144Hz',
      'Snapdragon 870',
      '8840mAh · 33W charging',
      'Quad Dolby Atmos speakers',
    ],
  },

  /* -------------------------------- Audio -------------------------------- */
  {
    slug: 'apple-airpods-pro-2',
    name: 'AirPods Pro 2 (USB-C)',
    brand: 'Apple',
    category: 'audio',
    tagline: '2x noise cancellation. Adaptive Audio.',
    price: 249,
    originalPrice: null,
    rating: 4.8,
    reviews: 8740,
    isNew: true,
    colors: [{ name: 'White', hex: '#f5f5f7' }],
    images: gallery(EARBUD_IMGS, 0),
    description:
      'Powered by the H2 chip, AirPods Pro 2 deliver up to 2x more Active Noise Cancellation, Adaptive Audio that tunes noise control to your surroundings, and a USB-C charging case with precision Find My.',
    highlights: [
      'Apple H2 chip',
      'Adaptive Audio + Transparency',
      'Personalised Spatial Audio',
      'Up to 30h with case · USB-C',
    ],
  },
  {
    slug: 'samsung-galaxy-buds3-pro',
    name: 'Samsung Galaxy Buds3 Pro',
    brand: 'Samsung',
    category: 'audio',
    tagline: 'Blade design, Hi-Fi spatial sound.',
    price: 249,
    originalPrice: 279,
    rating: 4.5,
    reviews: 1240,
    isNew: true,
    colors: [
      { name: 'Silver', hex: '#d8dadd' },
      { name: 'White', hex: '#f4f4f6' },
    ],
    images: gallery(EARBUD_IMGS, 1),
    description:
      'The Galaxy Buds3 Pro feature a bold new blade design, dual amplifiers for Hi-Fi 24-bit sound, intelligent ANC and Galaxy AI-powered real-time interpretation.',
    highlights: [
      'Dual-driver Hi-Fi · 24-bit',
      'Intelligent ANC',
      '360 Audio with head tracking',
      'Up to 26h with case',
    ],
  },
  {
    slug: 'realme-buds-air-6-pro',
    name: 'Realme Buds Air 6 Pro',
    brand: 'Realme',
    category: 'audio',
    tagline: '50dB ANC and LDAC, seriously cheap.',
    price: 79,
    originalPrice: 99,
    rating: 4.3,
    reviews: 2870,
    isNew: false,
    colors: [
      { name: 'Marine Blue', hex: '#274b73' },
      { name: 'Lustrous Gold', hex: '#d8c39a' },
    ],
    images: gallery(EARBUD_IMGS, 2),
    description:
      'Punching far above their price, the Buds Air 6 Pro offer up to 50dB adaptive noise cancellation, a coaxial dual-driver setup, LDAC hi-res audio and up to 40 hours of total playback.',
    highlights: [
      'Up to 50dB adaptive ANC',
      'Coaxial dual drivers · LDAC',
      'Up to 40h total playback',
      'Low-latency game mode',
    ],
  },
  {
    slug: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'audio',
    tagline: 'The benchmark in noise cancellation.',
    price: 399,
    originalPrice: 429,
    rating: 4.9,
    reviews: 6310,
    isNew: false,
    colors: [
      { name: 'Black', hex: '#1f1f21' },
      { name: 'Silver', hex: '#d9d6cf' },
      { name: 'Midnight Blue', hex: '#2a3b56' },
    ],
    images: gallery(HEADPHONE_IMGS, 0),
    description:
      'Industry-leading noise cancellation, exceptional call quality and up to 30 hours of battery. Eight microphones and two processors adapt the WH-1000XM5 to your environment in real time.',
    highlights: [
      'Dual-processor adaptive ANC',
      'Up to 30h battery',
      'Hi-Res Audio · LDAC',
      'Multipoint Bluetooth',
    ],
  },

  /* ----------------------------- Smartwatches ---------------------------- */
  {
    slug: 'apple-watch-series-9',
    name: 'Apple Watch Series 9',
    brand: 'Apple',
    category: 'smartwatches',
    tagline: 'Brighter display. New double tap gesture.',
    price: 399,
    originalPrice: null,
    rating: 4.8,
    reviews: 4120,
    isNew: true,
    colors: [
      { name: 'Midnight', hex: '#2b2f36' },
      { name: 'Starlight', hex: '#eceadd' },
      { name: 'Silver', hex: '#e3e4e6' },
      { name: '(PRODUCT)RED', hex: '#b3262b' },
    ],
    images: gallery(WATCH_IMGS, 0),
    description:
      'Powered by the new S9 SiP, the Series 9 brings a 2000-nit display, the magical double tap gesture and on-device Siri, plus comprehensive health and fitness tracking.',
    highlights: [
      'Always-on Retina · 2000 nits',
      'S9 SiP · double tap gesture',
      'ECG, blood oxygen, temperature',
      'Up to 18h (36h low power)',
    ],
  },
  {
    slug: 'samsung-galaxy-watch6',
    name: 'Samsung Galaxy Watch6',
    brand: 'Samsung',
    category: 'smartwatches',
    tagline: 'Bigger screen, advanced sleep coaching.',
    price: 299,
    originalPrice: 329,
    rating: 4.6,
    reviews: 1980,
    isNew: false,
    colors: [
      { name: 'Graphite', hex: '#33333a' },
      { name: 'Gold', hex: '#d8c39a' },
      { name: 'Silver', hex: '#d9dbde' },
    ],
    images: gallery(WATCH_IMGS, 1),
    description:
      'The Galaxy Watch6 features a larger, brighter Super AMOLED display with slimmer bezels, advanced sleep coaching and BioActive health sensors, running Wear OS powered by Samsung.',
    highlights: [
      'Super AMOLED · slim bezels',
      'BioActive sensor suite',
      'Advanced sleep coaching',
      'Wear OS · 40h battery',
    ],
  },
]

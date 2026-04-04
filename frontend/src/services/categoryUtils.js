// categoryUtils.js

export const CATEGORY_CONFIG = {
  Electronics: {
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    emoji: '💻',
    keywords: [
      'phone', 'smartphone', 'iphone', 'android', 'mobile',
      'laptop', 'macbook', 'notebook', 'chromebook',
      'tablet', 'ipad',
      'computer', 'desktop', 'pc',
      'monitor', 'display', 'screen',
      'tv', 'television', 'led', 'oled', 'qled',
      'camera', 'dslr', 'mirrorless', 'gopro',
      'gaming', 'console', 'playstation', 'xbox', 'nintendo', 'gamepad',
      'speaker', 'soundbar', 'home theater',
      'headphone', 'earphone', 'airpod', 'earbuds', 'headset',
      'smartwatch', 'smart watch', 'apple watch', 'galaxy watch',
      'drone',
      'projector',
      'printer', 'scanner',
      'router', 'modem', 'wifi',
      'keyboard', 'mouse', 'trackpad',
      'graphics card', 'gpu', 'cpu', 'processor', 'ssd', 'ram', 'hard drive', 'hdd',
      'ups', 'power bank', 'charger', 'adapter',
      'webcam', 'microphone',
      'smart home', 'alexa', 'echo', 'google home',
    ],
  },
  'Home Appliances': {
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    emoji: '🏠',
    keywords: [
      'refrigerator', 'fridge', 'freezer',
      'washing machine', 'washer', 'dryer', 'laundry',
      'dishwasher',
      'air conditioner', ' ac ', 'air cooler', 'fan',
      'heater', 'geyser', 'water heater', 'room heater',
      'vacuum cleaner', 'vacuum', 'robovac',
      'iron', 'steam iron',
      'water purifier', 'ro system', 'air purifier',
      'sewing machine',
    ],
  },
  'Kitchen Appliances': {
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    emoji: '🍳',
    keywords: [
      'microwave', 'oven', 'otg',
      'blender', 'mixer', 'grinder', 'juicer',
      'toaster', 'sandwich maker',
      'coffee maker', 'coffee machine', 'espresso',
      'kettle', 'electric kettle',
      'induction', 'cooktop', 'stove', 'cooker', 'pressure cooker', 'rice cooker',
      'chimney', 'exhaust',
      'food processor',
      'air fryer',
      'refrigerator', 'mini fridge',
    ],
  },
  Furniture: {
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    emoji: '🪑',
    keywords: [
      'sofa', 'couch', 'loveseat',
      'chair', 'recliner', 'ottoman', 'stool', 'bench',
      'table', 'dining table', 'coffee table', 'side table',
      'bed', 'cot', 'bunk bed',
      'wardrobe', 'almirah', 'cupboard', 'cabinet', 'drawer',
      'desk', 'study table', 'workstation',
      'shelf', 'bookcase', 'bookshelf',
      'mattress', 'pillow',
    ],
  },
  Automotive: {
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
    emoji: '🚗',
    keywords: [
      'car', 'vehicle', 'automobile',
      'bike', 'motorcycle', 'scooter', 'moped',
      'tire', 'tyre', 'wheel', 'rim',
      'car battery', 'vehicle battery',
      'gps', 'dash cam', 'dashcam', 'car camera',
      'helmet', 'riding gear',
      'engine', 'motor oil', 'brake',
    ],
  },
  'Tools & Hardware': {
    color: '#6b7280',
    gradient: 'linear-gradient(135deg, #6b7280 0%, #374151 100%)',
    emoji: '🔧',
    keywords: [
      'drill', 'saw', 'jigsaw', 'circular saw',
      'hammer', 'screwdriver', 'wrench', 'spanner', 'plier',
      'power tool',
      'grinder', 'angle grinder',
      'compressor', 'air compressor',
      'generator',
      'welding',
      'ladder',
    ],
  },
  'Sports & Fitness': {
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    emoji: '⚽',
    keywords: [
      'treadmill', 'elliptical', 'stationary bike',
      'gym', 'dumbbell', 'barbell', 'kettlebell', 'weight',
      'yoga mat', 'yoga',
      'bicycle', 'cycle', 'mountain bike',
      'cricket', 'football', 'basketball', 'tennis', 'badminton', 'racket', 'bat',
      'swimming', 'goggles',
      'fitness tracker', 'fitness band',
      'sports',
    ],
  },
  'Jewellery & Watches': {
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    emoji: '💍',
    keywords: [
      'ring', 'necklace', 'bracelet', 'earring', 'pendant', 'chain', 'anklet', 'bangle',
      'gold', 'silver', 'platinum', 'diamond', 'gem', 'jewel',
      'analog watch', 'mechanical watch', 'luxury watch', 'wristwatch', 'timepiece',
      'rolex', 'fossil', 'titan', 'casio', 'seiko',
    ],
  },
  'Clothing & Footwear': {
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    emoji: '👟',
    keywords: [
      'shoes', 'sneakers', 'boots', 'sandals', 'slippers', 'heels',
      'shirt', 'tshirt', 't-shirt', 'jacket', 'coat', 'hoodie', 'sweater',
      'bag', 'backpack', 'luggage', 'handbag', 'purse', 'wallet', 'suitcase',
      'jeans', 'pants', 'trousers', 'dress', 'skirt',
    ],
  },
  Other: {
    color: '#9ca3af',
    gradient: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
    emoji: '📦',
    keywords: [],
  },
};

export const CATEGORY_ORDER = [
  'Electronics',
  'Home Appliances',
  'Kitchen Appliances',
  'Furniture',
  'Automotive',
  'Tools & Hardware',
  'Sports & Fitness',
  'Jewellery & Watches',
  'Clothing & Footwear',
  'Other',
];

/**
 * Categorize a warranty item using keyword matching.
 * Electronics is checked before Jewellery & Watches so "smartwatch" maps correctly.
 */
export function categorizeWarranty(warranty) {
  if (warranty.category) return warranty.category; // trust backend if set

  const text = `${warranty.productName || ''} ${warranty.merchantName || ''}`.toLowerCase();

  for (const catName of CATEGORY_ORDER) {
    if (catName === 'Other') continue;
    const keywords = CATEGORY_CONFIG[catName].keywords;
    if (keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      return catName;
    }
  }
  return 'Other';
}

/**
 * Group an array of warranties by their category.
 * Returns an object: { categoryName: [warranty, ...], ... }
 */
export function groupWarrantiesByCategory(warranties) {
  const groups = {};
  for (const w of warranties) {
    const cat = categorizeWarranty(w);
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(w);
  }
  return groups;
}

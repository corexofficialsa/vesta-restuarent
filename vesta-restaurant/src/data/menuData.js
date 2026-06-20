export const CURRENCY = 'SR';
export const BRAND_NAME = 'Vesta Cafe';

export const CATEGORIES = ['Hot Drinks', 'Cold Drinks', 'Pastries & Bakery', 'Desserts'];

export const CATEGORY_META = {
  'Hot Drinks':        { icon: '☕', gradient: 'from-amber-100 to-orange-100' },
  'Cold Drinks':       { icon: '🧋', gradient: 'from-blue-100 to-cyan-100'   },
  'Pastries & Bakery': { icon: '🥐', gradient: 'from-yellow-100 to-amber-100' },
  'Desserts':          { icon: '🍰', gradient: 'from-pink-100 to-rose-100'    },
};

export const INITIAL_MENU = [
  {
    id: 1,
    name: 'Spanish Latte',
    category: 'Hot Drinks',
    price: 22,
    description: 'Rich espresso shots poured over sweetened condensed milk, topped with velvety steamed whole milk. A Vesta signature.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80',
  },
  {
    id: 2,
    name: 'Cortado',
    category: 'Hot Drinks',
    price: 18,
    description: 'Equal parts bold espresso and warm microfoam — a perfectly balanced small glass of intensity and silk.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&q=80',
  },
  {
    id: 3,
    name: 'Matcha Latte',
    category: 'Hot Drinks',
    price: 24,
    description: 'Ceremonial-grade Japanese matcha whisked to a smooth froth, blended with steamed oat milk and a hint of honey.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&q=80',
  },
  {
    id: 4,
    name: 'Iced Caramel Macchiato',
    category: 'Cold Drinks',
    price: 26,
    description: 'Cold vanilla milk layered with ice, fresh espresso shots, and a generous drizzle of house caramel sauce.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80',
  },
  {
    id: 5,
    name: 'Cold Brew',
    category: 'Cold Drinks',
    price: 22,
    description: 'Slow-steeped for 18 hours in cold water, our cold brew delivers a naturally smooth, low-acid concentrate served over ice.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80',
  },
  {
    id: 6,
    name: 'Rose Lychee Cooler',
    category: 'Cold Drinks',
    price: 24,
    description: 'Freshly squeezed lemonade blended with rose syrup, lychee juice, and sparkling water — floral, fruity, and refreshing.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80',
  },
  {
    id: 7,
    name: 'Butter Croissant',
    category: 'Pastries & Bakery',
    price: 16,
    description: 'Freshly baked each morning — 72-hour laminated dough creating impossibly flaky, golden layers with pure French butter.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80',
  },
  {
    id: 8,
    name: 'Almond Croissant',
    category: 'Pastries & Bakery',
    price: 20,
    description: 'A twice-baked croissant filled with luscious almond frangipane cream, topped with toasted sliced almonds and powdered sugar.',
    image: 'https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=500&q=80',
  },
  {
    id: 9,
    name: 'Cinnamon Roll',
    category: 'Pastries & Bakery',
    price: 22,
    description: 'Pillowy soft enriched dough rolled with brown butter, cinnamon, and dark sugar — finished with a warm cream cheese glaze.',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&q=80',
  },
  {
    id: 10,
    name: 'Tiramisu',
    category: 'Desserts',
    price: 28,
    description: 'Classic Italian layers of espresso-soaked savoiardi biscuits and silky mascarpone cream, dusted with Valrhona cocoa.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80',
  },
  {
    id: 11,
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    price: 32,
    description: 'Warm dark chocolate fondant with a molten Valrhona centre, served with a scoop of Madagascar vanilla bean ice cream.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80',
  },
  {
    id: 12,
    name: 'Basque Cheesecake',
    category: 'Desserts',
    price: 26,
    description: 'Intentionally burnt-top Basque style cheesecake — creamy, caramelised, and custardy in the centre. Served at room temperature.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80',
  },
];

export const TABLES = [1, 2, 3, 4];

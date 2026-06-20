import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CATEGORIES } from '../../data/menuData';
import MenuCard from './MenuCard';
import Cart from './Cart';
import OrderStatusTracker from './OrderStatusTracker';

export default function CustomerView() {
  const { menu, activeTable, getActiveOrders } = useRestaurant();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const allCategories = ['All', ...CATEGORIES];
  const activeOrders = getActiveOrders(activeTable);

  const filtered = menu.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const groupedByCategory = allCategories.slice(1).reduce((acc, cat) => {
    const items = filtered.filter(i => i.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
      {/* Hero / Table header */}
      <div className="py-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Table {activeTable} — Menu
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {menu.length} items available today
          </p>
        </div>
        {/* Active orders badge */}
        {activeOrders.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-purple-700 text-xs font-medium">
              {activeOrders.length} active order{activeOrders.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Live order status tracker */}
      <OrderStatusTracker />

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search dishes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
        />
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150
              ${activeCategory === cat
                ? 'bg-purple-700 text-white shadow-md shadow-purple-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid — grouped by category */}
      {Object.entries(groupedByCategory).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-400 font-medium">No items found</p>
          <p className="text-gray-300 text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-10">
          {(activeCategory === 'All'
            ? Object.entries(groupedByCategory)
            : [[activeCategory, filtered]]
          ).map(([cat, items]) => (
            <section key={cat}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-bold text-gray-900 text-lg">{cat}</h2>
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">{items.length} items</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map(item => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <Cart />
    </div>
  );
}

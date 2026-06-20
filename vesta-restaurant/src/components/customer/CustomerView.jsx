import { useState, useRef, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CATEGORIES, CATEGORY_META } from '../../data/menuData';
import MenuCard from './MenuCard';
import Cart from './Cart';
import OrderStatusTracker from './OrderStatusTracker';
import logo from '../../assets/logo.png';

export default function CustomerView() {
  const { menu, activeTable, getActiveOrders } = useRestaurant();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const sectionRefs = useRef({});
  const categoryBarRef = useRef(null);
  const activeOrders = getActiveOrders(activeTable);

  const allCategories = ['All', ...CATEGORIES];

  const filtered = menu.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const groupedByCategory = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter(i => i.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = sectionRefs.current[cat];
    if (el) {
      const offset = 130;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Scroll active category tab into view in the horizontal bar
  useEffect(() => {
    if (!categoryBarRef.current) return;
    const activeBtn = categoryBarRef.current.querySelector('[data-active="true"]');
    if (activeBtn) activeBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeCategory]);

  const displayedSections = activeCategory === 'All'
    ? Object.entries(groupedByCategory)
    : [[activeCategory, filtered]];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 px-5 pt-6 pb-10">
        {/* decorative blobs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 blur-xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-purple-500/20 blur-xl" />

        <div className="relative flex items-center justify-between max-w-xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src={logo} alt="Vesta" className="w-7 h-7 object-contain" />
              <span className="text-white/90 text-sm font-semibold tracking-wide">Vesta Cafe</span>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight">Our Menu</h1>
            <p className="text-purple-200 text-sm mt-0.5">Table {activeTable} · {menu.length} items</p>
          </div>

          {activeOrders.length > 0 && (
            <div className="flex flex-col items-center bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-xs font-semibold">{activeOrders.length} Active</span>
              </div>
              <span className="text-purple-200 text-[10px]">order{activeOrders.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky category + search bar ── */}
      <div className="sticky top-16 z-20 bg-[#F9FAFB]/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        {/* Search */}
        <div className="px-4 pt-3 pb-2 max-w-xl mx-auto">
          <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all duration-200 ${
            searchFocused ? 'bg-white border-purple-400 shadow-sm ring-2 ring-purple-500/20' : 'bg-white border-gray-200'
          }`}>
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search drinks, pastries…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div ref={categoryBarRef} className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide max-w-xl mx-auto">
          {allCategories.map(cat => {
            const meta = CATEGORY_META[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                data-active={isActive}
                onClick={() => scrollToCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-lg shadow-purple-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {meta && <span className="text-base leading-none">{meta.icon}</span>}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-xl mx-auto px-4 pt-4 pb-36 lg:max-w-7xl">

        {/* Order status tracker */}
        <OrderStatusTracker />

        {/* Menu sections */}
        {displayedSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="text-5xl mb-4">☕</div>
            <p className="text-gray-500 font-medium">Nothing found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-8">
            {displayedSections.map(([cat, items]) => {
              const meta = CATEGORY_META[cat];
              return (
                <section
                  key={cat}
                  ref={el => sectionRefs.current[cat] = el}
                >
                  {/* Section header */}
                  <div className="flex items-center gap-3 mb-4">
                    {meta && (
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                        {meta.icon}
                      </div>
                    )}
                    <div>
                      <h2 className="font-bold text-gray-900 text-lg leading-tight">{cat}</h2>
                      <p className="text-gray-400 text-xs">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex-1 h-px bg-gray-200 ml-2" />
                  </div>

                  {/* Cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="animate-card-enter"
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        <MenuCard item={item} />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      <Cart />
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORIES, CATEGORY_META } from '../../data/menuData';
import MenuCard from './MenuCard';
import Cart from './Cart';
import OrderStatusTracker from './OrderStatusTracker';
import logo from '../../assets/logo.png';

export default function CustomerView() {
  const { menu, activeTable, getActiveOrders } = useRestaurant();
  const { t, isRTL } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const sectionRefs = useRef({});
  const categoryBarRef = useRef(null);
  const activeOrders = getActiveOrders(activeTable);
  const allCategories = ['All', ...CATEGORIES];

  const filtered = menu.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      item.name.toLowerCase().includes(q) ||
      (item.nameAr || '').includes(search) ||
      item.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const groupedByCategory = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter(i => i.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = sectionRefs.current[cat];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!categoryBarRef.current) return;
    const btn = categoryBarRef.current.querySelector('[data-active="true"]');
    if (btn) btn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeCategory]);

  const displayedSections = activeCategory === 'All'
    ? Object.entries(groupedByCategory)
    : [[activeCategory, filtered]];

  return (
    <div className="min-h-screen bg-[#F5F3FF]" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1e0a3c 0%, #3b0764 45%, #5b21b6 100%)' }}>
        {/* Ambient blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        <div className="absolute bottom-8 left-4 w-48 h-48 rounded-full opacity-15 blur-2xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

        <div className="relative px-5 pt-6 pb-12">
          {/* Logo row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <img src={logo} alt="Vesta" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-white font-bold tracking-wide text-sm">Vesta Cafe</span>
            </div>
            {activeOrders.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-400/30"
                style={{ background: 'rgba(34,197,94,0.15)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 text-xs font-semibold">{activeOrders.length} active</span>
              </div>
            )}
          </div>

          {/* Main hero text */}
          <div className={`${isRTL ? 'text-right' : ''}`}>
            <h1 className="text-white text-3xl font-black tracking-tight leading-tight">
              {t('ourMenu')}
            </h1>
            <p className="text-purple-300 text-sm mt-1.5 font-medium">
              {menu.length} {t('items')} · {t('tableNum')} {activeTable}
            </p>
          </div>
        </div>

        {/* White scoop cutout */}
        <div className="absolute bottom-0 left-0 right-0 h-7 bg-[#F5F3FF] rounded-t-[2rem]" />
      </div>

      {/* ── STICKY SEARCH + CATEGORY BAR ── */}
      <div className="sticky top-16 z-20 bg-[#F5F3FF]/96 backdrop-blur-md pb-2">
        {/* Search */}
        <div className="px-4 pt-4 pb-3">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white transition-all duration-200 ${
            searchFocused ? 'shadow-lg shadow-purple-200/60 ring-2 ring-purple-400/25' : 'shadow-sm shadow-purple-100/50'
          }`}>
            <svg className="w-4 h-4 text-purple-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none font-medium"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {search && (
              <button onClick={() => setSearch('')} className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div ref={categoryBarRef} className="flex gap-2 px-4 overflow-x-auto scrollbar-hide">
          {allCategories.map(cat => {
            const meta = CATEGORY_META[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                data-active={isActive}
                onClick={() => scrollToCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-300/40'
                    : 'bg-white text-gray-500 shadow-sm shadow-purple-100/40 hover:text-purple-700'
                }`}
              >
                {meta && <span className="text-sm leading-none">{meta.icon}</span>}
                {cat === 'All' ? t('all') : t(cat)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="px-4 pt-5 pb-36 max-w-xl mx-auto lg:max-w-7xl">
        <OrderStatusTracker />

        {displayedSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-purple-100 flex items-center justify-center text-3xl mb-4">☕</div>
            <p className="text-gray-700 font-bold">{t('nothingFound')}</p>
            <p className="text-gray-400 text-sm mt-1">{t('tryDifferent')}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {displayedSections.map(([cat, items]) => {
              const meta = CATEGORY_META[cat];
              return (
                <section key={cat} ref={el => sectionRefs.current[cat] = el}>
                  {/* Section header */}
                  <div className="flex items-center gap-2.5 mb-3.5">
                    {meta && (
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-lg flex-shrink-0`}>
                        {meta.icon}
                      </div>
                    )}
                    <h2 className="font-bold text-gray-900 text-base">{t(cat)}</h2>
                    <div className="flex-1 h-px bg-purple-100" />
                    <span className="text-xs text-purple-400 font-semibold">
                      {items.length} {items.length !== 1 ? t('items') : t('item')}
                    </span>
                  </div>

                  {/* 2-col grid on mobile */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {items.map((item, idx) => (
                      <div key={item.id} className="animate-card-enter" style={{ animationDelay: `${idx * 50}ms` }}>
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

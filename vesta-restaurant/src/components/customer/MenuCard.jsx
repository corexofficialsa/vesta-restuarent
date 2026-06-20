import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useLanguage } from '../../context/LanguageContext';
import { CURRENCY, CATEGORY_META } from '../../data/menuData';

export default function MenuCard({ item }) {
  const { activeTable, addToCart, getTableCart, updateQty } = useRestaurant();
  const { t, lang } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);

  const cart = getTableCart(activeTable);
  const cartItem = cart.items.find(i => i.id === item.id);
  const qty = cartItem?.qty || 0;

  const meta = CATEGORY_META[item.category] || { gradient: 'from-purple-100 to-purple-200', icon: '☕' };
  const displayName = lang === 'ar' ? (item.nameAr || item.name) : item.name;
  const displayDesc = lang === 'ar' ? (item.descriptionAr || item.description) : item.description;

  const handleAdd = () => {
    addToCart(activeTable, item);
    setAdding(true);
    setTimeout(() => setAdding(false), 350);
  };

  return (
    <div className={`bg-white rounded-2xl overflow-hidden flex flex-col card-shadow transition-all duration-300 active:scale-[0.97] ${qty > 0 ? 'ring-2 ring-purple-400/40' : ''}`}>

      {/* ── IMAGE ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
        {!imgError && item.image ? (
          <img
            src={item.image}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}>
            <span className="text-4xl opacity-60">{meta.icon}</span>
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* Name + Price on image */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-bold text-sm leading-tight line-clamp-1">{displayName}</p>
          <p className="text-purple-300 font-black text-base mt-0.5">{CURRENCY} {item.price}</p>
        </div>

        {/* Cart qty badge */}
        {qty > 0 && (
          <div className="absolute top-2.5 right-2.5 min-w-[26px] h-[26px] px-1.5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg animate-bounce-in">
            {qty}
          </div>
        )}
      </div>

      {/* ── BODY ── */}
      <div className="p-3 flex flex-col flex-1">
        {/* Description */}
        <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2 flex-1 mb-3">
          {displayDesc}
        </p>

        {/* Controls */}
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95
              ${adding
                ? 'bg-purple-700 text-white scale-95'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-700 hover:text-white'
              }`}
          >
            + {t('addToOrder')}
          </button>
        ) : (
          <div className="flex items-center bg-purple-700 rounded-xl overflow-hidden animate-scale-in">
            <button
              onClick={() => updateQty(activeTable, item.id, -1)}
              className="flex-1 py-2.5 text-white font-black text-lg hover:bg-purple-800 transition-colors active:scale-90 flex items-center justify-center"
            >−</button>
            <span className="text-white font-black text-sm w-8 text-center">{qty}</span>
            <button
              onClick={handleAdd}
              className="flex-1 py-2.5 text-white font-black text-lg hover:bg-purple-800 transition-colors active:scale-90 flex items-center justify-center"
            >+</button>
          </div>
        )}
      </div>
    </div>
  );
}

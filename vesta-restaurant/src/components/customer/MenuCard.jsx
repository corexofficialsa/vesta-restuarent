import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CURRENCY, CATEGORY_META } from '../../data/menuData';

export default function MenuCard({ item }) {
  const { activeTable, addToCart, getTableCart, updateQty } = useRestaurant();
  const [imgError, setImgError] = useState(false);
  const [ripple, setRipple] = useState(false);

  const cart = getTableCart(activeTable);
  const cartItem = cart.items.find(i => i.id === item.id);
  const qty = cartItem?.qty || 0;

  const meta = CATEGORY_META[item.category] || { gradient: 'from-gray-100 to-gray-200', icon: '☕' };

  const handleAdd = () => {
    addToCart(activeTable, item);
    setRipple(true);
    setTimeout(() => setRipple(false), 400);
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] flex flex-col border border-gray-100/80">
      {/* Image */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${meta.gradient} flex-shrink-0`} style={{ aspectRatio: '4/3' }}>
        {!imgError ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}>
            <span className="text-5xl opacity-50">{meta.icon}</span>
          </div>
        )}

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-purple-700 text-[10px] font-bold rounded-full shadow-sm uppercase tracking-wide">
            {item.category}
          </span>
        </div>

        {/* Qty badge */}
        {qty > 0 && (
          <div className="absolute top-3 right-3 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-bounce-in">
            {qty}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-gray-900 text-sm leading-snug">{item.name}</h3>
          <span className="text-purple-700 font-bold text-sm whitespace-nowrap flex-shrink-0">
            {CURRENCY} {item.price}
          </span>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed flex-1 mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Controls */}
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            className={`
              relative w-full py-2.5 rounded-2xl text-sm font-semibold overflow-hidden
              bg-purple-50 text-purple-700 border border-purple-200
              hover:bg-purple-700 hover:text-white hover:border-purple-700 hover:shadow-md hover:shadow-purple-200
              active:scale-95 transition-all duration-200
              ${ripple ? 'scale-95' : ''}
            `}
          >
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add to Order
            </span>
          </button>
        ) : (
          <div className="flex items-center justify-between bg-purple-700 rounded-2xl p-1 animate-scale-in">
            <button
              onClick={() => updateQty(activeTable, item.id, -1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-lg transition-colors active:scale-90"
            >
              −
            </button>
            <span className="text-white font-bold text-sm px-3">{qty}</span>
            <button
              onClick={handleAdd}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-lg transition-colors active:scale-90"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function MenuCard({ item }) {
  const { activeTable, addToCart, getTableCart } = useRestaurant();
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const cart = getTableCart(activeTable);
  const cartItem = cart.items.find(i => i.id === item.id);
  const qty = cartItem?.qty || 0;

  const handleAdd = () => {
    addToCart(activeTable, item);
    setAdded(true);
    setTimeout(() => setAdded(false), 600);
  };

  const placeholderGradients = {
    'Appetizers': 'from-orange-100 to-amber-100',
    'Mains': 'from-red-100 to-orange-100',
    'Desserts & Drinks': 'from-pink-100 to-purple-100',
  };

  const gradient = placeholderGradients[item.category] || 'from-gray-100 to-gray-200';

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col animate-fade-in">
      {/* Image */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} overflow-hidden flex-shrink-0`}>
        {!imgError ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-4xl opacity-60">
              {item.category === 'Appetizers' ? '🥗' : item.category === 'Mains' ? '🍛' : '🍮'}
            </span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-semibold rounded-full shadow-sm border border-white/50">
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
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</h3>
          <span className="text-purple-700 font-bold text-sm whitespace-nowrap">₹{item.price}</span>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed flex-1 mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Add button */}
        <button
          onClick={handleAdd}
          className={`
            w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
            flex items-center justify-center gap-2
            ${added
              ? 'bg-green-500 text-white scale-95'
              : qty > 0
              ? 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95'
              : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-600 hover:text-white hover:border-purple-600 active:scale-95'
            }
          `}
        >
          {added ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Added!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {qty > 0 ? `Add More (${qty})` : 'Add to Order'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

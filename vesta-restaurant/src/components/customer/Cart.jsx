import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function Cart() {
  const {
    activeTable,
    getTableCart,
    getCartCount,
    getCartTotal,
    updateQty,
    removeFromCart,
    placeOrder,
  } = useRestaurant();

  const [open, setOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const cart = getTableCart(activeTable);
  const count = getCartCount(activeTable);
  const total = getCartTotal(activeTable);

  const handlePlaceOrder = () => {
    if (!cart.items.length) return;
    setPlacing(true);
    setTimeout(() => {
      placeOrder(activeTable);
      setPlacing(false);
      setOrdered(true);
      setTimeout(() => {
        setOrdered(false);
        setOpen(false);
      }, 1800);
    }, 600);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className={`
          fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl
          font-semibold text-sm transition-all duration-200
          ${count > 0
            ? 'bg-purple-700 text-white hover:bg-purple-800 active:scale-95'
            : 'bg-white text-gray-400 border border-gray-200 cursor-default shadow-sm'
          }
        `}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span>{count > 0 ? `View Order` : 'Cart Empty'}</span>
        {count > 0 && (
          <span className="bg-white text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
        {count > 0 && (
          <span className="text-purple-200 font-normal">₹{total}</span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-out Drawer */}
      <aside
        className={`
          fixed right-0 top-0 h-full w-full sm:w-[420px] z-50 bg-white shadow-2xl
          flex flex-col transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Your Order</h2>
            <p className="text-gray-400 text-xs mt-0.5">Table {activeTable}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-5 space-y-3">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-gray-400 font-medium">Your cart is empty</p>
              <p className="text-gray-300 text-sm mt-1">Add items from the menu</p>
            </div>
          ) : (
            cart.items.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl animate-fade-in"
              >
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                  <p className="text-purple-600 text-xs font-semibold">₹{item.price * item.qty}</p>
                </div>
                {/* Qty controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(activeTable, item.id, -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors text-sm font-bold"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-gray-900">{item.qty}</span>
                  <button
                    onClick={() => updateQty(activeTable, item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-colors text-sm font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(activeTable, item.id)}
                    className="ml-1 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="p-5 border-t border-gray-100 space-y-4">
            {/* Bill summary */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal ({count} item{count !== 1 ? 's' : ''})</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>GST (5%)</span>
                <span>₹{Math.round(total * 0.05)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1.5 border-t border-gray-100">
                <span>Total</span>
                <span className="text-purple-700">₹{total + Math.round(total * 0.05)}</span>
              </div>
            </div>

            {/* Place Order button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placing || ordered}
              className={`
                w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200
                flex items-center justify-center gap-2
                ${ordered
                  ? 'bg-green-500 text-white'
                  : placing
                  ? 'bg-purple-400 text-white cursor-wait'
                  : 'bg-purple-700 text-white hover:bg-purple-800 active:scale-95 shadow-lg shadow-purple-200'
                }
              `}
            >
              {ordered ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Order Sent to Kitchen!
                </>
              ) : placing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Sending Order…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Place Order · ₹{total + Math.round(total * 0.05)}
                </>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

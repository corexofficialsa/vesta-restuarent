import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CURRENCY } from '../../data/menuData';
import PaymentModal from './PaymentModal';

export default function Cart() {
  const {
    activeTable, getTableCart, getCartCount, getCartTotal,
    updateQty, removeFromCart, placeOrder,
  } = useRestaurant();

  const [open, setOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const cart = getTableCart(activeTable);
  const count = getCartCount(activeTable);
  const total = getCartTotal(activeTable);
  const vat = Math.round(total * 0.15);

  const handlePaymentSuccess = () => {
    placeOrder(activeTable);
    setShowPayment(false);
    setOpen(false);
  };

  return (
    <>
      {/* ── FAB ── */}
      <button
        onClick={() => count > 0 && setOpen(true)}
        className={`
          fixed bottom-6 left-1/2 -translate-x-1/2 z-40
          flex items-center gap-3 px-6 py-3.5 rounded-full shadow-2xl
          font-semibold text-sm transition-all duration-300
          ${count > 0
            ? 'bg-purple-700 text-white hover:bg-purple-800 hover:shadow-purple-300 active:scale-95 animate-float'
            : 'bg-white text-gray-300 border border-gray-200 shadow-sm cursor-default'
          }
        `}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {count > 0 ? (
          <>
            <span>{count} item{count !== 1 ? 's' : ''}</span>
            <span className="w-px h-4 bg-white/30" />
            <span className="text-purple-200">{CURRENCY} {total}</span>
          </>
        ) : (
          <span>Cart Empty</span>
        )}
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Drawer — bottom sheet on mobile, side panel on sm+ ── */}
      <aside className={`
        fixed z-50 bg-white flex flex-col
        transition-transform duration-400 ease-spring
        /* Mobile: bottom sheet */
        bottom-0 left-0 right-0 rounded-t-3xl max-h-[90vh]
        /* Desktop: side drawer */
        sm:top-0 sm:right-0 sm:left-auto sm:bottom-auto sm:w-[420px] sm:h-full sm:rounded-none sm:max-h-none
        shadow-2xl
        ${open
          ? 'translate-y-0 sm:translate-x-0'
          : 'translate-y-full sm:translate-y-0 sm:translate-x-full'
        }
      `}>
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Your Order</h2>
            <p className="text-gray-400 text-xs mt-0.5">Table {activeTable}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-5 space-y-3">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 animate-fade-in">
              <div className="text-6xl mb-4">☕</div>
              <p className="text-gray-500 font-semibold">Nothing here yet</p>
              <p className="text-gray-400 text-sm mt-1">Add items from our menu</p>
            </div>
          ) : (
            cart.items.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl animate-fade-in">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-purple-100">
                  <img
                    src={item.image} alt={item.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                  <p className="text-purple-600 text-xs font-bold mt-0.5">{CURRENCY} {item.price * item.qty}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => updateQty(activeTable, item.id, -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-red-200 hover:text-red-500 font-bold transition-colors active:scale-90 text-sm"
                  >−</button>
                  <span className="w-5 text-center text-sm font-bold text-gray-900">{item.qty}</span>
                  <button
                    onClick={() => updateQty(activeTable, item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-purple-300 hover:text-purple-600 font-bold transition-colors active:scale-90 text-sm"
                  >+</button>
                  <button
                    onClick={() => removeFromCart(activeTable, item.id)}
                    className="ml-1 w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors active:scale-90"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="p-5 border-t border-gray-100 flex-shrink-0 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{CURRENCY} {total}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>VAT (15%)</span>
                <span>{CURRENCY} {vat}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-purple-700">{CURRENCY} {total + vat}</span>
              </div>
            </div>

            <button
              onClick={() => setShowPayment(true)}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-purple-700 text-white hover:bg-purple-800 active:scale-95 shadow-lg shadow-purple-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
              Proceed to Payment · {CURRENCY} {total + vat}
            </button>

            <p className="text-center text-gray-400 text-[10px]">
              VAT 15% included · Prices in Saudi Riyal
            </p>
          </div>
        )}
      </aside>

      {showPayment && (
        <PaymentModal
          total={total}
          vat={vat}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
}

import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useLanguage } from '../../context/LanguageContext';
import { CURRENCY } from '../../data/menuData';
import PaymentModal from './PaymentModal';

export default function Cart() {
  const { activeTable, getTableCart, getCartCount, getCartTotal, updateQty, removeFromCart, placeOrder } = useRestaurant();
  const { t, isRTL, lang } = useLanguage();
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
      {count > 0 ? (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-4 right-4 z-40 flex items-center justify-between px-4 py-3.5 rounded-2xl text-white transition-all duration-300 active:scale-[0.97] animate-slide-up"
          style={{
            background: 'linear-gradient(135deg, #5b21b6 0%, #6d28d9 100%)',
            boxShadow: '0 8px 32px rgba(109,40,217,0.45), 0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {/* Left: icon + count */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-white text-purple-700 rounded-full text-[10px] font-black flex items-center justify-center animate-bounce-in">
                {count}
              </div>
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-white font-semibold text-sm leading-tight">{t('yourOrder')}</p>
              <p className="text-purple-200 text-[11px]">{count} {count !== 1 ? t('items') : t('item')}</p>
            </div>
          </div>
          {/* Right: price */}
          <div className="flex items-center gap-1.5">
            <span className="text-white font-black text-base">{CURRENCY} {total}</span>
            <svg className="w-4 h-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      ) : (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-purple-100">
          <span className="text-gray-400 text-sm font-medium">☕ {t('cartEmptyLabel')}</span>
        </div>
      )}

      {/* ── BACKDROP ── */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
      )}

      {/* ── BOTTOM SHEET ── */}
      <aside
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`
          fixed z-50 bg-white flex flex-col
          transition-transform duration-300 ease-spring
          bottom-0 left-0 right-0 rounded-t-[2rem] max-h-[92vh]
          sm:top-0 sm:right-0 sm:left-auto sm:bottom-auto sm:w-[420px] sm:h-full sm:rounded-none sm:max-h-none
          ${open ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full'}
        `}
        style={{ boxShadow: '0 -8px 40px rgba(109,40,217,0.15), 0 -2px 8px rgba(0,0,0,0.08)' }}
      >
        {/* Drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 border-b border-gray-100/80">
          <div>
            <h2 className="font-black text-gray-900 text-lg">{t('yourOrder')}</h2>
            <p className="text-gray-400 text-xs mt-0.5">{t('tableNum')} {activeTable} · {count} {count !== 1 ? t('items') : t('item')}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors active:scale-90"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-2.5">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-purple-50 flex items-center justify-center text-3xl mb-4">🛒</div>
              <p className="text-gray-700 font-bold">{t('cartEmpty')}</p>
              <p className="text-gray-400 text-sm mt-1">{t('cartEmptyHint')}</p>
            </div>
          ) : (
            cart.items.map(item => {
              const name = lang === 'ar' ? (item.nameAr || item.name) : item.name;
              return (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  {/* Thumb */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-purple-100">
                    <img src={item.image} alt={name} className="w-full h-full object-cover"
                      onError={e => e.target.style.display = 'none'} />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
                    <p className="text-purple-600 text-sm font-black mt-0.5">{CURRENCY} {item.price * item.qty}</p>
                  </div>
                  {/* Controls */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => updateQty(activeTable, item.id, -1)}
                      className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 font-bold hover:border-red-200 hover:text-red-400 transition-colors active:scale-90 text-base">
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-gray-900">{item.qty}</span>
                    <button onClick={() => updateQty(activeTable, item.id, 1)}
                      className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 font-bold hover:border-purple-300 hover:text-purple-600 transition-colors active:scale-90 text-base">
                      +
                    </button>
                    <button onClick={() => removeFromCart(activeTable, item.id)}
                      className="w-8 h-8 ml-0.5 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors active:scale-90">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="flex-shrink-0 px-5 pt-4 pb-6 border-t border-gray-100/80 space-y-4">
            {/* Bill breakdown */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{t('subtotal')}</span>
                <span className="font-medium text-gray-700">{CURRENCY} {total}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{t('vat')}</span>
                <span className="font-medium text-gray-700">{CURRENCY} {vat}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between text-base font-black text-gray-900">
                <span>{t('total')}</span>
                <span className="text-purple-700">{CURRENCY} {total + vat}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setShowPayment(true)}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-between px-5 active:scale-[0.98] transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #5b21b6 0%, #6d28d9 100%)',
                boxShadow: '0 6px 24px rgba(109,40,217,0.35)',
              }}
            >
              <span>{t('proceedPayment')}</span>
              <span className="font-black text-base">{CURRENCY} {total + vat}</span>
            </button>

            <p className="text-center text-gray-400 text-[10px]">{t('vatNote')}</p>
          </div>
        )}
      </aside>

      {showPayment && (
        <PaymentModal total={total} vat={vat} onSuccess={handlePaymentSuccess} onClose={() => setShowPayment(false)} />
      )}
    </>
  );
}

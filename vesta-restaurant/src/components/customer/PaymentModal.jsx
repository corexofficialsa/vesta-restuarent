import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CURRENCY } from '../../data/menuData';

function detectCardType(number) {
  const n = number.replace(/\s/g, '');
  const madaBins = ['409201', '458456', '484783', '486094', '486095', '486096', '504300', '507860', '507861', '507862', '507863', '507864', '507865', '507866', '507867', '507868', '507869', '636120', '968201', '968202', '968203', '968204', '968205', '968206', '968207', '968208', '968209', '968210', '968211'];
  if (madaBins.some(b => n.startsWith(b.slice(0, n.length)))) return 'mada';
  if (n.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(n)) return 'mastercard';
  if (n.startsWith('6')) return 'mada';
  return null;
}

function formatNumber(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(val) {
  const c = val.replace(/\D/g, '').slice(0, 4);
  return c.length >= 2 ? c.slice(0, 2) + '/' + c.slice(2) : c;
}

function CardTypeIcon({ type }) {
  if (type === 'visa') return <span className="text-[10px] font-black italic tracking-tighter text-blue-700 bg-white px-1.5 py-0.5 rounded">VISA</span>;
  if (type === 'mastercard') return <span className="flex -space-x-1.5"><span className="w-5 h-5 rounded-full bg-red-500 opacity-90"/><span className="w-5 h-5 rounded-full bg-yellow-400 opacity-90"/></span>;
  if (type === 'mada') return <span className="text-[10px] font-black text-green-700 bg-white px-1.5 py-0.5 rounded tracking-wide">مدى</span>;
  return null;
}

function CardPreview({ number, name, expiry, cardType }) {
  const displayNumber = number.padEnd(19, ' ').slice(0, 19);
  const chunks = [displayNumber.slice(0, 4), displayNumber.slice(5, 9), displayNumber.slice(10, 14), displayNumber.slice(15, 19)];
  const gradient = cardType === 'mada' ? 'from-green-700 to-green-900' : cardType === 'visa' ? 'from-blue-700 to-purple-800' : cardType === 'mastercard' ? 'from-gray-800 to-gray-900' : 'from-purple-700 to-purple-900';

  return (
    <div className={`relative w-full h-44 rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-xl overflow-hidden mb-5 transition-all duration-500`} dir="ltr">
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-16 translate-x-16"/>
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-12 -translate-x-8"/>
      <div className="flex justify-between items-start mb-6">
        <div className="w-9 h-7 rounded-md bg-yellow-300/80 flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-sm border-2 border-yellow-600/60"/>
        </div>
        <CardTypeIcon type={cardType}/>
      </div>
      <div className="font-mono text-lg tracking-widest mb-4 flex gap-2">
        {chunks.map((chunk, i) => (
          <span key={i} className={chunk.trim() ? 'text-white' : 'text-white/30'}>{chunk.trim() || '····'}</span>
        ))}
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Card Holder</p>
          <p className="text-sm font-semibold uppercase tracking-wide truncate max-w-[150px]">{name.trim() || 'YOUR NAME'}</p>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Expires</p>
          <p className="text-sm font-semibold font-mono">{expiry || 'MM/YY'}</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentModal({ total, vat, onSuccess, onClose }) {
  const { t, isRTL } = useLanguage();
  const [step, setStep] = useState('method');
  const [method, setMethod] = useState(null);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [errors, setErrors] = useState({});
  const [showCvv, setShowCvv] = useState(false);
  const grand = total + vat;
  const cardType = detectCardType(card.number);

  const handleApplePay = () => {
    setMethod('apple');
    setStep('processing');
    setTimeout(() => { setStep('success'); setTimeout(onSuccess, 1500); }, 2200);
  };

  const handleCardMethod = (m) => { setMethod(m); setStep('card'); };

  const updateCard = (field, val) => {
    let v = val;
    if (field === 'number') v = formatNumber(val);
    if (field === 'expiry') v = formatExpiry(val);
    if (field === 'cvv') v = val.replace(/\D/g, '').slice(0, 4);
    setCard(c => ({ ...c, [field]: v }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const submit = () => {
    const e = {};
    if (card.number.replace(/\s/g, '').length < 16) e.number = t('errCard');
    if (card.expiry.length < 5) e.expiry = t('errExpiry');
    if (card.cvv.length < 3) e.cvv = t('errCvv');
    if (!card.name.trim()) e.name = t('errName');
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep('processing');
    setTimeout(() => { setStep('success'); setTimeout(onSuccess, 1500); }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end sm:justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={step === 'method' || step === 'card' ? onClose : undefined}/>

      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="relative bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[95vh] flex flex-col"
      >

        {/* METHOD SELECTION */}
        {step === 'method' && (
          <>
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{t('choosePayment')}</h2>
                <p className="text-gray-400 text-xs mt-0.5">{t('total')}: {CURRENCY} {grand}</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="p-5 space-y-3 overflow-y-auto">
              <button onClick={handleApplePay} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-black text-white font-semibold text-base hover:bg-gray-900 active:scale-95 transition-all duration-200 shadow-lg">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                {t('payApple')}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200"/>
                <span className="text-xs text-gray-400 font-medium">{t('orCard')}</span>
                <div className="flex-1 h-px bg-gray-200"/>
              </div>

              <button onClick={() => handleCardMethod('mada')} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 active:scale-95 transition-all duration-200">
                <div className="w-12 h-8 rounded-lg bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-black tracking-wide">مدى</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">{t('mada')}</p>
                  <p className="text-gray-400 text-xs">{t('madaSub')}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 mr-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>

              <button onClick={() => handleCardMethod('visa')} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 active:scale-95 transition-all duration-200">
                <div className="w-12 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-black italic tracking-tighter">VISA</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">{t('creditCard')}</p>
                  <p className="text-gray-400 text-xs">{t('creditSub')}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 mr-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>

              <div className="flex items-center justify-center gap-2 pt-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <span className="text-[10px] text-gray-400">{t('sslNote')}</span>
              </div>
            </div>
          </>
        )}

        {/* CARD FORM */}
        {step === 'card' && (
          <>
            <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
              <button onClick={() => setStep('method')} className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div>
                <h2 className="font-bold text-gray-900 text-base">{method === 'mada' ? `مدى ${t('mada')}` : t('creditCard')}</h2>
                <p className="text-gray-400 text-xs">{CURRENCY} {grand}</p>
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <CardPreview number={card.number} name={card.name} expiry={card.expiry} cardType={method === 'mada' ? 'mada' : cardType || 'visa'}/>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t('cardNumber')}</label>
                <div className="relative">
                  <input type="tel" inputMode="numeric" placeholder={t('cardPlaceholder')} value={card.number}
                    onChange={e => updateCard('number', e.target.value)}
                    dir="ltr"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-mono text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all pr-12 ${errors.number ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2"><CardTypeIcon type={method === 'mada' ? 'mada' : cardType}/></div>
                </div>
                {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t('expiry')}</label>
                  <input type="tel" inputMode="numeric" placeholder={t('expiryPlaceholder')} value={card.expiry}
                    onChange={e => updateCard('expiry', e.target.value)} dir="ltr"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-mono text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all ${errors.expiry ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t('cvv')}</label>
                  <div className="relative">
                    <input type={showCvv ? 'text' : 'password'} inputMode="numeric" placeholder="•••" value={card.cvv}
                      onChange={e => updateCard('cvv', e.target.value)} dir="ltr"
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-mono text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all pr-10 ${errors.cvv ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                    <button type="button" onClick={() => setShowCvv(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showCvv
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      }
                    </button>
                  </div>
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t('holderName')}</label>
                <input type="text" placeholder={t('namePlaceholder')} value={card.name}
                  onChange={e => updateCard('name', e.target.value.toUpperCase())} dir="ltr"
                  className={`w-full px-4 py-3 rounded-xl border text-sm uppercase tracking-wide text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <button onClick={submit} className="w-full py-4 rounded-2xl bg-purple-700 text-white font-bold text-sm hover:bg-purple-800 active:scale-95 transition-all duration-200 shadow-lg shadow-purple-200 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                {t('pay')} {CURRENCY} {grand}
              </button>

              <p className="text-center text-[10px] text-gray-400">{t('demoNote')}</p>
            </div>
          </>
        )}

        {/* PROCESSING */}
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20 px-8 gap-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-purple-100"/>
              <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"/>
              <div className="absolute inset-0 flex items-center justify-center">
                {method === 'apple'
                  ? <svg className="w-8 h-8 text-gray-800" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  : <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                }
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-lg">{t('processing')}</p>
              <p className="text-gray-400 text-sm mt-1">{t('processingWait')}</p>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-20 px-8 gap-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce-in">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-xl">{t('confirmed')}</p>
              <p className="text-gray-400 text-sm mt-1">{CURRENCY} {grand} · {t('confirmedSub')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

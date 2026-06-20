import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import logo from '../../assets/logo.png';

export default function LanguageSelector({ tableId }) {
  const { setLang } = useLanguage();
  const [selecting, setSelecting] = useState(null);

  const choose = (l) => {
    setSelecting(l);
    setTimeout(() => setLang(l), 650);
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #3b0764 0%, #581c87 40%, #6d28d9 100%)' }}>

      {/* Background blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)' }} />

      {/* Logo + brand */}
      <div className="relative flex flex-col items-center mb-10 animate-fade-in">
        <div className="w-24 h-24 mb-5 rounded-3xl flex items-center justify-center shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)' }}>
          <img src={logo} alt="Vesta Cafe" className="w-14 h-14 object-contain drop-shadow-lg" />
        </div>
        <h1 className="text-white text-3xl font-bold tracking-wide drop-shadow-lg">Vesta Cafe</h1>
        <div className="mt-3 px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span className="text-purple-200 text-sm font-medium">Table {tableId} · طاولة {tableId}</span>
        </div>
      </div>

      {/* Bilingual heading */}
      <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '120ms' }}>
        <p className="text-white/50 text-xs uppercase tracking-widest font-medium mb-1">Choose your language</p>
        <p className="text-white/50 text-xs uppercase tracking-widest font-medium" dir="rtl">اختر لغتك</p>
      </div>

      {/* Cards */}
      <div className="flex gap-4 w-full max-w-xs px-4 animate-slide-up" style={{ animationDelay: '200ms' }}>

        {/* English */}
        <button
          onClick={() => choose('en')}
          disabled={!!selecting}
          className={`flex-1 flex flex-col items-center gap-4 p-6 rounded-3xl transition-all duration-300 outline-none
            ${selecting === 'en'
              ? 'bg-white scale-95 shadow-2xl'
              : selecting
              ? 'opacity-40 scale-95'
              : 'hover:-translate-y-2 hover:shadow-2xl active:scale-95'
            }`}
          style={!selecting || selecting === 'en' ? {
            background: selecting === 'en' ? 'white' : 'rgba(255,255,255,0.1)',
            border: selecting === 'en' ? '2px solid white' : '2px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(12px)',
          } : {}}
        >
          <span className="text-5xl leading-none drop-shadow-md">🇬🇧</span>
          <div className="text-center">
            <p className={`font-bold text-xl ${selecting === 'en' ? 'text-purple-900' : 'text-white'}`}>English</p>
            <p className={`text-xs mt-1 ${selecting === 'en' ? 'text-purple-400' : 'text-white/40'}`}>
              Tap to continue
            </p>
          </div>
          {selecting === 'en' && (
            <div className="w-7 h-7 rounded-full bg-purple-700 flex items-center justify-center animate-bounce-in shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          )}
        </button>

        {/* Arabic */}
        <button
          onClick={() => choose('ar')}
          disabled={!!selecting}
          dir="rtl"
          className={`flex-1 flex flex-col items-center gap-4 p-6 rounded-3xl transition-all duration-300 outline-none
            ${selecting === 'ar'
              ? 'bg-white scale-95 shadow-2xl'
              : selecting
              ? 'opacity-40 scale-95'
              : 'hover:-translate-y-2 hover:shadow-2xl active:scale-95'
            }`}
          style={!selecting || selecting === 'ar' ? {
            background: selecting === 'ar' ? 'white' : 'rgba(255,255,255,0.1)',
            border: selecting === 'ar' ? '2px solid white' : '2px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(12px)',
          } : {}}
        >
          <span className="text-5xl leading-none drop-shadow-md">🇸🇦</span>
          <div className="text-center">
            <p className={`font-bold text-xl ${selecting === 'ar' ? 'text-purple-900' : 'text-white'}`}>العربية</p>
            <p className={`text-xs mt-1 ${selecting === 'ar' ? 'text-purple-400' : 'text-white/40'}`}>
              اضغط للمتابعة
            </p>
          </div>
          {selecting === 'ar' && (
            <div className="w-7 h-7 rounded-full bg-purple-700 flex items-center justify-center animate-bounce-in shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Bottom note */}
      <p className="absolute bottom-8 text-white/20 text-xs text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
        Powered by Vesta Cafe · فيستا كافيه
      </p>
    </div>
  );
}

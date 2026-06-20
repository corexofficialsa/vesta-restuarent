import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useLanguage } from '../../context/LanguageContext';
import { CURRENCY } from '../../data/menuData';

const STEPS = [
  { status: 'Pending', labelKey: 'Order Received',   subKey: 'queueSub',   icon: '🧾', color: 'amber'  },
  { status: 'Cooking', labelKey: 'Being Prepared',   subKey: 'baristaSub', icon: '☕', color: 'blue'   },
  { status: 'Ready',   labelKey: 'Ready to Collect', subKey: 'readySub',   icon: '✅', color: 'green'  },
  { status: 'Served',  labelKey: 'Enjoy!',           subKey: 'servedSub',  icon: '🎉', color: 'purple' },
];

const stepIndex = s => STEPS.findIndex(x => x.status === s);

const colorMap = {
  amber:  { bg: 'bg-amber-50',  ring: 'ring-amber-300',  bar: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700',  border: 'border-amber-200' },
  blue:   { bg: 'bg-blue-50',   ring: 'ring-blue-300',   bar: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700',    border: 'border-blue-200'  },
  green:  { bg: 'bg-emerald-50',ring: 'ring-emerald-300',bar: 'bg-emerald-500',badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
  purple: { bg: 'bg-purple-50', ring: 'ring-purple-300', bar: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700', border: 'border-purple-200' },
};

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}

function OrderCard({ order }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const idx = stepIndex(order.status);
  const step = STEPS[Math.max(0, idx)];
  const c = colorMap[step.color];
  const progress = Math.round((idx / (STEPS.length - 1)) * 100);

  return (
    <div className={`bg-white rounded-2xl overflow-hidden animate-fade-in border ${c.border} card-shadow`}>
      {/* Thin top bar showing status color */}
      <div className={`h-1 ${c.bar} w-full`} style={{ width: `${progress}%`, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />

      <button onClick={() => setExpanded(v => !v)} className="w-full text-left">
        <div className="flex items-center gap-3 p-4">
          {/* Icon */}
          <div className={`w-11 h-11 rounded-2xl ${c.bg} flex items-center justify-center text-xl flex-shrink-0`}>
            {step.icon}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-bold text-gray-900 text-sm">{t(step.labelKey)}</p>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.badge}`}>{t(order.status)}</span>
            </div>
            <p className="text-gray-400 text-xs truncate">{t(step.subKey)}</p>
          </div>
          {/* Time + chevron */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-gray-300 text-xs">{timeAgo(order.placedAt)}</span>
            <svg className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Step dots */}
      <div className="flex items-center gap-1 px-4 pb-3">
        {STEPS.map((s, i) => {
          const done = i <= idx;
          const sc = colorMap[s.color];
          return (
            <div key={s.status} className="flex items-center flex-1">
              <div className={`w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                done ? `${sc.bar} text-white ring-2 ring-offset-2 ${sc.ring}` : 'bg-gray-100 text-gray-300'
              }`}>
                {done ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 rounded-full transition-all duration-500 ${i < idx ? c.bar : 'bg-gray-100'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded items */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pt-3 pb-4 space-y-2 animate-fade-in">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center">{item.qty}</span>
                <span className="text-gray-700">{item.name}</span>
              </div>
              <span className="text-gray-500 font-semibold">{CURRENCY} {item.price * item.qty}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-sm pt-2 border-t border-gray-100">
            <span className="text-gray-500">{t('totalLabel')}</span>
            <span className="text-purple-700">{CURRENCY} {order.items.reduce((s, i) => s + i.price * i.qty, 0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderStatusTracker() {
  const { t } = useLanguage();
  const { activeTable, getActiveOrders, orders } = useRestaurant();
  const activeOrders = getActiveOrders(activeTable);
  const recentServed = orders.filter(o => o.tableId === activeTable && o.status === 'Served').slice(0, 1);
  const allVisible = [...activeOrders, ...recentServed];
  if (!allVisible.length) return null;

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-60" />
        </div>
        <span className="font-bold text-gray-900 text-sm">{t('liveStatus')}</span>
        <span className="text-gray-400 text-xs">{t('realTime')}</span>
      </div>
      <div className="space-y-3">
        {allVisible.map(order => <OrderCard key={order.id} order={order} />)}
      </div>
    </div>
  );
}

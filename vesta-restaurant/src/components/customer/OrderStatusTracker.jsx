import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useLanguage } from '../../context/LanguageContext';
import { CURRENCY } from '../../data/menuData';

const STEPS = [
  { status: 'Pending', labelKey: 'Order Received', subKey: 'queueSub',   icon: '📋', color: 'purple' },
  { status: 'Cooking', labelKey: 'Being Prepared', subKey: 'baristaSub', icon: '👨‍🍳', color: 'blue'   },
  { status: 'Ready',   labelKey: 'Ready to Collect', subKey: 'readySub', icon: '✅', color: 'green'  },
  { status: 'Served',  labelKey: 'Enjoy!',          subKey: 'servedSub', icon: '🎉', color: 'gray'   },
];

const stepIndex = s => STEPS.findIndex(x => x.status === s);

const colorMap = {
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', bar: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700 border-purple-200', border: 'border-purple-200' },
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   bar: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700 border-blue-200',       border: 'border-blue-200'   },
  green:  { bg: 'bg-green-100',  text: 'text-green-700',  bar: 'bg-green-500',  badge: 'bg-green-100 text-green-700 border-green-200',     border: 'border-green-200'  },
  gray:   { bg: 'bg-gray-100',   text: 'text-gray-500',   bar: 'bg-gray-300',   badge: 'bg-gray-100 text-gray-400 border-gray-200',        border: 'border-gray-200'   },
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
  const progress = (idx / (STEPS.length - 1)) * 100;

  return (
    <div className={`bg-white rounded-2xl border-2 ${c.border} overflow-hidden shadow-sm animate-fade-in`}>
      <button onClick={() => setExpanded(v => !v)} className="w-full flex items-start justify-between p-4 text-left">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">{step.icon}</span>
          <div>
            <p className="font-bold text-gray-900 text-sm">{t(step.labelKey)}</p>
            <p className="text-gray-400 text-xs mt-0.5">{t(step.subKey)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2 mt-0.5">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${c.badge}`}>{t(order.status)}</span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </button>

      <div className="h-1 bg-gray-100 mx-4 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${c.bar} transition-all duration-700`} style={{ width: `${progress}%` }}/>
      </div>

      <div className="flex items-center justify-between px-4 pt-2.5 pb-3">
        {STEPS.map((s, i) => {
          const done = i <= idx;
          const sc = colorMap[s.color];
          return (
            <div key={s.status} className="flex flex-col items-center gap-1">
              <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-300 ${
                done ? `${sc.bg} ${sc.text} ring-2 ring-offset-1 ring-current` : 'bg-gray-100 text-gray-300'
              }`}>
                {done ? '✓' : i + 1}
              </div>
            </div>
          );
        })}
      </div>

      {expanded && (
        <div className="border-t border-gray-50 px-4 pt-3 pb-4 space-y-1.5 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{t('itemsLabel')}</span>
            <span className="text-xs text-gray-400">{timeAgo(order.placedAt)} ago</span>
          </div>
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600"><span className="font-semibold text-gray-400 mr-1">×{item.qty}</span>{item.name}</span>
              <span className="text-gray-500 font-medium">{CURRENCY} {item.price * item.qty}</span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between font-bold text-sm">
            <span className="text-gray-700">{t('totalLabel')}</span>
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
    <div className="mb-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"/>
        <span className="font-semibold text-gray-900 text-sm">{t('liveStatus')}</span>
        <span className="text-gray-400 text-xs">{t('realTime')}</span>
      </div>
      <div className="space-y-3">
        {allVisible.map(order => <OrderCard key={order.id} order={order}/>)}
      </div>
    </div>
  );
}

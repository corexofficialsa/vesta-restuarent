import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';

const STEPS = [
  { status: 'Pending',  label: 'Order Received',     sub: 'Your order has been sent to the kitchen',  icon: '📋', color: 'purple' },
  { status: 'Cooking',  label: 'Being Prepared',      sub: 'Our chefs are cooking your food right now', icon: '👨‍🍳', color: 'blue'   },
  { status: 'Ready',    label: 'Ready to Serve',      sub: 'Your food is ready! Server is on the way', icon: '✅', color: 'green'  },
  { status: 'Served',   label: 'Enjoy your meal!',    sub: 'Thank you for dining with us at Vesta',    icon: '🎉', color: 'gray'   },
];

const stepIndex = (status) => STEPS.findIndex(s => s.status === status);

const colorMap = {
  purple: { ring: 'ring-purple-500', bg: 'bg-purple-100', text: 'text-purple-700', bar: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
  blue:   { ring: 'ring-blue-500',   bg: 'bg-blue-100',   text: 'text-blue-700',   bar: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700 border-blue-200'       },
  green:  { ring: 'ring-green-500',  bg: 'bg-green-100',  text: 'text-green-700',  bar: 'bg-green-500',  badge: 'bg-green-100 text-green-700 border-green-200'     },
  gray:   { ring: 'ring-gray-300',   bg: 'bg-gray-100',   text: 'text-gray-500',   bar: 'bg-gray-300',   badge: 'bg-gray-100 text-gray-500 border-gray-200'        },
};

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const idx = stepIndex(order.status);
  const step = STEPS[idx] || STEPS[0];
  const c = colorMap[step.color];
  const progress = ((idx) / (STEPS.length - 1)) * 100;

  return (
    <div className={`bg-white rounded-2xl border-2 overflow-hidden shadow-sm transition-all duration-300 ${
      order.status === 'Ready' ? 'border-green-300' :
      order.status === 'Cooking' ? 'border-blue-200' :
      order.status === 'Served' ? 'border-gray-100' : 'border-purple-200'
    }`}>
      {/* Header row */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{step.icon}</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{step.label}</p>
            <p className="text-gray-400 text-xs mt-0.5">{step.sub}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${c.badge}`}>
            {order.status}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 mx-4 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${c.bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-between px-4 pt-2 pb-3">
        {STEPS.map((s, i) => {
          const done = i <= idx;
          const sc = colorMap[s.color];
          return (
            <div key={s.status} className="flex flex-col items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                done ? `${sc.bg} ${sc.text} ring-2 ${sc.ring} ring-offset-1` : 'bg-gray-100 text-gray-300'
              }`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-[9px] font-medium ${done ? sc.text : 'text-gray-300'} hidden sm:block`}>
                {s.label.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Expanded items */}
      {expanded && (
        <div className="border-t border-gray-50 px-4 py-3 space-y-1.5 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Items</span>
            <span className="text-xs text-gray-400">{timeAgo(order.placedAt)}</span>
          </div>
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                <span className="font-medium text-gray-500 mr-1.5">×{item.qty}</span>
                {item.name}
              </span>
              <span className="text-gray-500">₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="pt-1.5 mt-1.5 border-t border-gray-100 flex justify-between font-semibold text-sm">
            <span className="text-gray-700">Total</span>
            <span className="text-purple-700">₹{order.items.reduce((s, i) => s + i.price * i.qty, 0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderStatusTracker() {
  const { activeTable, getActiveOrders, orders } = useRestaurant();
  const activeOrders = getActiveOrders(activeTable);
  // Also show recently served orders (last 2) so customer sees completion
  const recentServed = orders
    .filter(o => o.tableId === activeTable && o.status === 'Served')
    .slice(0, 1);

  const allVisible = [...activeOrders, ...recentServed];
  if (!allVisible.length) return null;

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        <h2 className="font-semibold text-gray-900 text-sm">Your Order Status</h2>
        <span className="text-xs text-gray-400">· updates live</span>
      </div>
      <div className="space-y-3">
        {allVisible.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

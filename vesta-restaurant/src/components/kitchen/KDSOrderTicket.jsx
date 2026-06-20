import { useRestaurant } from '../../context/RestaurantContext';

const statusConfig = {
  Pending: {
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
    action: 'Start Cooking',
    actionClass: 'bg-amber-500 hover:bg-amber-600 text-white',
    border: 'border-amber-200',
    icon: '⏳',
  },
  Cooking: {
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-400 animate-pulse',
    action: 'Mark Ready',
    actionClass: 'bg-blue-500 hover:bg-blue-600 text-white',
    border: 'border-blue-200',
    icon: '👨‍🍳',
  },
  Ready: {
    badge: 'bg-green-100 text-green-700 border-green-200',
    dot: 'bg-green-400',
    action: 'Mark Served',
    actionClass: 'bg-green-500 hover:bg-green-600 text-white',
    border: 'border-green-200',
    icon: '✅',
  },
};

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function KDSOrderTicket({ order }) {
  const { advanceOrderStatus } = useRestaurant();
  const config = statusConfig[order.status] || statusConfig.Pending;
  const total = order.items.reduce((s, i) => s + i.price * i.qty, 0);

  if (order.status === 'Served') return null;

  return (
    <div className={`
      bg-white rounded-2xl border-2 ${config.border} shadow-sm overflow-hidden
      animate-fade-in transition-all duration-300 flex flex-col
    `}>
      {/* Ticket header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <span className="font-bold text-gray-900 text-base">Table {order.tableId}</span>
          </div>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {order.status}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-mono">{order.id}</span>
          <span>{timeAgo(order.placedAt)}</span>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-3 flex-1 space-y-2">
        {order.items.map(item => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${order.status === 'Cooking' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}
              `}>
                {item.qty}
              </span>
              <span className="text-gray-800 text-sm">{item.name}</span>
            </div>
            <span className="text-gray-500 text-xs">SR{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">
            {order.items.reduce((s, i) => s + i.qty, 0)} item{order.items.reduce((s, i) => s + i.qty, 0) !== 1 ? 's' : ''}
          </span>
          <span className="font-bold text-gray-900 text-sm">SR{total}</span>
        </div>
        <button
          onClick={() => advanceOrderStatus(order.id)}
          className={`
            w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
            active:scale-95 ${config.actionClass}
          `}
        >
          {config.action} →
        </button>
      </div>
    </div>
  );
}

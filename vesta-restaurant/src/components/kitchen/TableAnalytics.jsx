import { useRestaurant } from '../../context/RestaurantContext';
import { TABLES } from '../../data/menuData';

const statusStyles = {
  'Active Order': {
    card: 'border-purple-300 bg-purple-50',
    dot: 'bg-purple-500 animate-pulse',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
  },
  'Cart Open': {
    card: 'border-amber-300 bg-amber-50',
    dot: 'bg-amber-400',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
  },
  Idle: {
    card: 'border-gray-200 bg-white',
    dot: 'bg-green-400',
    text: 'text-gray-400',
    badge: 'bg-gray-100 text-gray-400',
  },
};

const tableEmojis = ['🍽️', '🥘', '🫕', '🍛'];

export default function TableAnalytics() {
  const { getTableStatus, orders, cart } = useRestaurant();

  const stats = TABLES.map(id => {
    const status = getTableStatus(id);
    const activeOrders = orders.filter(o => o.tableId === id && o.status !== 'Served');
    const cartItems = (cart[id]?.items || []).reduce((s, i) => s + i.qty, 0);
    const totalSpend = orders
      .filter(o => o.tableId === id)
      .flatMap(o => o.items)
      .reduce((s, i) => s + i.price * i.qty, 0);
    return { id, status, activeOrders, cartItems, totalSpend };
  });

  const activeCount = stats.filter(s => s.status === 'Active Order').length;
  const totalOrdersToday = orders.length;

  return (
    <div>
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Tables', value: activeCount, icon: '🪑', color: 'text-purple-700' },
          { label: 'Orders Today', value: totalOrdersToday, icon: '📋', color: 'text-blue-700' },
          { label: 'Idle Tables', value: 4 - activeCount, icon: '✅', color: 'text-green-700' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400 text-xs mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((table, idx) => {
          const style = statusStyles[table.status] || statusStyles.Idle;
          return (
            <div
              key={table.id}
              className={`rounded-2xl border-2 p-4 transition-all duration-300 ${style.card}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{tableEmojis[idx]}</span>
                  <span className="font-bold text-gray-900">Table {table.id}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                  <span className={`text-xs font-semibold ${style.text}`}>{table.status}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Active Orders</span>
                  <span className="font-semibold text-gray-900">{table.activeOrders.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Cart Items</span>
                  <span className="font-semibold text-gray-900">{table.cartItems}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Total Spend</span>
                  <span className="font-semibold text-purple-700">₹{table.totalSpend}</span>
                </div>
              </div>

              {/* Status bar */}
              {table.activeOrders.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {table.activeOrders.map(o => (
                    <span
                      key={o.id}
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        o.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        o.status === 'Cooking' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      {o.status}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useRestaurant } from '../../context/RestaurantContext';
import KDSOrderTicket from './KDSOrderTicket';

const STATUSES = [
  { key: 'Pending', label: 'Pending', icon: '⏳', headerClass: 'bg-amber-50 border-amber-200 text-amber-700' },
  { key: 'Cooking', label: 'Cooking', icon: '👨‍🍳', headerClass: 'bg-blue-50 border-blue-200 text-blue-700' },
  { key: 'Ready', label: 'Ready to Serve', icon: '✅', headerClass: 'bg-green-50 border-green-200 text-green-700' },
];

export default function KDSBoard() {
  const { orders } = useRestaurant();
  const activeOrders = orders.filter(o => o.status !== 'Served');

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Live Kitchen Display</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {activeOrders.length === 0
              ? 'No active orders — kitchen is clear'
              : `${activeOrders.length} active order${activeOrders.length !== 1 ? 's' : ''} in flight`
            }
          </p>
        </div>
        {activeOrders.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-purple-700 text-xs font-semibold">Live</span>
          </div>
        )}
      </div>

      {/* 3-column status board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STATUSES.map(({ key, label, icon, headerClass }) => {
          const colOrders = orders.filter(o => o.status === key);
          return (
            <div key={key} className="flex flex-col min-h-48">
              {/* Column header */}
              <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${headerClass} mb-3`}>
                <div className="flex items-center gap-2">
                  <span className="text-base">{icon}</span>
                  <span className="font-semibold text-sm">{label}</span>
                </div>
                <span className="w-6 h-6 rounded-full bg-white/60 flex items-center justify-center text-xs font-bold">
                  {colOrders.length}
                </span>
              </div>

              {/* Tickets */}
              <div className="flex-1 space-y-3">
                {colOrders.length === 0 ? (
                  <div className="h-32 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-300 text-sm">No orders</p>
                  </div>
                ) : (
                  colOrders.map(order => (
                    <KDSOrderTicket key={order.id} order={order} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

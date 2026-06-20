import { useRestaurant } from '../../context/RestaurantContext';
import logo from '../../assets/logo.png';

export default function Header() {
  const { activeTable, view, isAuthenticated, logout } = useRestaurant();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Vesta" className="w-8 h-8 object-contain" />
          <div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">Vesta</span>
            <span className="ml-1 text-purple-600 font-bold text-lg tracking-tight">Cafe</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTable && view === 'customer' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-purple-700 text-sm font-semibold">Table {activeTable}</span>
            </div>
          )}
          {isAuthenticated && view === 'admin' && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-purple-700 text-white text-xs font-bold rounded-full">Kitchen</span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                Exit
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

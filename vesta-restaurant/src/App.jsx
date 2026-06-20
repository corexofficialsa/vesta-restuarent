import { useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import Header from './components/shared/Header';
import CustomerView from './components/customer/CustomerView';
import AdminDashboard from './pages/AdminDashboard';
import KitchenLoginPage from './pages/KitchenLoginPage';

function AppContent() {
  const { activeTable, selectTable, isAuthenticated } = useRestaurant();

  // Customer entry via QR scan — e.g. /?table=2
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      const id = parseInt(tableParam, 10);
      if ([1, 2, 3, 4].includes(id)) {
        selectTable(id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    // Customer scanned a table QR — show menu directly
    if (activeTable) return <CustomerView />;
    // Staff authenticated — show kitchen dashboard
    if (isAuthenticated) return <AdminDashboard />;
    // Default: kitchen login page
    return <KitchenLoginPage />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{renderContent()}</main>
    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}

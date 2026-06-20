import { useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Header from './components/shared/Header';
import CustomerView from './components/customer/CustomerView';
import LanguageSelector from './components/customer/LanguageSelector';
import AdminDashboard from './pages/AdminDashboard';
import KitchenLoginPage from './pages/KitchenLoginPage';

function AppContent() {
  const { activeTable, selectTable, isAuthenticated } = useRestaurant();
  const { lang } = useLanguage();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      const id = parseInt(tableParam, 10);
      if ([1, 2, 3, 4].includes(id)) selectTable(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    if (activeTable) {
      if (!lang) return <LanguageSelector tableId={activeTable} />;
      return <CustomerView />;
    }
    if (isAuthenticated) return <AdminDashboard />;
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
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </RestaurantProvider>
  );
}

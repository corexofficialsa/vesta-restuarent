import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Header from './components/shared/Header';
import CustomerView from './components/customer/CustomerView';
import LanguageSelector from './components/customer/LanguageSelector';
import AdminDashboard from './pages/AdminDashboard';
import KitchenLoginPage from './pages/KitchenLoginPage';

function AppContent() {
  const { activeTable, isAuthenticated } = useRestaurant();
  const { lang } = useLanguage();

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

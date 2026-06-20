import { useState } from 'react';
import KDSBoard from '../components/kitchen/KDSBoard';
import TableAnalytics from '../components/kitchen/TableAnalytics';
import AddMenuItemForm from '../components/admin/AddMenuItemForm';
import QRCodeDisplay from '../components/admin/QRCodeDisplay';

const TABS = [
  { id: 'kds',    label: 'Kitchen Display', icon: '👨‍🍳' },
  { id: 'tables', label: 'Table Status',    icon: '🪑' },
  { id: 'menu',   label: 'Add Menu Item',   icon: '➕' },
  { id: 'qr',     label: 'QR Codes',        icon: '🔳' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('kds');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <span className="text-purple-700 text-sm">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h1>
        </div>
        <p className="text-gray-400 text-sm">Vesta Restaurant · Kitchen & Operations</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6 w-fit flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-white text-purple-700 shadow-sm font-semibold'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <span className="text-base">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === 'kds'    && <KDSBoard />}
        {activeTab === 'tables' && <TableAnalytics />}
        {activeTab === 'menu'   && <AddMenuItemForm />}
        {activeTab === 'qr'     && <QRCodeDisplay />}
      </div>
    </div>
  );
}

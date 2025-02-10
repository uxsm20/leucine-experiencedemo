  import React from 'react';
import { Menu, Factory, Calendar, ClipboardList, BarChart, Play, FileCheck, TruckIcon, TrendingUp, FileArchive, MessageSquare, ScrollText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navigation = {
    'Supply Chain Manager': [
      { name: 'Supply Chain', href: '/', icon: BarChart },
      { name: 'Order Tracker', href: '/order-tracker', icon: TruckIcon },
      { name: 'Order Analytics', href: '/otif-analytics', icon: TrendingUp },
    ],
    'Production Manager': [
      { name: 'Production Planning', href: '/production', icon: Calendar },
      { name: 'Master Schedule', href: '/master-schedule', icon: Calendar },
      { name: 'Shop Floor Operations', href: '/shop-floor', icon: Factory },
      { name: 'Quality Control', href: '/quality', icon: ClipboardList },
      { name: 'Batch Data Summary', href: '/batch-data-summary/B001', icon: FileCheck },
    ],
    'Operator': [
      { name: 'Operator Dashboard', href: '/operator-dashboard', icon: Play },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center px-6">
          <Menu className="h-6 w-6 text-gray-600" />
          <span className="ml-3 text-lg font-semibold text-gray-900">MES System</span>
        </div>
        <nav className="mt-6 px-3 space-y-6">
          {Object.entries(navigation).map(([category, items]) => (
            <div key={category}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {category}
              </h3>
              <div className="mt-2 space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        flex items-center px-3 py-2 rounded-lg text-sm font-medium
                        ${location.pathname === item.href
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'}
                      `}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6 px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;

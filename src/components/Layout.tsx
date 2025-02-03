import React from 'react';
import { Menu, Factory, Calendar, ClipboardList, BarChart, Play, FileCheck, TruckIcon, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Supply Chain', href: '/', icon: BarChart },
    { name: 'Order Tracker', href: '/order-tracker', icon: TruckIcon },
    { name: 'OTIF Analytics', href: '/otif-analytics', icon: TrendingUp },
    { name: 'Production Planning', href: '/production', icon: Calendar },
    { name: 'Shop Floor', href: '/shop-floor', icon: Factory },
    { name: 'Quality Control', href: '/quality', icon: ClipboardList },
    { name: 'Master Schedule', href: '/master-schedule', icon: Calendar },
    { name: 'Operator Dashboard', href: '/operator-dashboard', icon: Play },
    { name: 'Batch Data Summary', href: '/batch-data-summary/B001', icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center px-6">
          <Menu className="h-6 w-6 text-gray-600" />
          <span className="ml-3 text-lg font-semibold text-gray-900">MES System</span>
        </div>
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-3 py-2 mt-2 rounded-lg text-sm font-medium
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
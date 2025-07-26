import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Users, BarChart3, History, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'activity', label: 'Activity Logs', icon: History },
  ];

  const memberNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'catalog', label: 'Book Catalog', icon: BookOpen },
    { id: 'my-books', label: 'My Books', icon: History },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : memberNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">LibraryOS</span>
          </div>

          {/* User Info */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-medium">{user?.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="min-h-screen p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
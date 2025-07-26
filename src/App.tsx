import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import BookCatalog from './pages/BookCatalog';
import MyBooks from './pages/MyBooks';
import ActivityLogs from './pages/ActivityLogs';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    if (user.role === 'admin') {
      switch (currentPage) {
        case 'dashboard':
        case 'books':
          return <AdminDashboard />;
        case 'activity':
          return <ActivityLogs />;
        default:
          return <AdminDashboard />;
      }
    } else {
      switch (currentPage) {
        case 'dashboard':
          return <MemberDashboard />;
        case 'catalog':
          return <BookCatalog />;
        case 'my-books':
          return <MyBooks />;
        default:
          return <MemberDashboard />;
      }
    }
  };

  return (
    <LibraryProvider>
      <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        {renderPage()}
      </Layout>
    </LibraryProvider>
  );
};

function App() {
  // Initialize demo data
  React.useEffect(() => {
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      const demoUsers = [
        {
          id: 'admin-1',
          email: 'admin@library.com',
          password: 'password',
          name: 'Admin User',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: 'member-1',
          email: 'member@library.com',
          password: 'password',
          name: 'John Doe',
          role: 'member',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('users', JSON.stringify(demoUsers));
    }
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import StatsCard from '../components/StatsCard';
import { BookOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const { books, transactions, getUserTransactions } = useLibrary();

  const userTransactions = getUserTransactions(user!.id);
  const activeBorrows = userTransactions.filter(t => t.status === 'borrowed');
  const completedBorrows = userTransactions.filter(t => t.status === 'returned');
  const overdueBooks = activeBorrows.filter(t => new Date(t.dueDate) < new Date());

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysUntilDue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2 font-medium">Here's your library activity overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Books Borrowed"
          value={activeBorrows.length}
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Books Returned"
          value={completedBorrows.length}
          icon={CheckCircle}
          color="emerald"
        />
        <StatsCard
          title="Overdue Books"
          value={overdueBooks.length}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Available Slots"
          value={3 - activeBorrows.length}
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Currently Borrowed Books */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50/50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Currently Borrowed Books</h2>
        </div>
        <div className="p-6">
          {activeBorrows.length > 0 ? (
            <div className="space-y-4">
              {activeBorrows.map(transaction => {
                const daysUntilDue = getDaysUntilDue(transaction.dueDate);
                const isOverdue = daysUntilDue < 0;
                
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-soft transition-all duration-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{getBookTitle(transaction.bookId)}</h3>
                      <p className="text-sm text-gray-600">
                        Borrowed: {formatDate(transaction.borrowDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold mb-1 ${
                        isOverdue ? 'text-red-600' : daysUntilDue <= 3 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {isOverdue 
                          ? `⚠ Overdue by ${Math.abs(daysUntilDue)} days`
                          : daysUntilDue === 0
                          ? '⏰ Due today'
                          : `✓ Due in ${daysUntilDue} days`
                        }
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Due: {formatDate(transaction.dueDate)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No active borrows</h3>
              <p className="text-gray-600">Visit the book catalog to borrow your first book!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50/50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          {userTransactions.length > 0 ? (
            <div className="space-y-3">
              {userTransactions
                .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime())
                .slice(0, 5)
                .map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-soft transition-all duration-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{getBookTitle(transaction.bookId)}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {transaction.status === 'borrowed' ? 'Borrowed' : 'Returned'} on {formatDate(transaction.borrowDate)}
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      transaction.status === 'borrowed' 
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {transaction.status === 'borrowed' ? 'Active' : 'Returned'}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No activity yet</h3>
              <p className="text-gray-600">Your borrowing history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
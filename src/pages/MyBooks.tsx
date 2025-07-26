import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { BookOpen, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

const MyBooks: React.FC = () => {
  const { user } = useAuth();
  const { books, transactions, getUserTransactions, returnBook } = useLibrary();

  const userTransactions = getUserTransactions(user!.id);
  const activeBorrows = userTransactions.filter(t => t.status === 'borrowed');
  const completedBorrows = userTransactions.filter(t => t.status === 'returned');

  const getBookDetails = (bookId: string) => {
    return books.find(b => b.id === bookId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleReturnBook = (transactionId: string) => {
    if (window.confirm('Are you sure you want to return this book?')) {
      returnBook(transactionId);
      alert('Book returned successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
        <p className="text-gray-600 mt-1">Manage your borrowed books and view history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Currently Borrowed</p>
              <p className="text-2xl font-bold text-gray-900">{activeBorrows.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Books Returned</p>
              <p className="text-2xl font-bold text-gray-900">{completedBorrows.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-amber-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Slots</p>
              <p className="text-2xl font-bold text-gray-900">{3 - activeBorrows.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Currently Borrowed Books */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Currently Borrowed
          </h2>
        </div>
        <div className="p-6">
          {activeBorrows.length > 0 ? (
            <div className="space-y-4">
              {activeBorrows.map(transaction => {
                const book = getBookDetails(transaction.bookId);
                const daysUntilDue = getDaysUntilDue(transaction.dueDate);
                const isOverdue = daysUntilDue < 0;
                
                if (!book) return null;
                
                return (
                  <div key={transaction.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                        <p className="text-gray-600 mb-2">by {book.author}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Borrowed: {formatDate(transaction.borrowDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Due: {formatDate(transaction.dueDate)}</span>
                          </div>
                        </div>
                        
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          isOverdue 
                            ? 'bg-red-100 text-red-800'
                            : daysUntilDue <= 3 
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isOverdue ? (
                            <>
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Overdue by {Math.abs(daysUntilDue)} days
                            </>
                          ) : daysUntilDue === 0 ? (
                            <>
                              <Clock className="h-4 w-4 mr-1" />
                              Due today
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Due in {daysUntilDue} days
                            </>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleReturnBook(transaction.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active borrows</h3>
              <p className="text-gray-600">Visit the book catalog to borrow your first book!</p>
            </div>
          )}
        </div>
      </div>

      {/* Borrowing History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Borrowing History
          </h2>
        </div>
        <div className="p-6">
          {userTransactions.length > 0 ? (
            <div className="space-y-4">
              {userTransactions
                .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime())
                .map(transaction => {
                  const book = getBookDetails(transaction.bookId);
                  if (!book) return null;
                  
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>Borrowed: {formatDate(transaction.borrowDate)}</span>
                          {transaction.returnDate && (
                            <span>Returned: {formatDate(transaction.returnDate)}</span>
                          )}
                          {transaction.penalty && (
                            <span className="text-red-600">Penalty: ${transaction.penalty}</span>
                          )}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'borrowed' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {transaction.status === 'borrowed' ? 'Active' : 'Returned'}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No borrowing history</h3>
              <p className="text-gray-600">Your borrowing history will appear here once you start borrowing books</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
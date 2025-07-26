import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { History, BookOpen, Plus, Edit, Trash2, User, Filter } from 'lucide-react';

const ActivityLogs: React.FC = () => {
  const { activityLogs, books } = useLibrary();
  const [filterAction, setFilterAction] = useState('');
  const [filterUser, setFilterUser] = useState('');

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  const getUserName = (userId: string) => {
    const user = users.find((u: any) => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'add_book':
        return <Plus className="h-4 w-4" />;
      case 'edit_book':
        return <Edit className="h-4 w-4" />;
      case 'delete_book':
        return <Trash2 className="h-4 w-4" />;
      case 'borrow':
        return <BookOpen className="h-4 w-4" />;
      case 'return':
        return <History className="h-4 w-4" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'add_book':
        return 'text-emerald-600 bg-emerald-100';
      case 'edit_book':
        return 'text-blue-600 bg-blue-100';
      case 'delete_book':
        return 'text-red-600 bg-red-100';
      case 'borrow':
        return 'text-amber-600 bg-amber-100';
      case 'return':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'add_book':
        return 'Book Added';
      case 'edit_book':
        return 'Book Updated';
      case 'delete_book':
        return 'Book Deleted';
      case 'borrow':
        return 'Book Borrowed';
      case 'return':
        return 'Book Returned';
      default:
        return action;
    }
  };

  const filteredLogs = activityLogs.filter(log => {
    if (filterAction && log.action !== filterAction) return false;
    if (filterUser && log.userId !== filterUser) return false;
    return true;
  });

  const sortedLogs = filteredLogs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-600 mt-1">Monitor all library activities and user interactions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Action</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Actions</option>
              <option value="add_book">Book Added</option>
              <option value="edit_book">Book Updated</option>
              <option value="delete_book">Book Deleted</option>
              <option value="borrow">Book Borrowed</option>
              <option value="return">Book Returned</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by User</label>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
              ))}
            </select>
          </div>
          
          {(filterAction || filterUser) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterAction('');
                  setFilterUser('');
                }}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <History className="h-5 w-5 mr-2" />
            Activity Timeline
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({sortedLogs.length} activities)
            </span>
          </h2>
        </div>
        
        <div className="p-6">
          {sortedLogs.length > 0 ? (
            <div className="space-y-4">
              {sortedLogs.map((log, index) => (
                <div key={log.id} className="relative">
                  {index < sortedLogs.length - 1 && (
                    <div className="absolute left-6 top-12 w-px h-full bg-gray-200"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-2 rounded-full ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {getActionLabel(log.action)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(log.timestamp)}
                        </p>
                      </div>
                      
                      <div className="mt-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-3 w-3" />
                          <span>{getUserName(log.userId)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-3 w-3" />
                          <span>{getBookTitle(log.bookId)}</span>
                        </div>
                        
                        {log.details && (
                          <p className="mt-1 text-xs text-gray-500 italic">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">
                {filterAction || filterUser 
                  ? 'Try adjusting your filter criteria'
                  : 'Activity logs will appear here as users interact with the system'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
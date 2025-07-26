import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import StatsCard from '../components/StatsCard';
import BookModal from '../components/BookModal';
import BookCard from '../components/BookCard';
import { Plus, BookOpen, Users, TrendingUp, AlertTriangle, Search, Filter } from 'lucide-react';
import { Book } from '../types';

const AdminDashboard: React.FC = () => {
  const { books, stats, addBook, updateBook, deleteBook, searchBooks, filterBooks } = useLibrary();
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');

  const handleAddBook = (bookData: Omit<Book, 'id' | 'qrCode' | 'createdAt' | 'updatedAt'>) => {
    addBook(bookData);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowBookModal(true);
  };

  const handleUpdateBook = (bookData: Omit<Book, 'id' | 'qrCode' | 'createdAt' | 'updatedAt'>) => {
    if (editingBook) {
      updateBook(editingBook.id, bookData);
      setEditingBook(undefined);
    }
  };

  const handleDeleteBook = (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(bookId);
    }
  };

  const closeModal = () => {
    setShowBookModal(false);
    setEditingBook(undefined);
  };

  // Get filtered books
  const getFilteredBooks = () => {
    let filteredBooks = books;
    
    if (searchQuery) {
      filteredBooks = searchBooks(searchQuery);
    }
    
    if (filterCategory || filterType) {
      filteredBooks = filterBooks(
        filterCategory || undefined,
        filterType || undefined
      );
    }
    
    if (searchQuery && (filterCategory || filterType)) {
      // Apply both search and filter
      const searchResults = searchBooks(searchQuery);
      const filterResults = filterBooks(
        filterCategory || undefined,
        filterType || undefined
      );
      filteredBooks = searchResults.filter(book => 
        filterResults.some(fb => fb.id === book.id)
      );
    }
    
    return filteredBooks;
  };

  const categories = [...new Set(books.map(book => book.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your library inventory and monitor activity</p>
        </div>
        <button
          onClick={() => setShowBookModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Book
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Books"
          value={stats.totalBooks}
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Active Borrows"
          value={stats.activeBorrows}
          icon={TrendingUp}
          color="emerald"
        />
        <StatsCard
          title="Total Members"
          value={stats.totalMembers}
          icon={Users}
          color="amber"
        />
        <StatsCard
          title="Overdue Books"
          value={stats.overdueBooks}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, ISBN, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="physical">Physical</option>
              <option value="ebook">E-book</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredBooks().map(book => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            isAdmin={true}
          />
        ))}
      </div>

      {getFilteredBooks().length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600">
            {searchQuery || filterCategory || filterType 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first book to the library'
            }
          </p>
        </div>
      )}

      {/* Book Modal */}
      <BookModal
        isOpen={showBookModal}
        onClose={closeModal}
        onSave={editingBook ? handleUpdateBook : handleAddBook}
        book={editingBook}
        title={editingBook ? 'Edit Book' : 'Add New Book'}
      />
    </div>
  );
};

export default AdminDashboard;
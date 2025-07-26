import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { Search, Filter, BookOpen } from 'lucide-react';

const BookCatalog: React.FC = () => {
  const { books, borrowBook, searchBooks, filterBooks, getUserTransactions } = useLibrary();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterAvailable, setFilterAvailable] = useState('');

  const handleBorrowBook = (bookId: string) => {
    const success = borrowBook(bookId);
    
    if (success) {
      alert('Book borrowed successfully!');
    } else {
      const book = books.find(b => b.id === bookId);
      const userTransactions = getUserTransactions(user!.id);
      const activeBorrows = userTransactions.filter(t => t.status === 'borrowed').length;
      
      if (book?.availableStock === 0) {
        alert('This book is currently out of stock.');
      } else if (book?.type === 'physical' && activeBorrows >= 3) {
        alert('You have reached the maximum limit of 3 borrowed books.');
      } else {
        alert('Unable to borrow book. Please try again.');
      }
    }
  };

  // Get filtered books
  const getFilteredBooks = () => {
    let filteredBooks = books;
    
    if (searchQuery) {
      filteredBooks = searchBooks(searchQuery);
    }
    
    if (filterCategory || filterType || filterAvailable) {
      const availableFilter = filterAvailable === 'available' ? true : 
                            filterAvailable === 'unavailable' ? false : undefined;
      
      filteredBooks = filterBooks(
        filterCategory || undefined,
        filterType || undefined,
        availableFilter
      );
    }
    
    if (searchQuery && (filterCategory || filterType || filterAvailable)) {
      // Apply both search and filter
      const searchResults = searchBooks(searchQuery);
      const availableFilter = filterAvailable === 'available' ? true : 
                            filterAvailable === 'unavailable' ? false : undefined;
      const filterResults = filterBooks(
        filterCategory || undefined,
        filterType || undefined,
        availableFilter
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Book Catalog</h1>
        <p className="text-gray-600 mt-1">Discover and borrow books from our digital library</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
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
          <div className="flex flex-col sm:flex-row gap-3">
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
            <select
              value={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Books</option>
              <option value="available">Available</option>
              <option value="unavailable">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {getFilteredBooks().length} of {books.length} books
        </p>
        {(searchQuery || filterCategory || filterType || filterAvailable) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('');
              setFilterType('');
              setFilterAvailable('');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredBooks().map(book => (
          <BookCard
            key={book.id}
            book={book}
            onBorrow={handleBorrowBook}
            isAdmin={false}
          />
        ))}
      </div>

      {getFilteredBooks().length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600">
            {searchQuery || filterCategory || filterType || filterAvailable
              ? 'Try adjusting your search or filter criteria'
              : 'No books available in the catalog'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BookCatalog;
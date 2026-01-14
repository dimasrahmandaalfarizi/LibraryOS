import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { Search, BookOpen } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Book Catalog</h1>
        <p className="text-gray-600 mt-2 font-medium">Discover and borrow books from our digital library</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, ISBN, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base w-full pl-12"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-base min-w-[160px]"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-base min-w-[140px]"
            >
              <option value="">All Types</option>
              <option value="physical">Physical</option>
              <option value="ebook">E-book</option>
            </select>
            <select
              value={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.value)}
              className="input-base min-w-[140px]"
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
        <p className="text-gray-700 font-medium">
          Showing <span className="font-bold text-gray-900">{getFilteredBooks().length}</span> of <span className="font-bold text-gray-900">{books.length}</span> books
        </p>
        {(searchQuery || filterCategory || filterType || filterAvailable) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('');
              setFilterType('');
              setFilterAvailable('');
            }}
            className="text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors"
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
        <div className="text-center py-16 bg-white rounded-xl shadow-soft border border-gray-100">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
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
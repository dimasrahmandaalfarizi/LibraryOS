import React from 'react';
import { Book } from '../types';
import { BookOpen, Download, MapPin, Calendar, Hash } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: string) => void;
  showActions?: boolean;
  isAdmin?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onBorrow, 
  onEdit, 
  onDelete, 
  showActions = true,
  isAdmin = false 
}) => {
  const isAvailable = book.availableStock > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
          <p className="text-gray-600">{book.author}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          book.type === 'physical' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-emerald-100 text-emerald-800'
        }`}>
          {book.type === 'physical' ? 'Physical' : 'E-book'}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Hash className="h-4 w-4 mr-2" />
          <span>ISBN: {book.isbn}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Published: {book.publishYear}</span>
        </div>
        {book.location && (
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>Location: {book.location}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-900">Category: {book.category}</span>
        <div className="text-right">
          <div className={`text-sm font-medium ${isAvailable ? 'text-emerald-600' : 'text-red-600'}`}>
            {isAvailable ? 'Available' : 'Out of Stock'}
          </div>
          <div className="text-xs text-gray-500">
            {book.availableStock}/{book.stock} copies
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2">
          {isAdmin ? (
            <>
              <button
                onClick={() => onEdit?.(book)}
                className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(book.id)}
                className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              {book.type === 'ebook' ? (
                <button
                  onClick={() => window.open(book.fileUrl, '_blank')}
                  className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              ) : (
                <button
                  onClick={() => onBorrow?.(book.id)}
                  disabled={!isAvailable}
                  className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isAvailable
                      ? 'text-white bg-blue-600 hover:bg-blue-700'
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  }`}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {isAvailable ? 'Borrow' : 'Unavailable'}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BookCard;
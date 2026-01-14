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
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 hover:shadow-soft-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-2">{book.title}</h3>
          <p className="text-gray-600 font-medium">{book.author}</p>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
          book.type === 'physical' 
            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200' 
            : 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200'
        }`}>
          {book.type === 'physical' ? 'Physical' : 'E-book'}
        </div>
      </div>

      <div className="space-y-2.5 mb-5">
        <div className="flex items-center text-sm text-gray-600">
          <Hash className="h-4 w-4 mr-2 text-gray-400" />
          <span className="font-medium">ISBN:</span>
          <span className="ml-1">{book.isbn}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          <span className="font-medium">Published:</span>
          <span className="ml-1">{book.publishYear}</span>
        </div>
        {book.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">Location:</span>
            <span className="ml-1">{book.location}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
        <div>
          <span className="text-sm font-semibold text-gray-700">Category</span>
          <p className="text-sm text-gray-600 mt-0.5">{book.category}</p>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold mb-1 ${
            isAvailable ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {isAvailable ? '● Available' : '● Out of Stock'}
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {book.availableStock}/{book.stock} copies
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2.5">
          {isAdmin ? (
            <>
              <button
                onClick={() => onEdit?.(book)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-primary-700 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg hover:from-primary-100 hover:to-primary-200 border border-primary-200 transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(book.id)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-red-700 bg-gradient-to-r from-red-50 to-red-100 rounded-lg hover:from-red-100 hover:to-red-200 border border-red-200 transition-all duration-200"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              {book.type === 'ebook' ? (
                <button
                  onClick={() => window.open(book.fileUrl, '_blank')}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg hover:from-emerald-700 hover:to-emerald-800 shadow-soft hover:shadow-soft-md transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              ) : (
                <button
                  onClick={() => onBorrow?.(book.id)}
                  disabled={!isAvailable}
                  className={`flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isAvailable
                      ? 'text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-soft hover:shadow-soft-md'
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
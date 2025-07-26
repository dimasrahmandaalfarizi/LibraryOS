import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Book } from '../types';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Omit<Book, 'id' | 'qrCode' | 'createdAt' | 'updatedAt'>) => void;
  book?: Book;
  title: string;
}

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSave, book, title }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publishYear: new Date().getFullYear(),
    type: 'physical' as 'physical' | 'ebook',
    category: '',
    location: '',
    fileUrl: '',
    stock: 1,
    availableStock: 1
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishYear: book.publishYear,
        type: book.type,
        category: book.category,
        location: book.location || '',
        fileUrl: book.fileUrl || '',
        stock: book.stock,
        availableStock: book.availableStock
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        publishYear: new Date().getFullYear(),
        type: 'physical',
        category: '',
        location: '',
        fileUrl: '',
        stock: 1,
        availableStock: 1
      });
    }
  }, [book, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
            <input
              type="text"
              required
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publish Year</label>
              <input
                type="number"
                required
                min="1000"
                max={new Date().getFullYear()}
                value={formData.publishYear}
                onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'physical' | 'ebook' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="physical">Physical</option>
                <option value="ebook">E-book</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {formData.type === 'physical' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., A1-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="https://example.com/book.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {formData.type === 'physical' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.stock}
                  onChange={(e) => {
                    const stock = parseInt(e.target.value);
                    setFormData({ 
                      ...formData, 
                      stock,
                      availableStock: Math.min(formData.availableStock, stock)
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Stock</label>
                <input
                  type="number"
                  required
                  min="0"
                  max={formData.stock}
                  value={formData.availableStock}
                  onChange={(e) => setFormData({ ...formData, availableStock: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
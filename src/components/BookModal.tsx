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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-soft-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-base w-full"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="input-base w-full"
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">ISBN</label>
            <input
              type="text"
              required
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              className="input-base w-full"
              placeholder="Enter ISBN number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Publish Year</label>
              <input
                type="number"
                required
                min="1000"
                max={new Date().getFullYear()}
                value={formData.publishYear}
                onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) })}
                className="input-base w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'physical' | 'ebook' })}
                className="input-base w-full"
              >
                <option value="physical">Physical</option>
                <option value="ebook">E-book</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-base w-full"
              placeholder="e.g., Fiction, Science, History"
            />
          </div>

          {formData.type === 'physical' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., A1-001"
                className="input-base w-full"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">File URL</label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="https://example.com/book.pdf"
                className="input-base w-full"
              />
            </div>
          )}

          {formData.type === 'physical' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Stock</label>
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
                  className="input-base w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Available Stock</label>
                <input
                  type="number"
                  required
                  min="0"
                  max={formData.stock}
                  value={formData.availableStock}
                  onChange={(e) => setFormData({ ...formData, availableStock: parseInt(e.target.value) })}
                  className="input-base w-full"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-soft hover:shadow-soft-md transition-all duration-200"
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
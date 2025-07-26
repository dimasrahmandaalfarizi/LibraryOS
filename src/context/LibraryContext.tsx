import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, BorrowTransaction, ActivityLog, DashboardStats } from '../types';
import { useAuth } from './AuthContext';

interface LibraryContextType {
  books: Book[];
  transactions: BorrowTransaction[];
  activityLogs: ActivityLog[];
  stats: DashboardStats;
  addBook: (book: Omit<Book, 'id' | 'qrCode' | 'createdAt' | 'updatedAt'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  borrowBook: (bookId: string) => boolean;
  returnBook: (transactionId: string) => void;
  getUserTransactions: (userId: string) => BorrowTransaction[];
  getBookTransactions: (bookId: string) => BorrowTransaction[];
  searchBooks: (query: string) => Book[];
  filterBooks: (category?: string, type?: string, available?: boolean) => Book[];
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

interface LibraryProviderProps {
  children: ReactNode;
}

const initialBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    publishYear: 1925,
    type: 'physical',
    category: 'Fiction',
    location: 'A1-001',
    stock: 5,
    availableStock: 3,
    qrCode: 'QR_1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    publishYear: 1960,
    type: 'physical',
    category: 'Fiction',
    location: 'A1-002',
    stock: 3,
    availableStock: 1,
    qrCode: 'QR_2',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    title: 'React: The Complete Guide',
    author: 'Maximilian Schwarzmüller',
    isbn: '978-1-234-56789-0',
    publishYear: 2023,
    type: 'ebook',
    category: 'Technology',
    fileUrl: '/files/react-guide.pdf',
    stock: 999,
    availableStock: 999,
    qrCode: 'QR_3',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
];

export const LibraryProvider: React.FC<LibraryProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [transactions, setTransactions] = useState<BorrowTransaction[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    activeBorrows: 0,
    totalMembers: 0,
    overdueBooks: 0,
    availableBooks: 0,
    outOfStock: 0
  });

  useEffect(() => {
    // Load data from localStorage
    const storedBooks = localStorage.getItem('books');
    const storedTransactions = localStorage.getItem('transactions');
    const storedLogs = localStorage.getItem('activityLogs');

    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      setBooks(initialBooks);
      localStorage.setItem('books', JSON.stringify(initialBooks));
    }

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }

    if (storedLogs) {
      setActivityLogs(JSON.parse(storedLogs));
    }
  }, []);

  useEffect(() => {
    // Update stats whenever books or transactions change
    const totalBooks = books.length;
    const activeBorrows = transactions.filter(t => t.status === 'borrowed').length;
    const overdueBooks = transactions.filter(t => {
      if (t.status !== 'borrowed') return false;
      return new Date(t.dueDate) < new Date();
    }).length;
    const availableBooks = books.reduce((sum, book) => sum + book.availableStock, 0);
    const outOfStock = books.filter(book => book.availableStock === 0).length;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const totalMembers = users.filter((u: any) => u.role === 'member').length;

    setStats({
      totalBooks,
      activeBorrows,
      totalMembers,
      overdueBooks,
      availableBooks,
      outOfStock
    });
  }, [books, transactions]);

  const generateQRCode = (bookId: string) => `QR_${bookId}_${Date.now()}`;

  const addActivityLog = (action: ActivityLog['action'], bookId: string, details?: string) => {
    if (!user) return;
    
    const log: ActivityLog = {
      id: Date.now().toString(),
      userId: user.id,
      bookId,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    
    const newLogs = [...activityLogs, log];
    setActivityLogs(newLogs);
    localStorage.setItem('activityLogs', JSON.stringify(newLogs));
  };

  const addBook = (bookData: Omit<Book, 'id' | 'qrCode' | 'createdAt' | 'updatedAt'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      qrCode: generateQRCode(Date.now().toString()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const newBooks = [...books, newBook];
    setBooks(newBooks);
    localStorage.setItem('books', JSON.stringify(newBooks));
    addActivityLog('add_book', newBook.id, `Added book: ${newBook.title}`);
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    const newBooks = books.map(book => 
      book.id === id 
        ? { ...book, ...bookData, updatedAt: new Date().toISOString() }
        : book
    );
    setBooks(newBooks);
    localStorage.setItem('books', JSON.stringify(newBooks));
    addActivityLog('edit_book', id, `Updated book`);
  };

  const deleteBook = (id: string) => {
    const book = books.find(b => b.id === id);
    const newBooks = books.filter(book => book.id !== id);
    setBooks(newBooks);
    localStorage.setItem('books', JSON.stringify(newBooks));
    addActivityLog('delete_book', id, `Deleted book: ${book?.title}`);
  };

  const borrowBook = (bookId: string): boolean => {
    if (!user) return false;
    
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableStock <= 0) return false;
    
    // Check if user already has 3 active borrows (for physical books)
    const userActiveBorrows = transactions.filter(t => 
      t.userId === user.id && t.status === 'borrowed'
    ).length;
    
    if (book.type === 'physical' && userActiveBorrows >= 3) return false;
    
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks loan period
    
    const transaction: BorrowTransaction = {
      id: Date.now().toString(),
      userId: user.id,
      bookId,
      borrowDate: borrowDate.toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'borrowed'
    };
    
    const newTransactions = [...transactions, transaction];
    setTransactions(newTransactions);
    localStorage.setItem('transactions', JSON.stringify(newTransactions));
    
    // Update book stock
    const newBooks = books.map(b => 
      b.id === bookId 
        ? { ...b, availableStock: b.availableStock - 1 }
        : b
    );
    setBooks(newBooks);
    localStorage.setItem('books', JSON.stringify(newBooks));
    
    addActivityLog('borrow', bookId, `Borrowed: ${book.title}`);
    return true;
  };

  const returnBook = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    const returnDate = new Date();
    const dueDate = new Date(transaction.dueDate);
    const isOverdue = returnDate > dueDate;
    
    const newTransactions = transactions.map(t => 
      t.id === transactionId 
        ? { 
            ...t, 
            returnDate: returnDate.toISOString(),
            status: 'returned' as const,
            penalty: isOverdue ? Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) * 1000 : undefined
          }
        : t
    );
    setTransactions(newTransactions);
    localStorage.setItem('transactions', JSON.stringify(newTransactions));
    
    // Update book stock
    const book = books.find(b => b.id === transaction.bookId);
    if (book && book.type === 'physical') {
      const newBooks = books.map(b => 
        b.id === transaction.bookId 
          ? { ...b, availableStock: b.availableStock + 1 }
          : b
      );
      setBooks(newBooks);
      localStorage.setItem('books', JSON.stringify(newBooks));
    }
    
    addActivityLog('return', transaction.bookId, `Returned: ${book?.title}`);
  };

  const getUserTransactions = (userId: string) => {
    return transactions.filter(t => t.userId === userId);
  };

  const getBookTransactions = (bookId: string) => {
    return transactions.filter(t => t.bookId === bookId);
  };

  const searchBooks = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.isbn.includes(query) ||
      book.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const filterBooks = (category?: string, type?: string, available?: boolean) => {
    return books.filter(book => {
      if (category && book.category !== category) return false;
      if (type && book.type !== type) return false;
      if (available !== undefined && (book.availableStock > 0) !== available) return false;
      return true;
    });
  };

  return (
    <LibraryContext.Provider value={{
      books,
      transactions,
      activityLogs,
      stats,
      addBook,
      updateBook,
      deleteBook,
      borrowBook,
      returnBook,
      getUserTransactions,
      getBookTransactions,
      searchBooks,
      filterBooks
    }}>
      {children}
    </LibraryContext.Provider>
  );
};
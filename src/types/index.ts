export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  type: 'physical' | 'ebook';
  category: string;
  location?: string; // For physical books
  fileUrl?: string; // For ebooks
  stock: number;
  availableStock: number;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowTransaction {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  penalty?: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  bookId: string;
  action: 'borrow' | 'return' | 'add_book' | 'edit_book' | 'delete_book';
  timestamp: string;
  details?: string;
}

export interface DashboardStats {
  totalBooks: number;
  activeBorrows: number;
  totalMembers: number;
  overdueBooks: number;
  availableBooks: number;
  outOfStock: number;
}
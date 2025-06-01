
export interface Book {
  _id: string;
  title: string;
  author: {
    _id: string;
    name: string;
  };
  price: number;
  image: string;
  imageDetails: {
    publicId: string;
    width: number;
    height: number;
    format: string;
  };
  quantity: number;
  category: {
    _id: string;
    name: string;
  };
  subcategory: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItem {
  book_id: string;
  quantity: number;
}

export interface Order {
  _id: string;
  user_name: string;
  items: string[];
  total: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetails {
  order: Order;
  items: {
    _id: string;
    order: string;
    book: Book;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface BookFilters {
  category?: string;
  subcategory?: string;
  author?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  isNew?: boolean;
}

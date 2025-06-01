
import { Book, Author, Category, Subcategory, ApiResponse, BookFilters, OrderItem, OrderDetails } from '@/types/api';

const API_BASE_URL = 'https://lib-dashboard-lovat.vercel.app/api';

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('فشل في الاتصال بالخادم');
    }
  }

  // Books API
  async getBooks(filters?: BookFilters): Promise<Book[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/books${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.fetchApi<Book[]>(endpoint);
    
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'فشل في جلب الكتب');
  }

  async getBook(id: string): Promise<Book> {
    const response = await this.fetchApi<Book>(`/books/${id}`);
    
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'فشل في جلب تفاصيل الكتاب');
  }

  // Authors API
  async getAuthors(): Promise<Author[]> {
    const response = await this.fetchApi<Author[]>('/authors');
    
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'فشل في جلب المؤلفين');
  }

  async getAuthor(id: string): Promise<Author> {
    const response = await this.fetchApi<Author>(`/authors/${id}`);
    
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'فشل في جلب تفاصيل المؤلف');
  }

  async getAuthorBooks(id: string): Promise<Book[]> {
    const response = await this.fetchApi<Book[]>(`/authors/${id}/books`);
    
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'فشل في جلب كتب المؤلف');
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    const response = await this.fetchApi<Category[]>('/categories');
    
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'فشل في جلب الفئات');
  }

  async getCategory(id: string): Promise<Category> {
    const response = await this.fetchApi<Category>(`/categories/${id}`);
    
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'فشل في جلب تفاصيل الفئة');
  }

  async getSubcategories(categoryId: string): Promise<Subcategory[]> {
    const response = await this.fetchApi<Subcategory[]>(`/categories/${categoryId}/subcategories`);
    
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'فشل في جلب التصنيفات الفرعية');
  }

  async getSubcategory(categoryId: string, subcategoryId: string): Promise<Subcategory> {
    const response = await this.fetchApi<Subcategory>(`/categories/${categoryId}/subcategories/${subcategoryId}`);
    
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'فشل في جلب تفاصيل التصنيف الفرعي');
  }

  // Orders API
  async createOrder(userName: string, items: OrderItem[]): Promise<{ order_id: string }> {
    const response = await this.fetchApi<{ order_id: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        user_name: userName,
        items: items,
      }),
    });
    
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'فشل في إنشاء الطلب');
  }

  async getOrder(id: string): Promise<OrderDetails> {
    const response = await this.fetchApi<OrderDetails>(`/orders/${id}`);
    
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'فشل في جلب تفاصيل الطلب');
  }
}

export const apiService = new ApiService();

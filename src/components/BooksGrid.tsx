
import React from 'react';
import { Book } from '@/types/api';
import BookCard from './BookCard';
import { BookOpen } from 'lucide-react';

interface BooksGridProps {
  books: Book[];
  loading?: boolean;
  title?: string;
  onBookSelect: (book: Book) => void;
}

const BooksGrid: React.FC<BooksGridProps> = ({ 
  books, 
  loading = false, 
  title,
  onBookSelect 
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          لا توجد كتب متاحة
        </h3>
        <p className="text-gray-500">
          جرب تغيير البحث أو المرشحات للعثور على كتب أخرى
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-500">
            {books.length} كتاب
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((book) => (
          <div key={book._id} className="animate-fade-in">
            <BookCard book={book} onViewDetails={onBookSelect} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksGrid;

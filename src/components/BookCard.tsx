
import React from 'react';
import { Book } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface BookCardProps {
  book: Book;
  onViewDetails: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onViewDetails }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book);
  };

  const isOutOfStock = book.quantity === 0;

  return (
    <div className="book-card group cursor-pointer" onClick={() => onViewDetails(book)}>
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Stock Badge */}
        {isOutOfStock && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm"
          >
            نفذت الكمية
          </Badge>
        )}
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2 space-x-reverse">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(book);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {!isOutOfStock && (
              <Button
                size="sm"
                className="bg-library-600 hover:bg-library-700"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
          {book.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">
          بقلم: {book.author.name}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-xs">
            {book.category.name}
          </Badge>
          <div className="flex items-center text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-xs text-gray-600 mr-1">4.5</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-library-600">
              {book.price.toFixed(2)} ر.س
            </span>
            <span className="text-xs text-gray-500">
              متوفر: {book.quantity}
            </span>
          </div>
          
          {!isOutOfStock && (
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-library-600 hover:bg-library-700 text-white px-4"
            >
              إضافة للسلة
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;

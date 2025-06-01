
import React from 'react';
import { Book } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, Star, Package, Calendar, User, Tag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface BookDetailsProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, open, onOpenChange }) => {
  const { addToCart } = useCart();

  if (!book) return null;

  const handleAddToCart = () => {
    addToCart(book);
  };

  const isOutOfStock = book.quantity === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">
            تفاصيل الكتاب
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Book Image */}
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            {isOutOfStock && (
              <Badge 
                variant="destructive" 
                className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm"
              >
                نفذت الكمية
              </Badge>
            )}
          </div>

          {/* Book Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <div className="flex items-center text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                <span className="text-gray-600 mr-2">(4.5) تقييم</span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">المؤلف</p>
                <p className="font-semibold">{book.author.name}</p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <Tag className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">الفئة</p>
                <div className="flex space-x-2 space-x-reverse">
                  <Badge variant="outline">{book.category.name}</Badge>
                  <Badge variant="outline">{book.subcategory.name}</Badge>
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <Package className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">المخزون</p>
                <p className="font-semibold text-green-600">
                  {book.quantity} نسخة متاحة
                </p>
              </div>
            </div>

            {/* Date Added */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">تاريخ الإضافة</p>
                <p className="font-semibold">
                  {new Date(book.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500">السعر</p>
                  <p className="text-3xl font-bold text-library-600">
                    {book.price.toFixed(2)} ر.س
                  </p>
                </div>
              </div>

              {!isOutOfStock ? (
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-library-600 hover:bg-library-700 text-white py-3 text-lg"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 ml-2" />
                  إضافة إلى السلة
                </Button>
              ) : (
                <Button
                  disabled
                  className="w-full py-3 text-lg"
                  size="lg"
                  variant="secondary"
                >
                  نفدت الكمية
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetails;

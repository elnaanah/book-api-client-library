
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [userName, setUserName] = useState('');

  const handleCheckout = async () => {
    if (!userName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسمك أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    
    try {
      const orderItems = cart.map(item => ({
        book_id: item.book._id,
        quantity: item.quantity,
      }));

      const result = await apiService.createOrder(userName, orderItems);
      
      toast({
        title: "تم إنشاء الطلب بنجاح!",
        description: `رقم الطلب: ${result.order_id}`,
      });

      clearCart();
      setShowCheckoutForm(false);
      setUserName('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "خطأ في إنشاء الطلب",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <ShoppingBag className="h-5 w-5 ml-2" />
              سلة التسوق
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-semibold text-gray-600 mb-2">
              سلة التسوق فارغة
            </p>
            <p className="text-gray-500 mb-6">
              أضف بعض الكتب الرائعة إلى سلتك!
            </p>
            <Button onClick={() => onOpenChange(false)} className="bg-library-600 hover:bg-library-700">
              تصفح الكتب
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 ml-2" />
              سلة التسوق
            </div>
            <Badge variant="secondary" className="bg-library-100 text-library-800">
              {cart.length} عنصر
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {!showCheckoutForm ? (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.map((item) => (
                <div key={item.book._id} className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.book.image}
                    alt={item.book.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                      {item.book.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {item.book.author.name}
                    </p>
                    <p className="font-bold text-library-600">
                      {item.book.price.toFixed(2)} ر.س
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.book._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.book._id, item.quantity - 1)}
                        className="p-1 h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.book._id, item.quantity + 1)}
                        className="p-1 h-8 w-8"
                        disabled={item.quantity >= item.book.quantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>المجموع:</span>
                <span className="text-library-600">{getTotalPrice().toFixed(2)} ر.س</span>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full bg-library-600 hover:bg-library-700"
                  size="lg"
                >
                  إتمام الطلب
                </Button>
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  مسح السلة
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Checkout Form
          <div className="flex-1 flex flex-col py-4">
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">معلومات الطلب</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <User className="h-4 w-4 inline ml-1" />
                      الاسم الكامل
                    </label>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">ملخص الطلب</h4>
                <div className="space-y-2 text-sm">
                  {cart.map((item) => (
                    <div key={item.book._id} className="flex justify-between">
                      <span>{item.book.title} × {item.quantity}</span>
                      <span>{(item.book.price * item.quantity).toFixed(2)} ر.س</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-bold flex justify-between">
                    <span>المجموع:</span>
                    <span className="text-library-600">{getTotalPrice().toFixed(2)} ر.س</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Actions */}
            <div className="space-y-2 pt-4 border-t">
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut || !userName.trim()}
                className="w-full bg-library-600 hover:bg-library-700"
                size="lg"
              >
                {isCheckingOut ? 'جاري إنشاء الطلب...' : 'تأكيد الطلب'}
              </Button>
              <Button
                onClick={() => setShowCheckoutForm(false)}
                variant="outline"
                className="w-full"
                size="lg"
              >
                العودة للسلة
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;

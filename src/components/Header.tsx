
import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, BookOpen, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import CartDrawer from './CartDrawer';
import Navigation from './Navigation';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('search') as string;
    onSearch(query);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-library-200 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <BookOpen className="h-8 w-8 text-library-600" />
              <h1 className="text-2xl font-bold gradient-text">مكتبة الكتب</h1>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  name="search"
                  placeholder="ابحث عن الكتب..."
                  defaultValue={searchQuery}
                  className="pr-4 pl-10 bg-gray-50 border-0 focus:bg-white transition-colors"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center space-x-2 space-x-reverse">
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>

              {/* User Button */}
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        name="search"
                        placeholder="ابحث عن الكتب..."
                        defaultValue={searchQuery}
                        className="pr-4 pl-10"
                      />
                    </div>
                  </form>
                  <Navigation />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden border-t border-library-200 p-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                name="search"
                placeholder="ابحث عن الكتب..."
                defaultValue={searchQuery}
                className="pr-4 pl-10 bg-gray-50 border-0 focus:bg-white transition-colors"
              />
            </div>
          </form>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block border-t border-library-200">
          <div className="container-custom">
            <Navigation />
          </div>
        </div>
      </header>

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};

export default Header;

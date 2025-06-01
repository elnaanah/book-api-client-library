
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import BooksGrid from '@/components/BooksGrid';
import BookDetails from '@/components/BookDetails';
import FiltersSidebar from '@/components/FiltersSidebar';
import ChatBotFab from '@/components/ChatBotFab';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { apiService } from '@/services/api';
import { Book, BookFilters } from '@/types/api';
import { CartProvider } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailsOpen, setIsBookDetailsOpen] = useState(false);
  const [filters, setFilters] = useState<BookFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSection, setCurrentSection] = useState<'all' | 'featured' | 'new'>('all');

  // Build query filters
  const queryFilters = {
    ...filters,
    ...(searchQuery && { search: searchQuery }),
    ...(currentSection === 'featured' && { featured: true }),
    ...(currentSection === 'new' && { isNew: true }),
  };

  // Fetch books
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['books', queryFilters],
    queryFn: () => apiService.getBooks(queryFilters),
  });

  // Fetch featured books for hero section
  const { data: featuredBooks = [] } = useQuery({
    queryKey: ['books', 'featured'],
    queryFn: () => apiService.getBooks({ featured: true }),
    enabled: currentSection === 'all' && !searchQuery && Object.keys(filters).length === 0,
  });

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailsOpen(true);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentSection('all');
  }, []);

  const handleFiltersChange = useCallback((newFilters: BookFilters) => {
    setFilters(newFilters);
    setCurrentSection('all');
  }, []);

  const handleNavigation = useCallback((type: string, id?: string) => {
    setFilters({});
    setSearchQuery('');
    
    switch (type) {
      case 'category':
        if (id) setFilters({ category: id });
        break;
      case 'author':
        if (id) setFilters({ author: id });
        break;
      case 'featured':
        setCurrentSection('featured');
        break;
      case 'new':
        setCurrentSection('new');
        break;
      case 'all':
        setCurrentSection('all');
        break;
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء جلب الكتب، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  }, [error]);

  const getSectionTitle = () => {
    if (searchQuery) return `نتائج البحث عن "${searchQuery}"`;
    if (currentSection === 'featured') return 'الكتب المميزة';
    if (currentSection === 'new') return 'الكتب الجديدة';
    return 'جميع الكتب';
  };

  const showHeroSection = currentSection === 'all' && !searchQuery && Object.keys(filters).length === 0;

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-library-50 to-white">
        <Header 
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />

        <main className="container-custom py-8">
          {/* Hero Section */}
          {showHeroSection && (
            <section className="mb-12">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                  اكتشف عالم المعرفة
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  مجموعة واسعة من الكتب في جميع المجالات، اختر ما يناسب اهتماماتك واستمتع بالقراءة
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div 
                  className="bg-white rounded-xl p-6 shadow-sm border border-library-100 cursor-pointer hover:shadow-lg transition-all duration-300 group"
                  onClick={() => handleNavigation('featured')}
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="bg-library-100 p-3 rounded-lg group-hover:bg-library-200 transition-colors">
                      <Sparkles className="h-6 w-6 text-library-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">الكتب المميزة</h3>
                      <p className="text-gray-600">اكتشف أفضل الكتب المختارة</p>
                    </div>
                  </div>
                </div>

                <div 
                  className="bg-white rounded-xl p-6 shadow-sm border border-library-100 cursor-pointer hover:shadow-lg transition-all duration-300 group"
                  onClick={() => handleNavigation('new')}
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="bg-library-100 p-3 rounded-lg group-hover:bg-library-200 transition-colors">
                      <Clock className="h-6 w-6 text-library-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">الكتب الجديدة</h3>
                      <p className="text-gray-600">آخر الإصدارات والكتب الجديدة</p>
                    </div>
                  </div>
                </div>

                <div 
                  className="bg-white rounded-xl p-6 shadow-sm border border-library-100 cursor-pointer hover:shadow-lg transition-all duration-300 group"
                  onClick={() => handleNavigation('all')}
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="bg-library-100 p-3 rounded-lg group-hover:bg-library-200 transition-colors">
                      <TrendingUp className="h-6 w-6 text-library-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">الأكثر مبيعاً</h3>
                      <p className="text-gray-600">الكتب الأكثر شعبية</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Books Preview */}
              {featuredBooks.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">الكتب المميزة</h2>
                    <Button 
                      variant="outline" 
                      onClick={() => handleNavigation('featured')}
                      className="hover:bg-library-50"
                    >
                      عرض الكل
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {featuredBooks.slice(0, 5).map((book) => (
                      <div key={book._id} className="animate-fade-in">
                        <div className="book-card group cursor-pointer" onClick={() => handleBookSelect(book)}>
                          <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-sm line-clamp-2 mb-2">{book.title}</h3>
                            <p className="text-xs text-gray-600 mb-2">{book.author.name}</p>
                            <p className="font-bold text-library-600">{book.price.toFixed(2)} ر.س</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <FiltersSidebar 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Mobile Filters */}
              <div className="lg:hidden mb-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="h-4 w-4 ml-2" />
                      المرشحات
                      {Object.values(filters).filter(v => v !== undefined && v !== null && v !== '').length > 0 && (
                        <span className="mr-2 bg-library-600 text-white text-xs px-2 py-1 rounded-full">
                          {Object.values(filters).filter(v => v !== undefined && v !== null && v !== '').length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <FiltersSidebar 
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Books Grid */}
              <BooksGrid
                books={books}
                loading={isLoading}
                title={getSectionTitle()}
                onBookSelect={handleBookSelect}
              />
            </div>
          </div>
        </main>

        {/* Book Details Modal */}
        <BookDetails
          book={selectedBook}
          open={isBookDetailsOpen}
          onOpenChange={setIsBookDetailsOpen}
        />

        {/* Chat Bot */}
        <ChatBotFab />
      </div>
    </CartProvider>
  );
};

export default Index;

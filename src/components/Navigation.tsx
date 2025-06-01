
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, BookOpen, Users, Star, Clock } from 'lucide-react';
import { apiService } from '@/services/api';
import { Category, Author } from '@/types/api';

interface NavigationProps {
  onCategorySelect?: (categoryId: string) => void;
  onAuthorSelect?: (authorId: string) => void;
  onFeaturedClick?: () => void;
  onNewBooksClick?: () => void;
  onAllBooksClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  onCategorySelect,
  onAuthorSelect,
  onFeaturedClick,
  onNewBooksClick,
  onAllBooksClick,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, authorsData] = await Promise.all([
          apiService.getCategories(),
          apiService.getAuthors()
        ]);
        setCategories(categoriesData);
        setAuthors(authorsData.slice(0, 10)); // Show first 10 authors
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <nav className="py-3">
      <div className="flex items-center space-x-6 space-x-reverse overflow-x-auto">
        {/* All Books */}
        <Button
          variant="ghost"
          onClick={onAllBooksClick}
          className="whitespace-nowrap hover:text-library-600 hover:bg-library-50"
        >
          <BookOpen className="h-4 w-4 ml-2" />
          جميع الكتب
        </Button>

        {/* Categories Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="whitespace-nowrap hover:text-library-600 hover:bg-library-50">
              الفئات
              <ChevronDown className="h-4 w-4 mr-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category._id}
                onClick={() => onCategorySelect?.(category._id)}
                className="cursor-pointer"
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Authors Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="whitespace-nowrap hover:text-library-600 hover:bg-library-50">
              <Users className="h-4 w-4 ml-2" />
              المؤلفون
              <ChevronDown className="h-4 w-4 mr-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {authors.map((author) => (
              <DropdownMenuItem
                key={author._id}
                onClick={() => onAuthorSelect?.(author._id)}
                className="cursor-pointer"
              >
                {author.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Featured Books */}
        <Button
          variant="ghost"
          onClick={onFeaturedClick}
          className="whitespace-nowrap hover:text-library-600 hover:bg-library-50"
        >
          <Star className="h-4 w-4 ml-2" />
          الكتب المميزة
        </Button>

        {/* New Books */}
        <Button
          variant="ghost"
          onClick={onNewBooksClick}
          className="whitespace-nowrap hover:text-library-600 hover:bg-library-50"
        >
          <Clock className="h-4 w-4 ml-2" />
          الكتب الجديدة
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;

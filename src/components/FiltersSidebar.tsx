
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, Filter, RefreshCw } from 'lucide-react';
import { apiService } from '@/services/api';
import { Category, Author, BookFilters } from '@/types/api';

interface FiltersSidebarProps {
  filters: BookFilters;
  onFiltersChange: (filters: BookFilters) => void;
  className?: string;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  filters,
  onFiltersChange,
  className = '',
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, authorsData] = await Promise.all([
          apiService.getCategories(),
          apiService.getAuthors()
        ]);
        setCategories(categoriesData);
        setAuthors(authorsData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateFilter = (key: keyof BookFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Filter className="h-5 w-5 text-library-600" />
          <h3 className="text-lg font-semibold">المرشحات</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-library-100 text-library-800">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="h-4 w-4 ml-1" />
            مسح الكل
          </Button>
        )}
      </div>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">نطاق السعر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minPrice" className="text-sm">من</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-sm">إلى</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="1000"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">الفئات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div
                key={category._id}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  filters.category === category._id
                    ? 'bg-library-100 text-library-800'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => updateFilter('category', 
                  filters.category === category._id ? undefined : category._id
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{category.name}</span>
                  {filters.category === category._id && (
                    <X className="h-4 w-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Authors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">المؤلفون</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {authors.map((author) => (
              <div
                key={author._id}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  filters.author === author._id
                    ? 'bg-library-100 text-library-800'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => updateFilter('author', 
                  filters.author === author._id ? undefined : author._id
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{author.name}</span>
                  {filters.author === author._id && (
                    <X className="h-4 w-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Special Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">مرشحات خاصة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div
            className={`p-3 rounded cursor-pointer transition-colors ${
              filters.featured
                ? 'bg-library-100 text-library-800 border border-library-200'
                : 'hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => updateFilter('featured', !filters.featured)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">الكتب المميزة</span>
              {filters.featured && <X className="h-4 w-4" />}
            </div>
          </div>
          
          <div
            className={`p-3 rounded cursor-pointer transition-colors ${
              filters.isNew
                ? 'bg-library-100 text-library-800 border border-library-200'
                : 'hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => updateFilter('isNew', !filters.isNew)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">الكتب الجديدة</span>
              {filters.isNew && <X className="h-4 w-4" />}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FiltersSidebar;

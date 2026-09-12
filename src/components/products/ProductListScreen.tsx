import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  X,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const ProductListScreen: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    language,
    goBack,
  } = useApp();

  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'newest'>('popularity');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Active Category info
  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category match
        if (selectedCategoryId && product.categoryId !== selectedCategoryId) {
          return false;
        }
        // Search query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchUrdu = product.nameUrdu ? product.nameUrdu.includes(q) : false;
          const matchDesc = product.description.toLowerCase().includes(q);
          if (!matchName && !matchUrdu && !matchDesc) return false;
        }
        // Price match
        if (product.price > maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        // popularity
        return b.reviewCount - a.reviewCount;
      });
  }, [products, selectedCategoryId, searchQuery, maxPrice, sortBy]);

  return (
    <div className="pb-24 px-4 pt-3 space-y-4">
      {/* Category Pills Rail */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer ${
            selectedCategoryId === null
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              selectedCategoryId === cat.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{language === 'ur' && cat.nameUrdu ? cat.nameUrdu : cat.name}</span>
          </button>
        ))}
      </div>

      {/* Screen Subheader & Controls: Sort, Filter, Clear */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
            {activeCategory
              ? language === 'ur' && activeCategory.nameUrdu
                ? activeCategory.nameUrdu
                : activeCategory.name
              : searchQuery
              ? `Results for "${searchQuery}"`
              : 'All Supermarket Groceries'}
          </h2>
          <p className="text-xs text-slate-500">
            Showing {filteredProducts.length} items available at Daska Branch
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-slate-100 text-slate-800 text-xs font-bold pl-3 pr-8 py-2 rounded-xl border border-slate-200/80 cursor-pointer outline-hidden hover:bg-slate-200/60"
            >
              <option value="popularity">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">New Arrivals</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter Trigger */}
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition cursor-pointer ${
              isFilterDrawerOpen || maxPrice < 3000
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Expandable Price Filter Panel */}
      {isFilterDrawerOpen && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm animate-in fade-in space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900">Filter By Price (PKR)</span>
            <span className="text-xs font-bold text-emerald-700">
              Up to Rs. {maxPrice.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="3000"
            step="50"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>Rs. 100</span>
            <span>Rs. 1,500</span>
            <span>Rs. 3,000+</span>
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => {
                setMaxPrice(3000);
                setSelectedCategoryId(null);
                setSearchQuery('');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">No items found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            We couldn't find any supermarket items matching your filter in Daska branch.
          </p>
          <button
            onClick={() => {
              setSelectedCategoryId(null);
              setSearchQuery('');
              setMaxPrice(3000);
            }}
            className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition hover:bg-emerald-700 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

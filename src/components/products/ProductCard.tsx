import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, Plus, Minus, Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    cart,
    addToCart,
    updateQuantity,
    wishlist,
    toggleWishlist,
    setSelectedProductId,
    language,
  } = useApp();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const isWishlisted = wishlist.includes(product.id);

  // Discount percentage calculation
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative"
    >
      {/* Badges & Wishlist */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent && (
            <span className="bg-[#E31B23] text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs pointer-events-auto">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBogo && (
            <span className="bg-[#004B93] text-white font-bold text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs pointer-events-auto">
              Buy 1 Get 1
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Wishlist"
          className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs hover:bg-white shadow-xs flex items-center justify-center text-slate-400 hover:text-[#E31B23] transition pointer-events-auto cursor-pointer border border-slate-100"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isWishlisted ? 'fill-[#E31B23] text-[#E31B23]' : 'stroke-[2]'
            }`}
          />
        </button>
      </div>

      {/* Image Container */}
      <div
        onClick={() => setSelectedProductId(product.id)}
        className="w-full h-36 sm:h-44 bg-slate-50 relative overflow-hidden cursor-pointer flex items-center justify-center p-3"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';
          }}
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-1.5 left-2 bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div
          onClick={() => setSelectedProductId(product.id)}
          className="cursor-pointer"
        >
          {/* Unit / Weight */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-[#004B93] bg-blue-50 px-1.5 py-0.5 rounded">
              {product.unit}
            </span>
            <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#004B93] transition">
            {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
          </h3>

          {/* Subtitle / English or Urdu alternate */}
          {language === 'en' && product.nameUrdu && (
            <p className="text-[11px] text-slate-500 font-urdu truncate mt-0.5">
              {product.nameUrdu}
            </p>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-slate-900">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-[#E31B23]/70 line-through block font-medium">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Stepper / Button */}
          {cartItem ? (
            <div className="flex items-center bg-[#004B93] text-white rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-[#003870] active:scale-95 transition cursor-pointer"
                title="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold px-1.5 min-w-[20px] text-center">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-[#003870] active:scale-95 transition cursor-pointer"
                title="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id={`btn-add-cart-${product.id}`}
              onClick={() => addToCart(product, 1)}
              className="bg-[#004B93] hover:bg-[#003870] active:scale-95 text-white p-2 sm:px-3 sm:py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

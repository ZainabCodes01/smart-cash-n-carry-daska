import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Heart,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    products,
    addToCart,
    wishlist,
    toggleWishlist,
    navigateTo,
    language,
    storeSettings,
  } = useApp();

  const [quantity, setQuantity] = useState(1);

  if (!selectedProductId) return null;

  const product = products.find((p) => p.id === selectedProductId);
  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setSelectedProductId(null);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col relative animate-in fade-in zoom-in-95">
        {/* Sticky Header with Close & Wishlist */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-[#004B93] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            Smart Cash & Carry • Daska
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#E31B23] transition cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#E31B23] text-[#E31B23]' : ''}`} />
            </button>
            <button
              id="btn-close-product-modal"
              onClick={() => setSelectedProductId(null)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Main Visual & Key Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Large Product Image */}
            <div className="relative bg-slate-50 rounded-2xl p-6 flex items-center justify-center border border-slate-100 h-64 sm:h-72">
              {discountPercent && (
                <span className="absolute top-3 left-3 bg-[#E31B23] text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-xs">
                  {discountPercent}% OFF
                </span>
              )}
              {product.isBogo && (
                <span className="absolute top-3 right-3 bg-[#004B93] text-white font-bold text-xs px-2.5 py-1 rounded-lg uppercase shadow-xs">
                  Buy 1 Get 1 Free
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-md hover:scale-105 transition duration-300"
              />
            </div>

            {/* Info & Price */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-blue-50 text-[#004B93] px-2.5 py-1 rounded-md border border-blue-100">
                  {product.unit}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h1>
              {product.nameUrdu && (
                <p className="text-base text-[#004B93] font-urdu font-semibold">
                  {product.nameUrdu}
                </p>
              )}

              {/* Price Row */}
              <div className="flex items-baseline gap-3 py-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-[#E31B23]/70 line-through font-semibold">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">In Stock</span>
                <span className="text-slate-400">({product.stock} units at College Rd branch)</span>
              </div>

              {/* Delivery Guarantee Pill */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 text-xs text-slate-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#004B93]">
                  <Truck className="w-4 h-4 text-[#E31B23]" />
                  <span>Direct Delivery from Smart Cash & Carry Daska</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-6">
                  Delivery in 30-45 mins. Free delivery on orders over Rs.{' '}
                  {storeSettings.freeDeliveryThreshold.toLocaleString()}.
                </p>
              </div>

              {/* Quantity Stepper */}
              <div className="pt-2 flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-blue-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-blue-100 text-slate-600 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900 min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-blue-100 text-slate-600 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Total: Rs. {(product.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              Product Details & Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
            {product.descriptionUrdu && (
              <p className="text-sm text-slate-700 font-urdu leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {product.descriptionUrdu}
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              id="btn-modal-add-to-cart"
              onClick={handleAddToCart}
              className="bg-blue-50 hover:bg-blue-100 text-[#004B93] border border-blue-200 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
            <button
              id="btn-modal-buy-now"
              onClick={handleBuyNow}
              className="bg-[#E31B23] hover:bg-[#c9141b] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition cursor-pointer active:scale-98"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Related Products Rail */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Related Items from Same Category
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedProductId(rel.id);
                      setQuantity(1);
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-[#004B93] bg-slate-50/50 cursor-pointer transition text-center"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-16 h-16 object-contain mx-auto mix-blend-multiply mb-1.5"
                    />
                    <p className="text-xs font-bold text-slate-800 truncate">{rel.name}</p>
                    <p className="text-xs font-extrabold text-[#004B93] mt-0.5">
                      Rs. {rel.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

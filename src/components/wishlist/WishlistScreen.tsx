import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

export const WishlistScreen: React.FC = () => {
  const {
    wishlist,
    products,
    toggleWishlist,
    moveWishlistToCart,
    navigateTo,
    language,
  } = useApp();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="pb-28 px-4 pt-3 space-y-4 max-w-2xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {language === 'ur' ? 'میری پسندیدہ اشیاء' : 'Saved Wishlist'}
          </h1>
          <p className="text-xs text-slate-500">
            Items you bookmarked for your next grocery trip to Smart Cash & Carry Daska
          </p>
        </div>
        <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 fill-red-600" />
          <span>{wishlistedProducts.length} items</span>
        </span>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Tap the heart icon on any grocery item or fresh meat product to save it here for later.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center gap-3.5 justify-between"
            >
              <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-1.5 shrink-0 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {product.name}
                </h3>
                {product.nameUrdu && (
                  <p className="text-[11px] text-slate-500 font-urdu truncate">
                    {product.nameUrdu}
                  </p>
                )}
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                  {product.unit}
                </span>
                <p className="text-xs font-black text-slate-900 mt-1">
                  Rs. {product.price.toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => moveWishlistToCart(product.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="text-slate-400 hover:text-red-500 text-[11px] font-semibold flex items-center justify-center gap-1 py-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

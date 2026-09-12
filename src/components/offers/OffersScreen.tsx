import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../products/ProductCard';
import {
  Tag,
  Flame,
  Sparkles,
  Gift,
  Copy,
  Check,
  Percent,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const OffersScreen: React.FC = () => {
  const {
    products,
    coupons,
    applyCoupon,
    navigateTo,
    language,
    showToast,
  } = useApp();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const bogoProducts = products.filter((p) => p.isBogo);
  const flashDeals = products.filter((p) => p.isFlashDeal);
  const discountedProducts = products.filter(
    (p) => p.originalPrice && p.originalPrice > p.price
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    showToast(`Code ${code} copied & applied!`, `کوڈ کاپی اور اپلائی ہو گیا!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-6 max-w-4xl mx-auto">
      {/* Title & Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {language === 'ur' ? 'سپر ڈیلز اور بچت آفرز' : 'Bachat Deals & Offers'}
          </h1>
          <p className="text-xs text-slate-500">
            Smart Cash & Carry Daska • Pay Less. Expect More.
          </p>
        </div>
        <span className="text-xs font-black bg-amber-500 text-slate-950 px-3 py-1 rounded-full uppercase tracking-wider">
          Super Deals
        </span>
      </div>

      {/* Super Coupon Vouchers Strip */}
      <section className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-emerald-600" />
          <span>Active Supermarket Promo Coupons</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {coupons
            .filter((c) => c.isActive)
            .map((coupon) => (
              <div
                key={coupon.id}
                className="bg-gradient-to-br from-emerald-800 to-teal-950 text-white rounded-2xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% OFF`
                        : `Rs. ${coupon.discountValue} FLAT`}
                    </span>
                    <span className="text-[10px] text-emerald-200">
                      Min Rs. {coupon.minOrderValue.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-black text-lg text-white font-mono tracking-wider pt-1">
                    {coupon.code}
                  </h3>
                  <p className="text-[11px] text-emerald-100 leading-snug">
                    {coupon.description}
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-emerald-700/60 mt-2">
                  <span className="text-[10px] text-emerald-300">Tap to apply to cart</span>
                  <button
                    onClick={() => handleCopyCode(coupon.code)}
                    className="bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition"
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Applied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Buy 1 Get 1 Free (BOGO) */}
      <section className="space-y-3">
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
              1+1
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-emerald-950">
                Buy 1 Get 1 Free (BOGO Offers)
              </h2>
              <p className="text-xs text-emerald-700">Stock up on breakfast & daily snacks</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {bogoProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Flash Discounts */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Weekly Bachat Super Deals
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {discountedProducts.length} Items on Sale
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {discountedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

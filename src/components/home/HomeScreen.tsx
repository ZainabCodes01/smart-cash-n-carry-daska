import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../products/ProductCard';
import {
  Flame,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Truck,
  PhoneCall,
  CheckCircle2,
  Tag,
  ChevronRight,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    banners,
    categories,
    products,
    navigateTo,
    language,
    storeSettings,
    selectedAddress,
  } = useApp();

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Flash deals timer state (simulate countdown for today)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatic banner rotation
  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(bannerTimer);
  }, [banners.length]);

  const flashDeals = products.filter((p) => p.isFlashDeal);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const newArrivals = products.filter((p) => p.isNewArrival || p.isBogo);
  const recommended = products.slice(0, 8);

  const activeBanner = banners[activeBannerIndex] || banners[0];

  return (
    <div className="pb-20 space-y-6">
      {/* Promotional Banner Carousel */}
      <div className="px-4 pt-3">
        <div className="relative rounded-3xl overflow-hidden shadow-lg text-white min-h-[170px] sm:min-h-[220px] flex flex-col justify-between p-5 sm:p-7 bg-gradient-to-r from-[#00376d] via-[#004B93] to-[#0b2447] transition-all duration-500">
          {/* Background image overlay */}
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: `url(${activeBanner.image})` }}
          />

          <div className="relative z-10 max-w-md">
            <div className="inline-block bg-[#E31B23] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 shadow-xs">
              {activeBanner.badge}
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white leading-tight mb-1">
              {language === 'ur' && activeBanner.titleUrdu ? activeBanner.titleUrdu : activeBanner.title}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-medium line-clamp-2">
              {activeBanner.subtitle}
            </p>
          </div>

          <div className="relative z-10 pt-3 flex items-center justify-between">
            <button
              id="btn-banner-shop-now"
              onClick={() => {
                if (activeBanner.linkCategoryId) {
                  navigateTo('product-list', { categoryId: activeBanner.linkCategoryId });
                } else {
                  navigateTo('offers');
                }
              }}
              className="bg-white text-[#004B93] hover:bg-blue-50 active:scale-95 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 text-[#E31B23]" />
            </button>

            {/* Carousel Dots */}
            <div className="flex items-center gap-1.5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBannerIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeBannerIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daska Delivery Speed Promise Strip */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-blue-50/80 via-white to-red-50/50 border border-blue-100 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#004B93] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Express Delivery to <span className="text-[#004B93]">{selectedAddress.area || 'College Road'}</span>
              </p>
              <p className="text-[11px] text-slate-600">
                Average arrival: <strong className="text-[#E31B23]">30-45 mins</strong> across Daska
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('contact')}
            className="text-xs font-bold text-[#004B93] bg-white border border-blue-200 px-2.5 py-1.5 rounded-lg shadow-xs shrink-0 hover:bg-blue-50 cursor-pointer"
          >
            Store Info
          </button>
        </div>
      </div>

      {/* Supermarket Categories Quick Rail */}
      <section className="space-y-3">
        <div className="px-4 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">Explore Supermarket</h2>
            <p className="text-xs text-slate-500">15+ Grocery & Fresh Sections</p>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="text-xs font-bold text-[#004B93] hover:text-[#003870] flex items-center gap-0.5 cursor-pointer"
          >
            <span>All Categories</span>
            <ChevronRight className="w-4 h-4 text-[#E31B23]" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('product-list', { categoryId: cat.id })}
              className="flex flex-col items-center shrink-0 w-20 sm:w-24 group cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200/80 p-1.5 shadow-xs group-hover:border-[#004B93] group-hover:shadow-sm transition flex items-center justify-center overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition duration-300"
                />
              </div>
              <span className="text-[11px] font-bold text-slate-800 text-center mt-1.5 line-clamp-1 group-hover:text-[#004B93]">
                {language === 'ur' && cat.nameUrdu ? cat.nameUrdu : cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Deals / Today's Deals with Countdown Timer */}
      <section className="px-4 space-y-3">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#E31B23] text-white flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">Today's Flash Deals</h2>
                <span className="bg-[#E31B23] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase animate-pulse shadow-xs">
                  Save Big
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">Limited stock wholesale prices</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#004B93] bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {flashDeals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Supermarket Bachat Banner */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-[#00376d] via-[#004B93] to-[#002852] text-white rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm border border-blue-900">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold bg-[#E31B23] text-white px-2 py-0.5 rounded uppercase shadow-xs">
              Weekly Bachat
            </span>
            <h3 className="font-extrabold text-sm sm:text-base leading-tight">
              Pay Less & Expect More at Daska!
            </h3>
            <p className="text-xs text-blue-100">
              Fresh chicken, cooking oils, basmati rice & pantry staples.
            </p>
          </div>
          <button
            onClick={() => navigateTo('offers')}
            className="bg-white text-[#004B93] hover:bg-blue-50 font-bold text-xs px-3.5 py-2 rounded-xl shrink-0 shadow-xs active:scale-95 cursor-pointer transition"
          >
            View Offers
          </button>
        </div>
      </div>

      {/* Best Sellers Section */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#004B93]" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">Daska Best Sellers</h2>
          </div>
          <button
            onClick={() => navigateTo('product-list')}
            className="text-xs font-bold text-[#004B93] hover:text-[#003870] flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 text-[#E31B23]" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Fresh Meat & Poultry Highlight */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E31B23]" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">Fresh Meat & Poultry</h2>
              <p className="text-xs text-slate-500">100% Halal Certified Slaughter Daily</p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('product-list', { categoryId: 'cat-meat' })}
            className="text-xs font-bold text-[#004B93] hover:text-[#003870] flex items-center gap-0.5 cursor-pointer"
          >
            <span>See Meat</span>
            <ChevronRight className="w-4 h-4 text-[#E31B23]" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {products
            .filter((p) => p.categoryId === 'cat-meat')
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      {/* New Arrivals & BOGO Deals */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#004B93]" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">New Arrivals & BOGO</h2>
          </div>
          <button
            onClick={() => navigateTo('offers')}
            className="text-xs font-bold text-[#004B93] hover:text-[#003870] flex items-center gap-0.5 cursor-pointer"
          >
            <span>More Deals</span>
            <ChevronRight className="w-4 h-4 text-[#E31B23]" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recommended Groceries */}
      <section className="px-4 space-y-3">
        <h2 className="text-base sm:text-lg font-black text-slate-900">Recommended for You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {recommended.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Smart Cash & Carry Daska Branch Trust & Support Footer Card */}
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-br from-[#002f5e] via-[#004B93] to-[#001f3f] text-white rounded-3xl p-6 space-y-4 shadow-xl border border-blue-900">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black bg-[#E31B23] text-white px-2.5 py-0.5 rounded-md uppercase shadow-xs">
                Daska Branch, Pakistan
              </span>
              <h4 className="text-lg font-extrabold mt-1.5">{storeSettings.storeName}</h4>
              <p className="text-xs text-blue-200 mt-0.5 font-urdu">
                {storeSettings.storeNameUrdu}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-xl text-center border border-white/10">
              <p className="text-amber-300 font-extrabold text-sm">{storeSettings.rating} ★</p>
              <p className="text-[10px] text-blue-100">{storeSettings.reviewCount} Reviews</p>
            </div>
          </div>

          <div className="text-xs text-blue-100 space-y-1.5 border-t border-blue-800/80 pt-3">
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{storeSettings.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-300 shrink-0" />
              <span>
                Store Hours: {storeSettings.openingTime} – {storeSettings.closingTime} Daily
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${storeSettings.phone}`}
              className="bg-[#E31B23] hover:bg-[#c9141b] text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-center transition shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Store</span>
            </a>
            <button
              onClick={() => navigateTo('contact')}
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-center transition cursor-pointer"
            >
              <span>Map & Hours</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

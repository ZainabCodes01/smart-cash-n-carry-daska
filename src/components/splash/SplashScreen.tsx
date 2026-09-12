import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, ArrowRight, Clock, MapPin, ShieldCheck } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { navigateTo, storeSettings, language } = useApp();

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#002f5e] via-[#004B93] to-[#08172c] text-white flex flex-col justify-between p-6 select-none overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag */}
      <div className="flex justify-between items-center pt-4 z-10">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs font-medium tracking-wide">
          <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
          <span>Daska Branch, College Rd</span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-400/20 text-blue-200 text-xs px-2.5 py-1 rounded-full border border-blue-300/30">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>Open till {storeSettings.closingTime}</span>
        </div>
      </div>

      {/* Center Branding */}
      <div className="flex flex-col items-center text-center my-auto z-10 px-4">
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white p-3 flex items-center justify-center shadow-2xl shadow-blue-950/80 border-2 border-blue-400/40">
            {storeSettings.logoUrl ? (
              <img
                src={storeSettings.logoUrl}
                alt={storeSettings.storeName}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <ShoppingBag className="w-12 h-12 text-[#004B93] drop-shadow-md" />
            )}
          </div>
          <span className="absolute -bottom-2 -right-2 bg-[#E31B23] text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
            Daska Branch
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1">
          Smart Cash & Carry
        </h1>
        <p className="text-lg font-semibold text-blue-200 font-urdu mb-2">
          سمارٹ کیش اینڈ کیری - ڈسکہ
        </p>

        <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/15 mb-6">
          <p className="text-sm sm:text-base text-blue-100 font-medium tracking-wide">
            "Pay Less. Expect More."
          </p>
          <p className="text-xs text-blue-200 font-urdu mt-0.5">
            کم دام، بہترین اور معیاری اشیاء
          </p>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-2">
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
            <p className="text-amber-400 font-bold text-xs sm:text-sm">30-45 Mins</p>
            <p className="text-[10px] text-blue-100">Fast Delivery</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
            <p className="text-emerald-400 font-bold text-xs sm:text-sm">100% Halal</p>
            <p className="text-[10px] text-blue-100">Fresh Meat</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
            <p className="text-red-400 font-bold text-xs sm:text-sm">Wholesale</p>
            <p className="text-[10px] text-blue-100">Bachat Rates</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="space-y-3 z-10 pb-6">
        <button
          id="btn-start-shopping"
          onClick={() => navigateTo('home')}
          className="w-full bg-[#E31B23] hover:bg-[#c9141b] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-[0.99] transition cursor-pointer text-base"
        >
          <span>Start Shopping Groceries</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-blue-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official Daska Branch Mobile App • Cash on Delivery</span>
        </div>
      </div>
    </div>
  );
};

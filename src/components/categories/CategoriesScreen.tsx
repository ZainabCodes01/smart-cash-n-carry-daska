import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Sparkles } from 'lucide-react';

export const CategoriesScreen: React.FC = () => {
  const { categories, products, navigateTo, language } = useApp();

  return (
    <div className="pb-24 px-4 pt-3 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {language === 'ur' ? 'تمام کیٹیگریز' : 'All Categories'}
          </h1>
          <p className="text-xs text-slate-500">
            Browse all departments of Smart Cash & Carry Daska
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          {categories.length} Categories
        </span>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              onClick={() => navigateTo('product-list', { categoryId: cat.id })}
              className="group bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs hover:shadow-md hover:border-[#004B93] transition cursor-pointer flex flex-col justify-between"
            >
              <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-slate-50 mb-3 flex items-center justify-center p-2">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-108 transition duration-300"
                />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#004B93] transition leading-snug">
                  {language === 'ur' && cat.nameUrdu ? cat.nameUrdu : cat.name}
                </h3>
                {language === 'en' && cat.nameUrdu && (
                  <p className="text-xs text-slate-500 font-urdu truncate mt-0.5">
                    {cat.nameUrdu}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-medium">
                    {productCount > 0 ? `${productCount}+ items` : 'Available'}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-[#004B93] group-hover:text-white flex items-center justify-center text-slate-400 transition">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bachat notice */}
      <div className="bg-amber-500/10 border border-amber-300/40 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">Need specific items not listed?</h4>
          <p className="text-xs text-slate-600">
            Call or WhatsApp our Daska store directly at <strong>+92 320 8488888</strong> for custom bulk grocery orders.
          </p>
        </div>
      </div>
    </div>
  );
};

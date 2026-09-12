import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, LayoutGrid, Tag, ClipboardList, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo, orders, language } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      labelUrdu: 'ہوم',
      icon: Home,
      screen: 'home' as const,
    },
    {
      id: 'categories',
      label: 'Categories',
      labelUrdu: 'کیٹیگریز',
      icon: LayoutGrid,
      screen: 'categories' as const,
    },
    {
      id: 'offers',
      label: 'Offers',
      labelUrdu: 'آفرز',
      icon: Tag,
      screen: 'offers' as const,
      badge: 'Hot',
    },
    {
      id: 'orders',
      label: 'My Orders',
      labelUrdu: 'آرڈرز',
      icon: ClipboardList,
      screen: 'orders' as const,
      countBadge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    {
      id: 'profile',
      label: 'Profile',
      labelUrdu: 'پروفائل',
      icon: User,
      screen: 'profile' as const,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            currentScreen === item.screen ||
            (item.screen === 'categories' && currentScreen === 'product-list') ||
            (item.screen === 'orders' && (currentScreen === 'order-tracking' || currentScreen === 'order-confirmation'));
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => navigateTo(item.screen)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition cursor-pointer select-none ${
                isActive ? 'text-[#004B93] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5] text-[#004B93]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3.5 bg-[#E31B23] text-white text-[9px] font-black px-1 rounded-full uppercase leading-tight shadow-xs animate-pulse">
                    {item.badge}
                  </span>
                )}
                {item.countBadge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#004B93] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.countBadge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 leading-none ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'ur' ? item.labelUrdu : item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

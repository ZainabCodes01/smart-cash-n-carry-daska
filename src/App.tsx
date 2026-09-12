import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/splash/SplashScreen';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeScreen } from './components/home/HomeScreen';
import { CategoriesScreen } from './components/categories/CategoriesScreen';
import { ProductListScreen } from './components/products/ProductListScreen';
import { CartScreen } from './components/cart/CartScreen';
import { CheckoutScreen } from './components/checkout/CheckoutScreen';
import { OrderConfirmationScreen } from './components/orders/OrderConfirmationScreen';
import { OrderTrackingScreen } from './components/orders/OrderTrackingScreen';
import { MyOrdersScreen } from './components/orders/MyOrdersScreen';
import { WishlistScreen } from './components/wishlist/WishlistScreen';
import { OffersScreen } from './components/offers/OffersScreen';
import { ContactScreen } from './components/contact/ContactScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentScreen, language, toast } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  // Initial splash delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'product-list':
        return <ProductListScreen />;
      case 'cart':
        return <CartScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'order-confirmation':
        return <OrderConfirmationScreen />;
      case 'order-tracking':
        return <OrderTrackingScreen />;
      case 'orders':
        return <MyOrdersScreen />;
      case 'wishlist':
        return <WishlistScreen />;
      case 'offers':
        return <OffersScreen />;
      case 'contact':
        return <ContactScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-[#004B93] selection:text-white flex justify-center">
      {/* Mobile-first centered frame with responsive max-width */}
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl min-h-screen bg-slate-50 flex flex-col shadow-2xl relative border-x border-slate-200/60">
        {/* Persistent Store Header (hidden on admin screen) */}
        {currentScreen !== 'admin' && <Header />}

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-x-hidden">
          {renderScreen()}
        </main>

        {/* Global Product Detail Modal */}
        <ProductDetailModal />

        {/* Bottom Floating Navigation (hidden in checkout & admin for distraction-free completion) */}
        {currentScreen !== 'checkout' && currentScreen !== 'admin' && <BottomNav />}

        {/* Global Action Toast Notification (transient, e.g. Added to Cart) */}
        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
            <div
              key={toast.id}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl border text-xs font-bold transition-all duration-300 animate-in fade-in slide-in-from-top-2 pointer-events-auto ${
                toast.type === 'error'
                  ? 'bg-[#E31B23] text-white border-red-700'
                  : 'bg-[#002f5e] text-white border-blue-800'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-200 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" />
              )}
              <div className="truncate">
                <span>{toast.message}</span>
                {toast.messageUrdu && language === 'ur' && (
                  <span className="block text-[11px] font-urdu text-blue-200 mt-0.5">
                    {toast.messageUrdu}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

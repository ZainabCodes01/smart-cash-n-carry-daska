import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Search,
  Bell,
  ShoppingCart,
  Languages,
  ChevronDown,
  Clock,
  Store,
  X,
  Phone,
} from 'lucide-react';
import { DASKA_AREAS } from '../../data/initialData';

export const Header: React.FC = () => {
  const {
    storeSettings,
    language,
    toggleLanguage,
    cartCount,
    navigateTo,
    selectedAddress,
    setSelectedAddress,
    unreadNotificationsCount,
    notifications,
    markNotificationAsRead,
    searchQuery,
    setSearchQuery,
    products,
  } = useApp();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Filter products for quick search dropdown
  const filteredSearch = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.nameUrdu && p.nameUrdu.includes(searchQuery)) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      navigateTo('product-list');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Notification / Emergency Announcement Bar */}
      {storeSettings.emergencyNotice && (
        <div className="bg-[#002f5e] text-blue-100 text-xs px-4 py-1.5 flex items-center justify-between font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="truncate">{storeSettings.emergencyNotice}</span>
          </div>
          <a
            href={`tel:${storeSettings.phone}`}
            className="hidden sm:flex items-center gap-1 text-blue-200 hover:text-white shrink-0 ml-2"
          >
            <Phone className="w-3 h-3" />
            <span>{storeSettings.phone}</span>
          </a>
        </div>
      )}

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Location */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group"
          >
            {storeSettings.logoUrl ? (
              <div className="h-11 w-auto max-w-[125px] sm:max-w-[155px] bg-white rounded-xl p-1 border border-slate-200/80 shadow-xs flex items-center justify-center overflow-hidden transition group-hover:scale-102">
                <img
                  src={storeSettings.logoUrl}
                  alt={storeSettings.storeName}
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#004B93] to-[#002b55] flex items-center justify-center text-white font-black text-lg shadow-sm">
                <Store className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="hidden xs:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#004B93] text-base leading-none">Smart</span>
                <span className="text-[10px] font-bold bg-[#E31B23] text-white px-1.5 py-0.5 rounded uppercase tracking-wider shadow-xs">
                  Daska
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-semibold leading-tight">Cash & Carry</p>
            </div>
          </div>

          {/* Delivery Location Picker */}
          <div
            id="btn-location-picker"
            onClick={() => setIsAddressModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-blue-50/70 transition px-2.5 py-1.5 rounded-xl cursor-pointer text-xs border border-slate-200/60 max-w-[180px] sm:max-w-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-[#E31B23] shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block leading-tight font-medium">Deliver to</span>
              <span className="font-semibold text-slate-800 truncate block leading-tight">
                {selectedAddress.area || 'College Road'}, Daska
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Right Action Icons: Language, Notifications, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher */}
          <button
            id="btn-language-toggle"
            onClick={toggleLanguage}
            title="Switch English / Urdu"
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#004B93] border border-slate-200 transition cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-[#004B93]" />
            <span>{language === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              id="btn-notifications"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E31B23] text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                    <Bell className="w-4 h-4 text-[#004B93]" />
                    <span>Notifications</span>
                  </div>
                  <span className="text-xs text-slate-500">{notifications.length} updates</span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                        notif.read
                          ? 'bg-slate-50/70 border-slate-100 text-slate-600'
                          : 'bg-blue-50/60 border-blue-100 text-slate-900 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{notif.title}</span>
                        <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <button
            id="btn-header-cart"
            onClick={() => navigateTo('cart')}
            className="flex items-center gap-2 bg-[#004B93] hover:bg-[#003870] text-white px-3 py-2 rounded-xl shadow-sm font-semibold text-xs sm:text-sm active:scale-95 transition cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="bg-[#E31B23] text-white px-1.5 py-0.5 rounded-full text-xs font-black shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar Row */}
      <div className="max-w-7xl mx-auto px-4 pb-2.5">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="input-global-search"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder={
                language === 'ur'
                  ? 'آٹا، گھی، چاول، مرغی، گوشت، صابن تلاش کریں...'
                  : 'Search groceries, meat, dairy, snacks, household items...'
              }
              className="w-full pl-10 pr-24 py-2.5 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-800 text-sm rounded-xl border border-transparent focus:border-[#004B93] focus:ring-2 focus:ring-[#004B93]/20 outline-hidden transition placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-12 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 bg-[#E31B23] hover:bg-[#c9141b] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition shadow-xs"
            >
              Search
            </button>
          </div>

          {/* Quick Autocomplete Suggestions Dropdown */}
          {showSearchResults && filteredSearch.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="p-2 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 flex justify-between">
                <span>Matching Products in Daska Store</span>
                <span className="text-[#004B93] font-bold">{filteredSearch.length} results</span>
              </div>
              {filteredSearch.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setShowSearchResults(false);
                    navigateTo('product-list', { productId: product.id });
                  }}
                  className="flex items-center gap-3 p-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{product.name}</p>
                    <p className="text-[11px] text-slate-500">{product.unit}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-[#E31B23]">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              <div
                onClick={() => {
                  setShowSearchResults(false);
                  navigateTo('product-list');
                }}
                className="p-2 text-center text-xs font-bold text-[#004B93] hover:bg-blue-50/70 cursor-pointer"
              >
                View all results for "{searchQuery}" →
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Daska Area Selection Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#E31B23]" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Select Delivery Area</h3>
                  <p className="text-xs text-slate-500">Fast delivery across Daska City & Suburbs</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-600 mb-2">Select your neighborhood / sector:</p>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {DASKA_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => {
                      setSelectedAddress({
                        ...selectedAddress,
                        area,
                      });
                      setIsAddressModalOpen(false);
                    }}
                    className={`text-left text-xs p-2.5 rounded-xl border transition cursor-pointer ${
                      selectedAddress.area === area
                        ? 'border-[#004B93] bg-blue-50 text-[#004B93] font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Clock className="w-4 h-4 text-[#004B93] shrink-0" />
                <span>
                  Delivery Time: <strong>30-45 mins</strong> to all Daska locations. Free delivery on orders above Rs.{' '}
                  {storeSettings.freeDeliveryThreshold.toLocaleString()}!
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="w-full bg-[#004B93] hover:bg-[#003870] text-white font-bold py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
            >
              Confirm Delivery Location
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

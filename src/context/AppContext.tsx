import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Product,
  Category,
  CartItem,
  Order,
  StoreSettings,
  Coupon,
  Banner,
  UserProfile,
  NotificationItem,
  Address,
  OrderStatus,
} from '../types';
import { storageService } from '../services/storage';

export type ScreenName =
  | 'splash'
  | 'home'
  | 'categories'
  | 'product-list'
  | 'offers'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'order-tracking'
  | 'orders'
  | 'profile'
  | 'wishlist'
  | 'contact'
  | 'admin';

interface Toast {
  id: string;
  message: string;
  messageUrdu?: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Navigation & Screen
  currentScreen: ScreenName;
  navigateTo: (screen: ScreenName, params?: { categoryId?: string; productId?: string; orderId?: string }) => void;
  goBack: () => void;
  screenHistory: ScreenName[];

  // Language
  language: Language;
  toggleLanguage: () => void;

  // Selected state
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  confirmedOrder: Order | null;
  setConfirmedOrder: (order: Order | null) => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data
  products: Product[];
  categories: Category[];
  banners: Banner[];
  coupons: Coupon[];
  storeSettings: StoreSettings;
  userProfile: UserProfile;
  orders: Order[];
  notifications: NotificationItem[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Applied Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  deliveryFee: number;
  finalTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveWishlistToCart: (productId: string) => void;

  // Address
  selectedAddress: Address;
  setSelectedAddress: (address: Address) => void;
  saveUserAddress: (address: Address) => void;
  deleteUserAddress: (addressId: string) => void;

  // Orders
  placeOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: Address;
    deliveryInstructions?: string;
    paymentMethod: 'Cash on Delivery' | 'JazzCash / EasyPaisa' | 'Bank Transfer';
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;

  // Admin Actions
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  saveCategory: (category: Category) => void;
  updateStoreSettings: (settings: StoreSettings) => void;
  saveCoupon: (coupon: Coupon) => void;
  saveBanner: (banner: Banner) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Toast
  toast: Toast | null;
  showToast: (message: string, messageUrdu?: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [screenHistory, setScreenHistory] = useState<ScreenName[]>(['home']);
  const [language, setLanguage] = useState<Language>('en');

  // Filtering / selection
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data states from storage
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(storageService.getStoreSettings());
  const [userProfile, setUserProfile] = useState<UserProfile>(storageService.getUserProfile());
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address>(
    userProfile.addresses[0] || storageService.getUserProfile().addresses[0]
  );
  const [toast, setToast] = useState<Toast | null>(null);

  // Initialize data on mount
  useEffect(() => {
    setProducts(storageService.getProducts());
    setCategories(storageService.getCategories());
    setBanners(storageService.getBanners());
    setCoupons(storageService.getCoupons());
    setStoreSettings(storageService.getStoreSettings());
    const profile = storageService.getUserProfile();
    setUserProfile(profile);
    if (profile.addresses && profile.addresses.length > 0) {
      setSelectedAddress(profile.addresses[0]);
    }
    setOrders(storageService.getOrders());
    setNotifications(storageService.getNotifications());
    setCart(storageService.getCart());
    setWishlist(storageService.getWishlist());
  }, []);

  const showToast = (message: string, messageUrdu?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, messageUrdu, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3200);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const navigateTo = (screen: ScreenName, params?: { categoryId?: string; productId?: string; orderId?: string }) => {
    if (params?.categoryId !== undefined) setSelectedCategoryId(params.categoryId);
    if (params?.productId !== undefined) setSelectedProductId(params.productId);
    if (params?.orderId !== undefined) setTrackingOrderId(params.orderId);

    setScreenHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory((h) => h.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      setCurrentScreen('home');
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...prevCart, { product, quantity }];
      }
      storageService.saveCart(updated);
      return updated;
    });

    showToast(
      `Added ${product.name} to Cart`,
      `${product.nameUrdu || product.name} ٹوکری میں شامل کر دیا گیا`
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      let updated: CartItem[];
      if (quantity <= 0) {
        updated = prevCart.filter((item) => item.product.id !== productId);
      } else {
        updated = prevCart.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
      }
      storageService.saveCart(updated);
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const updated = prevCart.filter((item) => item.product.id !== productId);
      storageService.saveCart(updated);
      return updated;
    });
    showToast('Item removed from Cart', 'آئٹم ٹوکری سے ہٹا دیا گیا');
  };

  const clearCart = () => {
    setCart([]);
    storageService.saveCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Delivery Fee Calculation (Free if >= storeSettings.freeDeliveryThreshold)
  const deliveryFee =
    cartSubtotal >= storeSettings.freeDeliveryThreshold || cartSubtotal === 0 ? 0 : storeSettings.deliveryFee;

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.min(Math.round((cartSubtotal * appliedCoupon.discountValue) / 100), 350);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const finalTotal = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or inactive coupon code' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Order must be at least Rs. ${found.minOrderValue.toLocaleString()} to use this code`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied!`, `کوپن لاگو ہو گیا!`, 'success');
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'کوپن ہٹا دیا گیا', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      let updated: string[];
      const isAlready = prev.includes(productId);
      if (isAlready) {
        updated = prev.filter((id) => id !== productId);
        showToast('Removed from Wishlist', 'خواہشات کی فہرست سے ہٹا دیا گیا', 'info');
      } else {
        updated = [...prev, productId];
        showToast('Saved to Wishlist ❤️', 'پسندیدہ فہرست میں محفوظ کیا گیا ❤️', 'success');
      }
      storageService.saveWishlist(updated);
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveWishlistToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart(product, 1);
      toggleWishlist(productId);
    }
  };

  // Addresses
  const saveUserAddress = (address: Address) => {
    const updatedAddresses = [...userProfile.addresses];
    const idx = updatedAddresses.findIndex((a) => a.id === address.id);
    if (idx >= 0) {
      updatedAddresses[idx] = address;
    } else {
      updatedAddresses.push(address);
    }
    const updatedProfile = { ...userProfile, addresses: updatedAddresses };
    setUserProfile(updatedProfile);
    setSelectedAddress(address);
    storageService.updateUserProfile(updatedProfile);
    showToast('Address saved successfully', 'پتہ محفوظ کر لیا گیا');
  };

  const deleteUserAddress = (addressId: string) => {
    const updated = userProfile.addresses.filter((a) => a.id !== addressId);
    const updatedProfile = { ...userProfile, addresses: updated };
    setUserProfile(updatedProfile);
    if (selectedAddress.id === addressId && updated.length > 0) {
      setSelectedAddress(updated[0]);
    }
    storageService.updateUserProfile(updatedProfile);
    showToast('Address deleted', 'پتہ حذف کر دیا گیا', 'info');
  };

  // Order Placement
  const placeOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: Address;
    deliveryInstructions?: string;
    paymentMethod: 'Cash on Delivery' | 'JazzCash / EasyPaisa' | 'Bank Transfer';
  }): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SCC-${randomNum}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      deliveryAddress: orderData.deliveryAddress,
      deliveryInstructions: orderData.deliveryInstructions,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'Cash on Delivery' ? 'Unpaid' : 'Paid',
      items: cart.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        productNameUrdu: c.product.nameUrdu,
        image: c.product.image,
        price: c.product.price,
        quantity: c.quantity,
        unit: c.product.unit,
      })),
      subtotal: cartSubtotal,
      deliveryFee,
      discount: discountAmount,
      total: finalTotal,
      status: 'Pending',
      estimatedDelivery: '35-50 mins',
      statusTimeline: [
        {
          status: 'Pending',
          time: nowTime,
          note: 'Order placed by customer from Daska',
        },
      ],
    };

    const saved = storageService.createOrder(newOrder);
    setOrders((prev) => [saved, ...prev]);
    setConfirmedOrder(saved);
    setTrackingOrderId(saved.id);
    clearCart();

    // Refresh notifications
    setNotifications(storageService.getNotifications());

    return saved;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const updated = storageService.updateOrderStatus(orderId, status, note);
    if (updated) {
      setOrders(storageService.getOrders());
      setNotifications(storageService.getNotifications());
      if (confirmedOrder?.id === orderId) {
        setConfirmedOrder(updated);
      }
      showToast(`Order #${orderId} set to ${status}`, `آرڈر کی حیثیت: ${status}`);
    }
  };

  // Admin functions
  const saveProduct = (product: Product) => {
    storageService.saveProduct(product);
    setProducts(storageService.getProducts());
    showToast('Product saved successfully', 'پروڈکٹ محفوظ کر لیا گیا');
  };

  const deleteProduct = (productId: string) => {
    storageService.deleteProduct(productId);
    setProducts(storageService.getProducts());
    showToast('Product deleted', 'پروڈکٹ حذف کر دیا گیا', 'info');
  };

  const saveCategory = (category: Category) => {
    storageService.saveCategory(category);
    setCategories(storageService.getCategories());
    showToast('Category updated', 'کیٹیگری اپڈیٹ ہو گئی');
  };

  const updateStoreSettings = (settings: StoreSettings) => {
    storageService.updateStoreSettings(settings);
    setStoreSettings(settings);
    showToast('Store settings updated', 'سٹور کی ترتیبات تبدیل کر دی گئیں');
  };

  const saveCoupon = (coupon: Coupon) => {
    storageService.saveCoupon(coupon);
    setCoupons(storageService.getCoupons());
    showToast('Coupon saved', 'کوپن محفوظ ہو گیا');
  };

  const saveBanner = (banner: Banner) => {
    storageService.saveBanner(banner);
    setBanners(storageService.getBanners());
    showToast('Banner updated', 'بینر اپڈیٹ ہو گیا');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    storageService.markNotificationRead(id);
    setNotifications(storageService.getNotifications());
  };

  const markAllNotificationsAsRead = () => {
    storageService.markAllNotificationsRead();
    setNotifications(storageService.getNotifications());
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        goBack,
        screenHistory,
        language,
        toggleLanguage,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedProductId,
        setSelectedProductId,
        trackingOrderId,
        setTrackingOrderId,
        confirmedOrder,
        setConfirmedOrder,
        searchQuery,
        setSearchQuery,
        products,
        categories,
        banners,
        coupons,
        storeSettings,
        userProfile,
        orders,
        notifications,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        deliveryFee,
        finalTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        moveWishlistToCart,
        selectedAddress,
        setSelectedAddress,
        saveUserAddress,
        deleteUserAddress,
        placeOrder,
        updateOrderStatus,
        saveProduct,
        deleteProduct,
        saveCategory,
        updateStoreSettings,
        saveCoupon,
        saveBanner,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

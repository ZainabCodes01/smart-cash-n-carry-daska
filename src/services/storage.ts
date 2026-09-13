import {
  Product,
  Category,
  Order,
  StoreSettings,
  Coupon,
  Banner,
  UserProfile,
  CartItem,
  NotificationItem,
  OrderStatus,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
  INITIAL_STORE_SETTINGS,
  INITIAL_USER_ADDRESS,
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'scc_daska_products_v2',
  CATEGORIES: 'scc_daska_categories_v2',
  ORDERS: 'scc_daska_orders_v2',
  SETTINGS: 'scc_daska_settings_v2',
  COUPONS: 'scc_daska_coupons_v2',
  BANNERS: 'scc_daska_banners_v2',
  USER: 'scc_daska_user_v2',
  CART: 'scc_daska_cart_v2',
  WISHLIST: 'scc_daska_wishlist_v2',
  NOTIFICATIONS: 'scc_daska_notifications_v2',
};

// Helper for safe JSON parse
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving ${key} to storage:`, err);
  }
}

// Initial Sample Orders for demonstration
const SAMPLE_INITIAL_ORDERS: Order[] = [
  {
    id: 'SCC-4821',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    customerName: 'Sajid Hameed',
    customerPhone: '0320-8488888',
    deliveryAddress: INITIAL_USER_ADDRESS,
    deliveryInstructions: 'Please call on arrival, house is near Degree College.',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Unpaid',
    items: [
      {
        productId: 'prod-guard-rice',
        productName: 'Guard Supreme Basmati Rice',
        productNameUrdu: 'گارڈ سپریم باسمتی چاول',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        price: 1850,
        quantity: 1,
        unit: '5 kg Bag',
      },
      {
        productId: 'prod-fresh-chicken',
        productName: 'Fresh Broiler Chicken (Cleaned & Cut)',
        productNameUrdu: 'تازہ برائلر مرغی',
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80',
        price: 520,
        quantity: 2,
        unit: '1 kg',
      },
      {
        productId: 'prod-olpers-milk',
        productName: "Olper's Full Cream UHT Milk",
        productNameUrdu: 'اولپرز فل کریم دودھ',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
        price: 290,
        quantity: 3,
        unit: '1 Litre Tetra Pak',
      },
    ],
    subtotal: 3760,
    deliveryFee: 0,
    discount: 150,
    total: 3610,
    status: 'Out for Delivery',
    estimatedDelivery: '30-40 mins',
    statusTimeline: [
      {
        status: 'Pending',
        time: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: 'Order received at Smart Cash & Carry Daska',
      },
      {
        status: 'Confirmed',
        time: new Date(Date.now() - 1000 * 60 * 35).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: 'Order confirmed by store manager',
      },
      {
        status: 'Preparing',
        time: new Date(Date.now() - 1000 * 60 * 20).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: 'Grocery items packed & weighted',
      },
      {
        status: 'Out for Delivery',
        time: new Date(Date.now() - 1000 * 60 * 8).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: 'Rider Ahmad dispatched to College Road area',
      },
    ],
  },
  {
    id: 'SCC-3904',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // yesterday
    customerName: 'Sajid Hameed',
    customerPhone: '0320-8488888',
    deliveryAddress: INITIAL_USER_ADDRESS,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Paid',
    items: [
      {
        productId: 'prod-tapal-danedar',
        productName: 'Tapal Danedar Black Tea',
        productNameUrdu: 'ٹپال دانے دار چائے',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
        price: 680,
        quantity: 1,
        unit: '430g Poly Pack',
      },
      {
        productId: 'prod-farm-eggs',
        productName: 'Fresh White Farm Eggs (Dozen)',
        productNameUrdu: 'تازہ فارمی انڈے',
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',
        price: 310,
        quantity: 2,
        unit: '1 Dozen',
      },
    ],
    subtotal: 1300,
    deliveryFee: 150,
    discount: 0,
    total: 1450,
    status: 'Delivered',
    estimatedDelivery: 'Delivered Yesterday',
    statusTimeline: [
      { status: 'Pending', time: 'Yesterday 04:10 PM', note: 'Order placed' },
      { status: 'Confirmed', time: 'Yesterday 04:15 PM', note: 'Confirmed' },
      { status: 'Preparing', time: 'Yesterday 04:30 PM', note: 'Packed' },
      { status: 'Out for Delivery', time: 'Yesterday 04:45 PM', note: 'Rider on way' },
      { status: 'Delivered', time: 'Yesterday 05:12 PM', note: 'Delivered & Cash Collected' },
    ],
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Order Out for Delivery! 🚚',
    message: 'Your order #SCC-4821 is out for delivery. Rider is heading to College Road, Daska.',
    timestamp: '8 mins ago',
    read: false,
    type: 'order',
  },
  {
    id: 'notif-2',
    title: 'Super Bachat Deals are Live! 🛒',
    message: 'Up to 30% discount on cooking oil, Basmati rice, and fresh chicken today at Smart Cash & Carry Daska.',
    timestamp: '2 hours ago',
    read: false,
    type: 'deal',
  },
  {
    id: 'notif-3',
    title: 'Welcome to Smart Cash & Carry! 🌟',
    message: 'Use coupon code WELCOME for Rs. 100 off your first supermarket delivery order.',
    timestamp: '1 day ago',
    read: true,
    type: 'system',
  },
];

export const storageService = {
  // Products
  getProducts(): Product[] {
    return safeGet<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    safeSet(STORAGE_KEYS.PRODUCTS, products);
  },
  deleteProduct(productId: string): void {
    const products = this.getProducts().filter((p) => p.id !== productId);
    safeSet(STORAGE_KEYS.PRODUCTS, products);
  },

  // Categories
  getCategories(): Category[] {
    return safeGet<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },
  saveCategory(category: Category): void {
    const categories = this.getCategories();
    const idx = categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      categories[idx] = category;
    } else {
      categories.push(category);
    }
    safeSet(STORAGE_KEYS.CATEGORIES, categories);
  },

  // Orders
  getOrders(): Order[] {
    return safeGet<Order[]>(STORAGE_KEYS.ORDERS, SAMPLE_INITIAL_ORDERS);
  },
  createOrder(order: Order): Order {
    const orders = this.getOrders();
    orders.unshift(order);
    safeSet(STORAGE_KEYS.ORDERS, orders);

    // Also add a notification
    const notifications = this.getNotifications();
    notifications.unshift({
      id: 'notif-' + Date.now(),
      title: `Order Placed: ${order.id} 🎉`,
      message: `Your grocery order of Rs. ${order.total.toLocaleString()} has been placed successfully.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
    });
    safeSet(STORAGE_KEYS.NOTIFICATIONS, notifications);

    return order;
  },
  updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | null {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.status = status;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    order.statusTimeline.push({
      status,
      time: nowTime,
      note: note || `Order status updated to ${status}`,
    });

    safeSet(STORAGE_KEYS.ORDERS, orders);

    // Also push notification
    const notifications = this.getNotifications();
    notifications.unshift({
      id: 'notif-' + Date.now(),
      title: `Order Update: ${order.id} - ${status}`,
      message: note || `Your order status is now ${status}.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
    });
    safeSet(STORAGE_KEYS.NOTIFICATIONS, notifications);

    return order;
  },

  // Settings
  getStoreSettings(): StoreSettings {
    const saved = safeGet<Partial<StoreSettings>>(STORAGE_KEYS.SETTINGS, {});
    return {
      ...INITIAL_STORE_SETTINGS,
      ...saved,
      logoUrl: saved.logoUrl || INITIAL_STORE_SETTINGS.logoUrl,
    };
  },
  updateStoreSettings(settings: StoreSettings): void {
    safeSet(STORAGE_KEYS.SETTINGS, settings);
  },

  // Coupons
  getCoupons(): Coupon[] {
    return safeGet<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  },
  saveCoupon(coupon: Coupon): void {
    const coupons = this.getCoupons();
    const idx = coupons.findIndex((c) => c.id === coupon.id);
    if (idx >= 0) {
      coupons[idx] = coupon;
    } else {
      coupons.unshift(coupon);
    }
    safeSet(STORAGE_KEYS.COUPONS, coupons);
  },

  // Banners
  getBanners(): Banner[] {
    return safeGet<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
  },
  saveBanner(banner: Banner): void {
    const banners = this.getBanners();
    const idx = banners.findIndex((b) => b.id === banner.id);
    if (idx >= 0) {
      banners[idx] = banner;
    } else {
      banners.push(banner);
    }
    safeSet(STORAGE_KEYS.BANNERS, banners);
  },

  // User Profile
  getUserProfile(): UserProfile {
    return safeGet<UserProfile>(STORAGE_KEYS.USER, {
      id: 'usr-1',
      name: 'Sajid Hameed',
      phone: '0320-8488888',
      email: 'usman.daska@gmail.com',
      addresses: [INITIAL_USER_ADDRESS],
    });
  },
  updateUserProfile(profile: UserProfile): void {
    safeSet(STORAGE_KEYS.USER, profile);
  },

  // Cart
  getCart(): CartItem[] {
    return safeGet<CartItem[]>(STORAGE_KEYS.CART, []);
  },
  saveCart(cart: CartItem[]): void {
    safeSet(STORAGE_KEYS.CART, cart);
  },

  // Wishlist
  getWishlist(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.WISHLIST, ['prod-guard-rice', 'prod-tapal-danedar']);
  },
  saveWishlist(productIds: string[]): void {
    safeSet(STORAGE_KEYS.WISHLIST, productIds);
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    return safeGet<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
  markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const item = list.find((n) => n.id === id);
    if (item) {
      item.read = true;
      safeSet(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  },
  markAllNotificationsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    safeSet(STORAGE_KEYS.NOTIFICATIONS, list);
  },
};

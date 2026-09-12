export type Language = 'en' | 'ur';

export interface Category {
  id: string;
  name: string;
  nameUrdu: string;
  icon: string;
  image: string;
  itemCount?: number;
}

export interface Product {
  id: string;
  name: string;
  nameUrdu: string;
  categoryId: string;
  price: number; // in PKR
  originalPrice?: number; // for discount strike-through
  unit: string; // e.g., '1 kg', '500g', '1 Litre', 'Pack of 6'
  stock: number;
  image: string;
  description: string;
  descriptionUrdu?: string;
  isFlashDeal?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isBogo?: boolean; // Buy 1 Get 1
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Delivery'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productNameUrdu?: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface Address {
  id: string;
  label: string; // 'Home', 'Shop', 'Office'
  receiverName: string;
  phone: string;
  streetAddress: string;
  area: string; // 'College Road', 'Sambrial Road', 'Jalalpur Ghumman Road', etc.
  landmark?: string;
  city: string; // 'Daska'
  isDefault?: boolean;
}

export interface Order {
  id: string; // e.g., 'SCC-1024'
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: Address;
  deliveryInstructions?: string;
  paymentMethod: 'Cash on Delivery' | 'JazzCash / EasyPaisa' | 'Bank Transfer';
  paymentStatus: 'Unpaid' | 'Paid';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  estimatedDelivery: string;
  statusTimeline: {
    status: OrderStatus;
    time: string;
    note: string;
  }[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  titleUrdu: string;
  subtitle: string;
  badge: string;
  bgColor: string;
  image: string;
  linkCategoryId?: string;
}

export interface StoreSettings {
  storeName: string;
  storeNameUrdu: string;
  logoUrl?: string;
  phone: string;
  whatsapp: string;
  address: string;
  addressUrdu: string;
  openingTime: string; // '09:00 AM'
  closingTime: string; // '11:00 PM'
  isCurrentlyOpen: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  emergencyNotice?: string;
  rating: number;
  reviewCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: Address[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'deal' | 'system';
}

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Category, Coupon, StoreSettings, OrderStatus, Order } from '../../types';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  TrendingUp,
  AlertCircle,
  Phone,
  Search,
  ChevronLeft,
  X,
  Layers,
  Users,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    products,
    categories,
    coupons,
    storeSettings,
    updateOrderStatus,
    saveProduct,
    deleteProduct,
    saveCategory,
    saveCoupon,
    updateStoreSettings,
    navigateTo,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'categories' | 'coupons' | 'settings'>('analytics');

  // Orders filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameUrdu, setNewCatNameUrdu] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  // Coupon modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState(10);
  const [couponMinOrder, setCouponMinOrder] = useState(1000);
  const [couponDesc, setCouponDesc] = useState('');

  // Store settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...storeSettings });

  // Product Form state
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    nameUrdu: '',
    categoryId: categories[0]?.id || 'cat-grocery',
    price: 100,
    originalPrice: 120,
    unit: '1 kg',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
    description: '',
    descriptionUrdu: '',
    isFlashDeal: false,
    isBestSeller: false,
    isNewArrival: false,
    isBogo: false,
  });

  const [productSearch, setProductSearch] = useState('');

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const totalDeliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const lowStockProducts = products.filter((p) => p.stock < 15);

  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter === 'All') return true;
    return order.status === orderStatusFilter;
  });

  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.nameUrdu && p.nameUrdu.includes(q)) ||
      p.unit.toLowerCase().includes(q)
    );
  });

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      nameUrdu: '',
      categoryId: categories[0]?.id || 'cat-grocery',
      price: 250,
      originalPrice: 280,
      unit: '1 kg',
      stock: 40,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
      description: 'High quality fresh supermarket grocery item from Daska branch.',
      descriptionUrdu: '',
      isFlashDeal: false,
      isBestSeller: false,
      isNewArrival: true,
      isBogo: false,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    const newProd: Product = {
      id: editingProduct?.id || 'prod-' + Date.now(),
      name: productForm.name || 'New Product',
      nameUrdu: productForm.nameUrdu || '',
      categoryId: productForm.categoryId || categories[0]?.id || 'cat-grocery',
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      unit: productForm.unit || '1 kg',
      stock: Number(productForm.stock || 50),
      image: productForm.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
      description: productForm.description || '',
      descriptionUrdu: productForm.descriptionUrdu || '',
      isFlashDeal: Boolean(productForm.isFlashDeal),
      isBestSeller: Boolean(productForm.isBestSeller),
      isNewArrival: Boolean(productForm.isNewArrival),
      isBogo: Boolean(productForm.isBogo),
      rating: editingProduct?.rating || 4.8,
      reviewCount: editingProduct?.reviewCount || 10,
    };

    saveProduct(newProd);
    setIsProductModalOpen(false);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: newCatName,
      nameUrdu: newCatNameUrdu || newCatName,
      icon: 'ShoppingBag',
      image: newCatImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
      itemCount: 0,
    };

    saveCategory(newCat);
    setIsCategoryModalOpen(false);
    setNewCatName('');
    setNewCatNameUrdu('');
    setNewCatImage('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(settingsForm);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const newCoup: Coupon = {
      id: 'coup-' + Date.now(),
      code: couponCode.toUpperCase().trim(),
      discountType: couponType,
      discountValue: Number(couponValue),
      minOrderValue: Number(couponMinOrder),
      description: couponDesc || `${couponValue}${couponType === 'percentage' ? '%' : ' PKR'} off`,
      isActive: true,
    };

    saveCoupon(newCoup);
    setIsCouponModalOpen(false);
    setCouponCode('');
    setCouponDesc('');
  };

  const adminStatuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready for Delivery',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="pb-28 px-4 pt-3 space-y-5 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer"
            title="Return to store"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg">Smart Cash & Carry Manager</h1>
              <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded uppercase">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-400">Daska Branch Store Operations & POS Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20 font-bold">
            Store Open: {storeSettings.openingTime} – {storeSettings.closingTime}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        {[
          { id: 'analytics', label: 'Overview', icon: LayoutDashboard },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'products', label: `Catalog (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'coupons', label: 'Coupons', icon: Tag },
          { id: 'settings', label: 'Store Timings & Fee', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shrink-0 transition cursor-pointer ${
                isActive
                  ? 'bg-[#004B93] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Gross Revenue
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Rs. {totalRevenue.toLocaleString()}
              </p>
              <span className="text-[11px] text-[#004B93] font-bold mt-1 block">
                {orders.length} total orders placed
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Active Deliveries
              </span>
              <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
                {activeOrdersCount}
              </p>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                Dispatched / Packing in Daska
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Delivered Successfully
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#004B93] mt-1">
                {totalDeliveredOrders}
              </p>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                Completed & cash collected
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Low Stock Alerts
              </span>
              <p className="text-xl sm:text-2xl font-black text-red-600 mt-1">
                {lowStockProducts.length}
              </p>
              <span className="text-[11px] text-red-500 font-bold mt-1 block">
                Below 15 units in warehouse
              </span>
            </div>
          </div>

          {/* Quick Order Actions & Low Stock Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#004B93] hover:text-[#003870]"
                >
                  View All Orders →
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-black text-slate-900 font-mono">#{order.id}</span>
                      <p className="text-slate-600 font-medium">
                        {order.customerName} • {order.deliveryAddress.area}
                      </p>
                      <p className="text-[10px] text-slate-400">{order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900 block">
                        Rs. {order.total.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Items */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <h3 className="font-extrabold text-sm text-slate-900">Inventory Alert (Restock)</h3>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-bold text-[#004B93] hover:text-[#003870]"
                >
                  Manage Products →
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-red-50/50 border border-red-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-9 h-9 object-contain rounded-lg bg-white border border-slate-100 shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-slate-500">{p.unit}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        {p.stock} in stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Supermarket Delivery Orders</h2>
              <p className="text-xs text-slate-500">
                Update rider status, check Daska delivery address and contact customers
              </p>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full">
              {['All', ...adminStatuses].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderStatusFilter(status)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 transition cursor-pointer ${
                    orderStatusFilter === status
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3 bg-slate-50/40 hover:bg-slate-50 transition"
              >
                {/* Top row: ID, time, total, current status */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-black text-sm text-slate-900 font-mono">
                      #{order.id}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">
                      Rs. {order.total.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Customer Details & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-bold block">Customer:</span>
                    <p className="font-extrabold text-slate-900">{order.customerName}</p>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="text-[#004B93] font-bold flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{order.customerPhone}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Daska Address:</span>
                    <p className="font-semibold text-slate-800">
                      {order.deliveryAddress.streetAddress}, {order.deliveryAddress.area}, Daska
                    </p>
                    {order.deliveryInstructions && (
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Note: {order.deliveryInstructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {order.items.map((i, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-medium"
                    >
                      {i.quantity}x {i.productName} ({i.unit})
                    </span>
                  ))}
                </div>

                {/* Order Status Controller Dropdown */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <span className="text-xs font-bold text-slate-600">Update Order Status:</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-white text-xs font-bold text-slate-900 border border-slate-300 rounded-xl px-3 py-1.5 outline-hidden cursor-pointer"
                    >
                      {adminStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT CATALOG */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Product Inventory & Prices</h2>
              <p className="text-xs text-slate-500">
                Add, edit prices, set discounts, and update stock units
              </p>
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="bg-[#004B93] hover:bg-[#003870] active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Search bar for products */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products by title, urdu name or unit..."
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white focus:border-[#004B93]"
            />
          </div>

          {/* Table of Products */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Price (PKR)</th>
                  <th className="py-2.5 px-3">Original</th>
                  <th className="py-2.5 px-3">Stock</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-extrabold text-slate-900 truncate max-w-xs">{p.name}</p>
                            <span className="text-[11px] text-slate-400 font-semibold">{p.unit}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-600">
                        {cat?.name || 'General'}
                      </td>
                      <td className="py-2.5 px-3 font-black text-slate-900">
                        Rs. {p.price.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {p.originalPrice ? `Rs. ${p.originalPrice.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`font-extrabold px-2 py-0.5 rounded text-[11px] ${
                            p.stock < 15
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-50 text-[#004B93]'
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORY MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Supermarket Categories</h2>
              <p className="text-xs text-slate-500">Organize store aisles and sections</p>
            </div>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="bg-[#004B93] hover:bg-[#003870] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((c) => {
              const count = products.filter((p) => p.categoryId === c.id).length;
              return (
                <div
                  key={c.id}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-20 object-cover rounded-xl"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900">{c.name}</h3>
                    <p className="text-[11px] text-slate-500 font-urdu">{c.nameUrdu}</p>
                    <span className="text-[10px] text-[#004B93] font-bold">
                      {count} items in stock
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Promo Vouchers & Bachat Codes</h2>
              <p className="text-xs text-slate-500">Active discount coupons for Daska customers</p>
            </div>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="bg-[#004B93] hover:bg-[#003870] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coupons.map((cp) => (
              <div
                key={cp.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-base text-[#004B93] font-mono">{cp.code}</span>
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                      cp.isActive ? 'bg-blue-100 text-[#004B93]' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cp.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-slate-700 font-medium">{cp.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Min Order: Rs. {cp.minOrderValue.toLocaleString()}</span>
                  <button
                    onClick={() => saveCoupon({ ...cp, isActive: !cp.isActive })}
                    className="font-bold text-[#004B93] hover:text-[#003870] cursor-pointer"
                  >
                    {cp.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: STORE TIMINGS & DELIVERY SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="font-extrabold text-base text-slate-900">
              Store Timings & Delivery Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Adjust business hours, delivery fees, and emergency announcement messages
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Store Opening Time *
              </label>
              <input
                type="text"
                value={settingsForm.openingTime}
                onChange={(e) => setSettingsForm({ ...settingsForm, openingTime: e.target.value })}
                placeholder="e.g. 08:30 AM"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Regular Closing Time (User specified ~11:00 PM) *
              </label>
              <input
                type="text"
                value={settingsForm.closingTime}
                onChange={(e) => setSettingsForm({ ...settingsForm, closingTime: e.target.value })}
                placeholder="e.g. 11:00 PM"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Standard Daska Delivery Fee (PKR) *
              </label>
              <input
                type="number"
                value={settingsForm.deliveryFee}
                onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Free Delivery Order Threshold (PKR) *
              </label>
              <input
                type="number"
                value={settingsForm.freeDeliveryThreshold}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                Emergency / Prominent Announcement Banner Message
              </label>
              <input
                type="text"
                value={settingsForm.emergencyNotice || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, emergencyNotice: e.target.value })}
                placeholder="e.g. ⚡ Express Delivery active across Daska City! Average delivery time: 35-50 mins."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Store Official Phone</label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Store WhatsApp Number</label>
              <input
                type="text"
                value={settingsForm.whatsapp}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Store Logo Image URL</label>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={settingsForm.logoUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                />
                {settingsForm.logoUrl && (
                  <div className="h-10 w-24 bg-white rounded-lg p-1 border border-slate-200 flex items-center justify-center shrink-0">
                    <img
                      src={settingsForm.logoUrl}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-[#004B93] hover:bg-[#003870] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-xs transition cursor-pointer"
            >
              Save Store Settings
            </button>
          </div>
        </form>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingProduct ? 'Edit Supermarket Product' : 'Add New Grocery Item'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Product Title (English) *</label>
                  <input
                    type="text"
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Guard Supreme Basmati Rice"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Product Title (Urdu)</label>
                  <input
                    type="text"
                    value={productForm.nameUrdu || ''}
                    onChange={(e) => setProductForm({ ...productForm, nameUrdu: e.target.value })}
                    placeholder="e.g. گارڈ سپریم باسمتی چاول"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-urdu"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit / Size *</label>
                  <input
                    type="text"
                    value={productForm.unit || ''}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="e.g. 1 kg, 500g, 1 Litre"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sale Price (PKR) *</label>
                  <input
                    type="number"
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    placeholder="e.g. 1850"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Price (Discount Strikethrough)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice || ''}
                    onChange={(e) =>
                      setProductForm({ ...productForm, originalPrice: Number(e.target.value) })
                    }
                    placeholder="e.g. 2050"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    value={productForm.stock || 0}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productForm.image || ''}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-[11px]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    value={productForm.description || ''}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                {/* Badges toggles */}
                <div className="col-span-2 flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFlashDeal || false}
                      onChange={(e) => setProductForm({ ...productForm, isFlashDeal: e.target.checked })}
                      className="accent-[#004B93]"
                    />
                    <span>Flash Deal</span>
                  </label>

                  <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isBestSeller || false}
                      onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                      className="accent-[#004B93]"
                    />
                    <span>Best Seller</span>
                  </label>

                  <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isBogo || false}
                      onChange={(e) => setProductForm({ ...productForm, isBogo: e.target.checked })}
                      className="accent-[#004B93]"
                    />
                    <span>Buy 1 Get 1 (BOGO)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#004B93] hover:bg-[#003870] text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl">
            <h3 className="font-extrabold text-sm text-slate-900">Add New Store Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-2.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">Category Name</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Frozen Bakery"
                  className="w-full p-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">Category Urdu</label>
                <input
                  type="text"
                  value={newCatNameUrdu}
                  onChange={(e) => setNewCatNameUrdu(e.target.value)}
                  placeholder="e.g. فریزڈ بیکری"
                  className="w-full p-2 border border-slate-200 rounded-xl font-urdu"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">Image URL</label>
                <input
                  type="url"
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#004B93] hover:bg-[#003870] text-white font-bold rounded-xl transition cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl">
            <h3 className="font-extrabold text-sm text-slate-900">Create New Promo Voucher</h3>
            <form onSubmit={handleSaveCoupon} className="space-y-2.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. RAMADAN20"
                  className="w-full p-2 border border-slate-200 rounded-xl uppercase font-mono font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Discount Type</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed PKR (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Discount Value</label>
                  <input
                    type="number"
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">Minimum Order (PKR)</label>
                <input
                  type="number"
                  value={couponMinOrder}
                  onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">Description</label>
                <input
                  type="text"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  placeholder="e.g. 15% discount on Daska grocery orders"
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#004B93] hover:bg-[#003870] text-white font-bold rounded-xl transition cursor-pointer"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

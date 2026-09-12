import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  ClipboardList,
  RotateCcw,
  Truck,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  PackageCheck,
  ShoppingBag,
} from 'lucide-react';

export const MyOrdersScreen: React.FC = () => {
  const { orders, navigateTo, addToCart, products, language } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const activeOrders = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  );
  const completedOrders = orders.filter(
    (o) => o.status === 'Delivered' || o.status === 'Cancelled'
  );

  const displayedOrders = activeTab === 'active' ? activeOrders : completedOrders;

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      if (p) {
        addToCart(p, item.quantity);
      }
    });
    navigateTo('cart');
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-4 max-w-2xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {language === 'ur' ? 'میرے آرڈرز' : 'My Orders'}
          </h1>
          <p className="text-xs text-slate-500">
            Track your supermarket deliveries from Daska Branch
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
          {orders.length} Total Orders
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('active')}
          className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'active'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Orders ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Order History ({completedOrders.length})
        </button>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">
            No {activeTab} orders found
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {activeTab === 'active'
              ? "You don't have any active deliveries right now."
              : "You haven't completed any previous orders yet."}
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedOrders.map((order) => {
            const isDelivered = order.status === 'Delivered';
            const isCancelled = order.status === 'Cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-sm transition space-y-3"
              >
                {/* Header: ID, Date, Status */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900 font-mono tracking-wide">
                      #{order.id}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
                      isDelivered
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isCancelled
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-900 border-amber-200 animate-pulse'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Thumbnails preview */}
                <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center"
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                      +{order.items.length - 4}
                    </span>
                  )}
                </div>

                {/* Info and Address */}
                <div className="text-xs text-slate-600 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <div className="truncate pr-2">
                    <span className="text-slate-400 block text-[10px]">Destination</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {order.deliveryAddress.area}, Daska
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-slate-400 block text-[10px]">Total Amount</span>
                    <span className="font-black text-slate-900 text-sm">
                      Rs. {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions: Track & Reorder */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => navigateTo('order-tracking', { orderId: order.id })}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Order</span>
                  </button>

                  <button
                    onClick={() => handleReorder(order)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder All</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

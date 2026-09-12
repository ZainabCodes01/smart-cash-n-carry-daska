import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle,
  Truck,
  ArrowRight,
  Clock,
  MapPin,
  ShoppingBag,
  PhoneCall,
  Share2,
} from 'lucide-react';

export const OrderConfirmationScreen: React.FC = () => {
  const { confirmedOrder, orders, trackingOrderId, navigateTo, storeSettings } = useApp();

  const order =
    confirmedOrder ||
    orders.find((o) => o.id === trackingOrderId) ||
    orders[0];

  if (!order) {
    return (
      <div className="pb-24 px-4 pt-12 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-lg font-bold text-slate-800">No active order found</h2>
        <button
          onClick={() => navigateTo('home')}
          className="bg-emerald-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="pb-28 px-4 pt-4 space-y-5 max-w-2xl mx-auto">
      {/* Success Badge Banner */}
      <div className="bg-gradient-to-br from-[#004B93] to-[#003366] text-white rounded-3xl p-6 text-center space-y-3 shadow-lg shadow-blue-900/20 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-white text-[#004B93] flex items-center justify-center mx-auto shadow-md animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black">Order Placed Successfully!</h1>
        <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto">
          Thank you for shopping at <strong>Smart Cash & Carry Daska Branch</strong>. We have received your order and our staff is preparing your groceries.
        </p>

        <div className="inline-flex items-center gap-2 bg-blue-950/60 px-4 py-1.5 rounded-full text-xs font-bold border border-white/20">
          <span>Order ID:</span>
          <span className="text-amber-300 font-mono tracking-wider">{order.id}</span>
        </div>
      </div>

      {/* Quick Specs: Estimated Time, Status, Payment */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 text-center shadow-xs">
          <Clock className="w-4 h-4 text-[#004B93] mx-auto mb-1" />
          <p className="text-[10px] text-slate-400 font-bold uppercase">Delivery</p>
          <p className="text-xs font-black text-slate-800">{order.estimatedDelivery}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 text-center shadow-xs">
          <Truck className="w-4 h-4 text-amber-500 mx-auto mb-1" />
          <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
          <p className="text-xs font-black text-[#004B93]">{order.status}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 text-center shadow-xs">
          <ShoppingBag className="w-4 h-4 text-[#E31B23] mx-auto mb-1" />
          <p className="text-[10px] text-slate-400 font-bold uppercase">Total</p>
          <p className="text-xs font-black text-slate-900">Rs. {order.total.toLocaleString()}</p>
        </div>
      </div>

      {/* Ordered Items Summary */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Ordered Items ({order.items.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 shrink-0"
                />
                <div className="truncate">
                  <p className="font-bold text-slate-900 truncate">{item.productName}</p>
                  <p className="text-[11px] text-slate-500">
                    {item.quantity} x Rs. {item.price.toLocaleString()} ({item.unit})
                  </p>
                </div>
              </div>
              <span className="font-extrabold text-slate-900 shrink-0">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Bill Total Breakdown */}
        <div className="border-t border-slate-100 pt-3 space-y-1 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span>Rs. {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery:</span>
            <span>{order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#E31B23] font-bold">
              <span>Discount:</span>
              <span>- Rs. {order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
            <span>Total Payable:</span>
            <span>Rs. {order.total.toLocaleString()} ({order.paymentMethod})</span>
          </div>
        </div>
      </div>

      {/* Delivery Address Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
          <MapPin className="w-4 h-4 text-[#004B93]" />
          <span>Delivering to:</span>
        </div>
        <p className="text-xs font-bold text-slate-800">
          {order.customerName} ({order.customerPhone})
        </p>
        <p className="text-xs text-slate-600">
          {order.deliveryAddress.streetAddress}, {order.deliveryAddress.area}, Daska
        </p>
        {order.deliveryAddress.landmark && (
          <p className="text-[11px] text-slate-500">
            Landmark: {order.deliveryAddress.landmark}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          id="btn-track-order"
          onClick={() => navigateTo('order-tracking', { orderId: order.id })}
          className="w-full bg-[#004B93] hover:bg-[#003870] active:scale-98 text-white font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-900/20 transition cursor-pointer"
        >
          <Truck className="w-4 h-4" />
          <span>Track Order Status Live</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigateTo('orders')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

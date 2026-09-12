import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import {
  PackageCheck,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  PhoneCall,
  MessageCircle,
  MapPin,
  ChevronLeft,
  Store,
} from 'lucide-react';

const ORDER_STAGES: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'Pending', label: 'Order Placed', desc: 'Order received at Daska Branch' },
  { status: 'Confirmed', label: 'Confirmed', desc: 'Verified by store manager' },
  { status: 'Preparing', label: 'Preparing', desc: 'Groceries weighed & packed' },
  { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider dispatched to your address' },
  { status: 'Delivered', label: 'Delivered', desc: 'Safely delivered to your doorstep' },
];

export const OrderTrackingScreen: React.FC = () => {
  const { trackingOrderId, orders, navigateTo, storeSettings, language } = useApp();

  const order = orders.find((o) => o.id === trackingOrderId) || orders[0];

  if (!order) {
    return (
      <div className="pb-24 px-4 pt-12 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-lg font-bold text-slate-800">No order selected</h2>
        <button
          onClick={() => navigateTo('orders')}
          className="bg-emerald-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs"
        >
          View My Orders
        </button>
      </div>
    );
  }

  // Determine active step index
  const stageIndex = ORDER_STAGES.findIndex((s) => s.status === order.status);
  const currentStep = stageIndex >= 0 ? stageIndex : 0;

  return (
    <div className="pb-28 px-4 pt-3 space-y-4 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('orders')}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>My Orders</span>
        </button>
        <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
          Live Tracking
        </span>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
              Order #{order.id}
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-2">
              {order.status === 'Delivered'
                ? 'Order Delivered! 🎉'
                : order.status === 'Out for Delivery'
                ? 'Rider is on the Way! 🛵'
                : 'Preparing Your Order 🛒'}
            </h1>
            <p className="text-xs text-emerald-200 mt-1">
              Estimated Arrival: <strong>{order.estimatedDelivery}</strong>
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Truck className="w-6 h-6 text-emerald-300 animate-pulse" />
          </div>
        </div>

        {/* Address tag */}
        <div className="bg-white/10 rounded-2xl p-3 text-xs border border-white/15 flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-emerald-200 block">Delivery Destination</span>
            <span className="font-semibold text-white truncate block">
              {order.deliveryAddress.streetAddress}, {order.deliveryAddress.area}, Daska
            </span>
          </div>
        </div>
      </div>

      {/* Visual Timeline Steps */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Order Status Timeline
        </h2>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {ORDER_STAGES.map((stage, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={stage.status} className="relative flex items-start gap-3.5">
                {/* Node indicator */}
                <div
                  className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ring-4 ring-white ${
                    isCompleted
                      ? 'bg-emerald-600 shadow-sm'
                      : 'bg-slate-200 text-slate-400'
                  } ${isCurrent ? 'animate-bounce ring-emerald-200' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-xs sm:text-sm font-extrabold ${
                        isCurrent
                          ? 'text-emerald-700 font-black'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </h3>
                    {isCurrent && (
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Store & Rider Contact Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
                {storeSettings.storeName}
              </h3>
              <p className="text-[11px] text-slate-500">College Rd, Daska Branch Dispatch</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={`tel:${storeSettings.phone}`}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call Store</span>
          </a>
          <a
            href={`https://wa.me/${storeSettings.whatsapp.replace('+', '')}?text=Hello%20Smart%20Cash%20Carry%20Daska,%20I%20am%20inquiring%20about%20Order%20${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Order Items Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Package Contents
          </h2>
          <span className="text-xs font-bold text-slate-800">
            Rs. {order.total.toLocaleString()} ({order.paymentMethod})
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1 text-xs">
          {order.items.map((item, i) => (
            <div key={i} className="py-2 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-emerald-700">{item.quantity}x</span>
                <span className="text-slate-800 font-medium truncate">{item.productName}</span>
              </div>
              <span className="font-bold text-slate-900 shrink-0">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';

export const CartScreen: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    finalTotal,
    navigateTo,
    storeSettings,
    coupons,
    language,
  } = useApp();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponCodeInput;
    if (!code.trim()) return;
    const res = applyCoupon(code);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponCodeInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pb-24 px-4 pt-8 text-center max-w-md mx-auto space-y-4">
        <div className="w-24 h-24 rounded-3xl bg-blue-50 text-[#004B93] flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Looks like you haven't added any groceries to your cart yet. Explore our supermarket deals in Daska!
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="bg-[#004B93] hover:bg-[#003870] text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition shadow-md shadow-blue-900/20 active:scale-95 cursor-pointer"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const freeDeliveryProgress = Math.min(
    100,
    (cartSubtotal / storeSettings.freeDeliveryThreshold) * 100
  );
  const remainingForFreeDelivery = Math.max(0, storeSettings.freeDeliveryThreshold - cartSubtotal);

  return (
    <div className="pb-28 px-4 pt-3 space-y-4 max-w-3xl mx-auto">
      {/* Title & Clear All */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {language === 'ur' ? 'آپ کی ٹوکری' : 'Shopping Cart'}
          </h1>
          <p className="text-xs text-slate-500">
            {cart.reduce((sum, i) => sum + i.quantity, 0)} items from Smart Cash & Carry Daska
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-[#E31B23] hover:text-[#c9141b] flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Free Delivery Goal Bar */}
      <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-3.5 space-y-2 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#004B93] flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#E31B23]" />
            {remainingForFreeDelivery === 0 ? (
              <span className="text-[#004B93] font-extrabold">🎉 You unlocked FREE Delivery!</span>
            ) : (
              <span>
                Add <strong>Rs. {remainingForFreeDelivery.toLocaleString()}</strong> more for{' '}
                <strong className="text-[#E31B23]">FREE Delivery</strong>
              </span>
            )}
          </span>
          <span className="font-bold text-[#004B93]">{Math.round(freeDeliveryProgress)}%</span>
        </div>
        <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#004B93] h-full rounded-full transition-all duration-300"
            style={{ width: `${freeDeliveryProgress}%` }}
          />
        </div>
      </div>

      {/* Cart Items List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {cart.map(({ product, quantity }) => (
          <div key={product.id} className="p-3.5 sm:p-4 flex items-center gap-3.5">
            {/* Thumbnail */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 shrink-0 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 leading-snug">
                {product.name}
              </h3>
              {product.nameUrdu && (
                <p className="text-[11px] text-slate-500 font-urdu truncate mt-0.5">
                  {product.nameUrdu}
                </p>
              )}
              <span className="inline-block text-[11px] font-semibold text-[#004B93] bg-blue-50 px-1.5 py-0.5 rounded mt-1">
                {product.unit}
              </span>
              <div className="text-xs font-black text-slate-900 mt-1">
                Rs. {product.price.toLocaleString()}
                <span className="text-slate-400 font-normal ml-1">each</span>
              </div>
            </div>

            {/* Quantity Stepper & Subtotal */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="flex items-center border border-blue-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-blue-100 cursor-pointer"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-slate-900 min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-blue-100 cursor-pointer"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Rs. {(product.price * quantity).toLocaleString()}
                </span>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-slate-300 hover:text-[#E31B23] transition cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Coupon Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Tag className="w-4 h-4 text-[#004B93]" />
          <span>Apply Promo Voucher</span>
        </div>

        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#004B93]" />
              <div>
                <span className="font-extrabold text-[#004B93] text-xs tracking-wider">
                  {appliedCoupon.code}
                </span>
                <p className="text-[11px] text-slate-600">{appliedCoupon.description}</p>
              </div>
            </div>
            <button
              onClick={removeCoupon}
              className="text-xs font-bold text-[#E31B23] hover:text-[#c9141b] px-2 py-1 cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                placeholder="Enter promo code (e.g. DASKA10)"
                className="flex-1 bg-slate-50 uppercase text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#004B93] focus:bg-white outline-hidden"
              />
              <button
                onClick={() => handleApplyCoupon()}
                className="bg-[#004B93] hover:bg-[#003870] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-[11px] text-[#E31B23] mt-1.5 font-medium">{couponError}</p>}

            {/* Quick Available Vouchers list */}
            <div className="pt-2 flex flex-wrap gap-2">
              {coupons
                .filter((c) => c.isActive)
                .map((cp) => (
                  <button
                    key={cp.id}
                    onClick={() => handleApplyCoupon(cp.code)}
                    className="text-[10px] font-bold bg-blue-50/70 hover:bg-blue-100 text-[#004B93] border border-blue-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <span>{cp.code}</span>
                    <span className="text-[#E31B23] font-semibold">
                      ({cp.discountType === 'percentage' ? `${cp.discountValue}% off` : `Rs. ${cp.discountValue}`})
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Bill Breakdown Summary */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Bill Summary</h3>

        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Items Subtotal</span>
            <span className="font-bold text-slate-900">Rs. {cartSubtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Delivery Fee (Daska Area)</span>
            <span className="font-bold text-slate-900">
              {deliveryFee === 0 ? (
                <span className="text-[#004B93] font-bold">FREE</span>
              ) : (
                `Rs. ${deliveryFee}`
              )}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-[#E31B23] font-bold">
              <span>Coupon Discount ({appliedCoupon?.code})</span>
              <span>- Rs. {discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="border-t border-slate-100 pt-2 flex justify-between items-baseline">
            <span className="text-sm sm:text-base font-extrabold text-slate-900">Final Total</span>
            <span className="text-lg sm:text-2xl font-black text-slate-900">
              Rs. {finalTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Proceed to Checkout CTA */}
      <div className="pt-2">
        <button
          id="btn-proceed-checkout"
          onClick={() => navigateTo('checkout')}
          className="w-full bg-[#E31B23] hover:bg-[#c9141b] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 text-base active:scale-98 transition cursor-pointer"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#004B93]" />
          <span>Cash on Delivery available on all Daska orders</span>
        </p>
      </div>
    </div>
  );
};

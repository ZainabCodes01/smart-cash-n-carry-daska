import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DASKA_AREAS } from '../../data/initialData';
import {
  MapPin,
  Phone,
  User,
  Truck,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const CheckoutScreen: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    finalTotal,
    selectedAddress,
    userProfile,
    placeOrder,
    navigateTo,
    storeSettings,
    language,
  } = useApp();

  // Form states initialized from user address & profile
  const [fullName, setFullName] = useState(userProfile.name || 'Sajid Hameed');
  const [phone, setPhone] = useState(userProfile.phone || '0320-8488888');
  const [streetAddress, setStreetAddress] = useState(
    selectedAddress.streetAddress || 'House # 42, St # 3, Near Jamia Masjid'
  );
  const [area, setArea] = useState(selectedAddress.area || 'College Road');
  const [landmark, setLandmark] = useState(
    selectedAddress.landmark || 'Opposite Govt Degree College'
  );
  const [instructions, setInstructions] = useState('Please call when rider arrives.');
  const [paymentMethod, setPaymentMethod] = useState<
    'Cash on Delivery' | 'JazzCash / EasyPaisa' | 'Bank Transfer'
  >('Cash on Delivery');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="pb-24 px-4 pt-12 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <button
          onClick={() => navigateTo('home')}
          className="bg-[#004B93] hover:bg-[#003870] text-white font-bold py-3 px-6 rounded-xl text-sm transition"
        >
          Return to Supermarket
        </button>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid Pakistani phone number (e.g. 0320-8488888)');
      return;
    }
    if (!streetAddress.trim()) {
      setError('Please enter your street address in Daska');
      return;
    }

    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customerName: fullName,
        customerPhone: phone,
        deliveryAddress: {
          id: 'addr-' + Date.now(),
          label: 'Delivery Location',
          receiverName: fullName,
          phone,
          streetAddress,
          area,
          landmark,
          city: 'Daska',
          isDefault: true,
        },
        deliveryInstructions: instructions,
        paymentMethod,
      });

      setIsSubmitting(false);
      navigateTo('order-confirmation', { orderId: order.id });
    }, 600);
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          {language === 'ur' ? 'چیک آؤٹ اور ڈیلیوری' : 'Delivery & Checkout'}
        </h1>
        <p className="text-xs text-slate-500">
          Smart Cash & Carry Daska • 30-45 Mins Express Delivery
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-2xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="space-y-4">
        {/* Customer Contact Details */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-[#004B93]" />
            <h2 className="font-extrabold text-sm text-slate-900">Customer Contact Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sajid Hameed"
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#004B93] outline-hidden"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Phone Number (Mobile) *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0320-8488888"
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#004B93] outline-hidden"
                required
              />
            </div>
          </div>
        </div>

        {/* Daska Delivery Address */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-[#E31B23]" />
            <h2 className="font-extrabold text-sm text-slate-900">Daska Delivery Address</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Area / Neighborhood in Daska *
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#004B93] outline-hidden"
              >
                {DASKA_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}, Daska
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Street Address / House / Shop # *
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="House number, street name, mohallah"
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#004B93] outline-hidden"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near Jamia Masjid, School, Hospital"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#004B93] outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  City
                </label>
                <input
                  type="text"
                  value="Daska, Sialkot District"
                  disabled
                  className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Ring bell, leave with guard, call when near Chowk"
                rows={2}
                className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#004B93] outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Banknote className="w-4 h-4 text-[#004B93]" />
            <h2 className="font-extrabold text-sm text-slate-900">Payment Option</h2>
          </div>

          <div className="space-y-2">
            {/* Cash on Delivery */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'Cash on Delivery'
                  ? 'bg-blue-50/70 border-[#004B93] text-slate-950 font-bold'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={() => setPaymentMethod('Cash on Delivery')}
                className="mt-1 accent-[#004B93]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-extrabold">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[10px] bg-[#E31B23] text-white px-2 py-0.5 rounded-md font-bold uppercase">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Pay cash directly to Smart Cash & Carry rider upon receiving your grocery package in Daska.
                </p>
              </div>
            </label>

            {/* JazzCash / EasyPaisa */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'JazzCash / EasyPaisa'
                  ? 'bg-blue-50/70 border-[#004B93] text-slate-950 font-bold'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'JazzCash / EasyPaisa'}
                onChange={() => setPaymentMethod('JazzCash / EasyPaisa')}
                className="mt-1 accent-[#004B93]"
              />
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-extrabold block">
                  JazzCash / EasyPaisa (Mobile Wallet)
                </span>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Send payment to Daska Branch Till Account: <strong>0320-8488888</strong>. Show screenshot upon delivery.
                </p>
              </div>
            </label>

            {/* Bank Transfer */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'Bank Transfer'
                  ? 'bg-blue-50/70 border-[#004B93] text-slate-950 font-bold'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'Bank Transfer'}
                onChange={() => setPaymentMethod('Bank Transfer')}
                className="mt-1 accent-[#004B93]"
              />
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-extrabold block">
                  Direct Online Bank Transfer (IBFT)
                </span>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Meezan Bank / HBL Daska Branch Account integration placeholder.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Complete Order Summary */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#004B93]" />
              <h2 className="font-extrabold text-sm text-slate-900">Order Items Summary</h2>
            </div>
            <span className="text-xs text-slate-500">{cart.length} unique products</span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-50 text-xs">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold text-slate-500">{quantity}x</span>
                  <span className="text-slate-800 font-medium truncate">{product.name}</span>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  Rs. {(product.price * quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold">Rs. {cartSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee ({area}):</span>
              <span className="font-bold">
                {deliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : `Rs. ${deliveryFee}`}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#E31B23] font-bold">
                <span>Discount:</span>
                <span>- Rs. {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Amount to Pay:</span>
              <span>Rs. {finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            id="btn-confirm-order"
            disabled={isSubmitting}
            className="w-full bg-[#E31B23] hover:bg-[#c9141b] active:scale-98 disabled:opacity-60 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 text-base shadow-lg shadow-red-600/30 transition cursor-pointer"
          >
            {isSubmitting ? (
              <span>Placing Order with Daska Branch...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Order • Rs. {finalTotal.toLocaleString()}</span>
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mt-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#004B93]" />
            <span>Smart Cash & Carry guarantees 100% fresh grocery delivery</span>
          </div>
        </div>
      </form>
    </div>
  );
};

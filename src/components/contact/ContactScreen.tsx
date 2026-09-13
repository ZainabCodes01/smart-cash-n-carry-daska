import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneCall,
  MessageCircle,
  MapPin,
  Clock,
  Navigation,
  Star,
  ShieldCheck,
  Store,
  ChevronLeft,
  Mail,
} from 'lucide-react';

export const ContactScreen: React.FC = () => {
  const { storeSettings, language, navigateTo } = useApp();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    '89M5+HFH, College Rd, Near ELC, Daska, Pakistan'
  )}`;

  const whatsappUrl = `https://wa.me/${storeSettings.whatsapp.replace('+', '')}?text=${encodeURIComponent(
    'Salam! I have an inquiry regarding Smart Cash & Carry Daska Branch grocery delivery.'
  )}`;

  return (
    <div className="pb-28 px-4 pt-3 space-y-5 max-w-2xl mx-auto">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-extrabold bg-blue-50 text-[#004B93] border border-blue-100 px-3 py-1 rounded-full">
          Store Support
        </span>
      </div>

      {/* Main Store Banner Card */}
      <div className="bg-gradient-to-br from-[#002f5e] via-[#004B93] to-[#001c3d] text-white rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden border border-blue-900">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#E31B23] text-white px-2 py-0.5 rounded-md shadow-xs">
              Daska Branch
            </span>
            <h1 className="text-2xl font-black">{storeSettings.storeName}</h1>
            <p className="text-sm text-blue-200 font-urdu">{storeSettings.storeNameUrdu}</p>
            <p className="text-xs text-blue-100 font-medium">"Pay Less. Expect More."</p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center border border-white/20 shadow-md">
            {storeSettings.logoUrl ? (
              <img
                src={storeSettings.logoUrl}
                alt={storeSettings.storeName}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Store className="w-7 h-7 text-[#004B93]" />
            )}
          </div>
        </div>

        {/* Google Rating Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs">
          <div className="flex text-amber-400">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <Star className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="font-extrabold text-white">{storeSettings.rating} / 5.0</span>
          <span className="text-blue-100">({storeSettings.reviewCount} customer reviews)</span>
        </div>
      </div>

      {/* Direct Contact Buttons: Call, WhatsApp, Directions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Direct Call */}
        <a
          id="btn-call-store"
          href={`tel:${storeSettings.phone}`}
          className="bg-[#E31B23] hover:bg-[#c9141b] active:scale-95 text-white font-extrabold p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-md shadow-red-600/20 text-center transition"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <span className="text-xs">Call Store</span>
          <span className="text-[11px] font-mono text-red-100">{storeSettings.phone}</span>
        </a>

        {/* WhatsApp Direct */}
        <a
          id="btn-whatsapp-store"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#004B93] hover:bg-[#003870] active:scale-95 text-white font-extrabold p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-md shadow-blue-900/20 text-center transition"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-xs">WhatsApp Us</span>
          <span className="text-[11px] text-blue-100">Instant Chat</span>
        </a>

        {/* Google Maps Directions */}
        <a
          id="btn-directions-store"
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-md text-center transition"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Navigation className="w-5 h-5" />
          </div>
          <span className="text-xs">Get Directions</span>
          <span className="text-[11px] text-slate-300">Open in Maps</span>
        </a>
      </div>

      {/* Store Location & Business Hours Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Store Information & Location
        </h2>

        <div className="space-y-3 text-xs sm:text-sm">
          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#004B93] flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Address in Daska</p>
              <p className="text-slate-600 leading-relaxed">{storeSettings.address}</p>
              <p className="text-[#004B93] font-urdu mt-0.5 font-semibold">
                {storeSettings.addressUrdu}
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-slate-900">Store Timings (Daily)</p>
                <span className="bg-blue-50 text-[#004B93] border border-blue-100 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Open Today
                </span>
              </div>
              <p className="text-slate-600 font-medium">
                {storeSettings.openingTime} – {storeSettings.closingTime} (7 Days a Week)
              </p>
              <p className="text-[11px] text-slate-400">
                Home delivery available during regular store hours.
              </p>
            </div>
          </div>

          {/* Delivery Policy */}
          <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#004B93] flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Delivery Coverage</p>
              <p className="text-slate-600 leading-relaxed">
                All neighborhoods of Daska, including College Road, Sambrial Road, Kashmir Road, Jalalpur Ghumman, Nishtar Road, and surrounding residential colonies.
              </p>
              <p className="text-[11px] text-[#004B93] font-semibold mt-0.5">
                Standard delivery fee: Rs. {storeSettings.deliveryFee}. Free delivery on orders above Rs. {storeSettings.freeDeliveryThreshold.toLocaleString()}!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

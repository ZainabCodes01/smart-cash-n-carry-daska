import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Address } from '../../types';
import { DASKA_AREAS } from '../../data/initialData';
import {
  User,
  Phone,
  MapPin,
  ClipboardList,
  Heart,
  Bell,
  Languages,
  HelpCircle,
  ShieldAlert,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    userProfile,
    language,
    toggleLanguage,
    navigateTo,
    orders,
    wishlist,
    notifications,
    saveUserAddress,
    deleteUserAddress,
    showToast,
  } = useApp();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newArea, setNewArea] = useState('College Road');
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [adminPinError, setAdminPinError] = useState('');

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;

    const newAddr: Address = {
      id: 'addr-' + Date.now(),
      label: newLabel,
      receiverName: userProfile.name,
      phone: userProfile.phone,
      streetAddress: newStreet,
      area: newArea,
      landmark: newLandmark,
      city: 'Daska',
      isDefault: userProfile.addresses.length === 0,
    };

    saveUserAddress(newAddr);
    setIsAddingAddress(false);
    setNewStreet('');
    setNewLandmark('');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234 or direct entry
    if (adminPin === '1234' || adminPin === 'admin' || adminPin === '') {
      setIsAdminModalOpen(false);
      setAdminPin('');
      setAdminPinError('');
      navigateTo('admin');
    } else {
      setAdminPinError('Invalid Admin PIN. (Default: 1234 or leave empty)');
    }
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-5 max-w-2xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          {language === 'ur' ? 'کسٹمر پروفائل' : 'My Account'}
        </h1>
        <p className="text-xs text-slate-500">Smart Cash & Carry Daska Branch Customer</p>
      </div>

      {/* User Info Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {userProfile.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold text-base text-slate-900 truncate">
              {userProfile.name}
            </h2>
            <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{userProfile.phone}</span>
            </p>
            {userProfile.email && (
              <p className="text-[11px] text-slate-400 truncate">{userProfile.email}</p>
            )}
          </div>
        </div>

        <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
          Verified
        </span>
      </div>

      {/* Quick Stat Counters */}
      <div className="grid grid-cols-3 gap-2">
        <div
          onClick={() => navigateTo('orders')}
          className="bg-white rounded-2xl border border-slate-200/80 p-3 text-center shadow-xs cursor-pointer hover:border-emerald-400 transition"
        >
          <ClipboardList className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <p className="text-sm font-black text-slate-900">{orders.length}</p>
          <p className="text-[10px] text-slate-500 font-bold">Orders</p>
        </div>

        <div
          onClick={() => navigateTo('wishlist')}
          className="bg-white rounded-2xl border border-slate-200/80 p-3 text-center shadow-xs cursor-pointer hover:border-red-400 transition"
        >
          <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
          <p className="text-sm font-black text-slate-900">{wishlist.length}</p>
          <p className="text-[10px] text-slate-500 font-bold">Wishlist</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 text-center shadow-xs">
          <MapPin className="w-4 h-4 text-amber-500 mx-auto mb-1" />
          <p className="text-sm font-black text-slate-900">{userProfile.addresses.length}</p>
          <p className="text-[10px] text-slate-500 font-bold">Saved Places</p>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h2 className="font-extrabold text-xs sm:text-sm text-slate-900">
              Saved Addresses in Daska
            </h2>
          </div>
          <button
            onClick={() => setIsAddingAddress(!isAddingAddress)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>

        {/* Add Address Inline Form */}
        {isAddingAddress && (
          <form onSubmit={handleSaveAddress} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800">Add New Address in Daska</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Label</label>
                <select
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Home">Home</option>
                  <option value="Shop / Business">Shop / Business</option>
                  <option value="Office">Office</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Daska Area</label>
                <select
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                >
                  {DASKA_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Street Address</label>
              <input
                type="text"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                placeholder="House / Flat / Mohallah details"
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Landmark</label>
              <input
                type="text"
                value={newLandmark}
                onChange={(e) => setNewLandmark(e.target.value)}
                placeholder="Near Mosque, School, Market"
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="text-xs text-slate-500 font-bold px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-xs"
              >
                Save Address
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {userProfile.addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-slate-600 mt-0.5">
                  {addr.streetAddress}, {addr.area}, Daska
                </p>
                {addr.landmark && (
                  <p className="text-[11px] text-slate-400">Landmark: {addr.landmark}</p>
                )}
              </div>

              {userProfile.addresses.length > 1 && (
                <button
                  onClick={() => deleteUserAddress(addr.id)}
                  className="text-slate-400 hover:text-red-500 p-1.5 cursor-pointer"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Options List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {/* Language Switch */}
        <div
          onClick={toggleLanguage}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition text-xs sm:text-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Languages className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">Language / زبان</span>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            {language === 'en' ? 'English (اردو)' : 'اردو (English)'}
          </span>
        </div>

        {/* Wishlist */}
        <div
          onClick={() => navigateTo('wishlist')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition text-xs sm:text-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">Wishlist & Saved Items</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Contact & Support */}
        <div
          onClick={() => navigateTo('contact')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition text-xs sm:text-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">Help & Store Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Admin Dashboard Portal Trigger */}
        <div
          id="btn-open-admin-portal"
          onClick={() => setIsAdminModalOpen(true)}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition text-xs sm:text-sm bg-slate-50/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Owner / Admin Portal</span>
              <span className="text-[11px] text-slate-500">Manage orders, stock, prices & timings</span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded-md">
            Staff Portal
          </span>
        </div>
      </div>

      {/* Admin Login Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Admin Authentication</h3>
                <p className="text-xs text-slate-500">Smart Cash & Carry Daska Branch</p>
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Manager Security PIN
                </label>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter PIN (e.g. 1234)"
                  className="w-full text-center text-lg tracking-widest font-mono font-bold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-hidden"
                  autoFocus
                />
                <p className="text-[10px] text-slate-400 mt-1 text-center">
                  Hint: Default PIN is <strong>1234</strong> (or click Access directly)
                </p>
                {adminPinError && (
                  <p className="text-xs text-red-600 font-bold mt-1 text-center">{adminPinError}</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-admin-pin"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  Access Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

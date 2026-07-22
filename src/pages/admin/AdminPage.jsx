import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Package, ArrowRight, TrendingUp, Activity, Layers, DollarSign, CreditCard, ShoppingCart } from 'lucide-react';

const AdminPage = () => {
  const menuCards = [
    {
      id: 'orders',
      label: 'Order Management',
      desc: 'Kelola pesanan pelanggan, verifikasi pembayaran DP dan pelunasan.',
      to: '/admin/orders',
      icon: ShoppingCart,
      gradient: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-600/25',
    },
    {
      id: 'box-models',
      label: 'Box Model Management',
      desc: 'Kelola model-model kotak yang tersedia untuk pemesanan custom',
      to: '/admin/box-models',
      icon: Box,
      gradient: 'from-color-darker to-color-primary',
      shadow: 'shadow-color-darker/25',
    },
    {
      id: 'materials',
      label: 'Material Management',
      desc: 'Kelola data bahan-bahan dan material untuk kotak custom',
      to: '/admin/materials',
      icon: Package,
      gradient: 'from-[#1a3d18] to-[#5E9434]',
      shadow: 'shadow-[#1a3d18]/25',
    },
    {
      id: 'finishing-options',
      label: 'Finishing Options',
      desc: 'Kelola opsi laminasi dan finishing (sisi luar, dalam, glossy, doff)',
      to: '/admin/finishing-options',
      icon: Layers,
      gradient: 'from-blue-700 to-blue-500',
      shadow: 'shadow-blue-700/25',
    },
    {
      id: 'plano-types',
      label: 'Ukuran Plano',
      desc: 'Kelola ukuran dan dimensi kertas plano serta area efektif potong',
      to: '/admin/plano-types',
      icon: Layers,
      gradient: 'from-orange-600 to-amber-500',
      shadow: 'shadow-orange-600/25',
    },
    {
      id: 'material-prices',
      label: 'Harga Kertas Plano',
      desc: 'Kelola harga bahan kertas per plano berdasarkan gramatur',
      to: '/admin/material-prices',
      icon: DollarSign,
      gradient: 'from-emerald-600 to-teal-500',
      shadow: 'shadow-emerald-600/25',
    },
    // [HIDDEN] Bank Accounts
    // {
    //   id: 'bank-accounts',
    //   label: 'Bank Accounts',
    //   desc: 'Lihat daftar rekening bank aktif yang ditampilkan ke pelanggan',
    //   to: '/admin/bank-accounts',
    //   icon: CreditCard,
    //   gradient: 'from-slate-700 to-slate-500',
    //   shadow: 'shadow-slate-700/25',
    // },
    // [HIDDEN] Harga CMYK & Blok
    // {
    //   id: 'cmyk-blok-prices',
    //   label: 'Harga CMYK & Blok',
    //   desc: 'Kelola tarif pencetakan berdasarkan ketebalan kertas',
    //   to: '/admin/cmyk-blok-prices',
    //   icon: AlignJustify,
    //   gradient: 'from-purple-700 to-purple-500',
    //   shadow: 'shadow-purple-700/25',
    // },
    // [HIDDEN] Konfigurasi Harga
    // {
    //   id: 'pricing-config',
    //   label: 'Konfigurasi Harga',
    //   desc: 'Atur multiplier pond, harga pisau, multiplier laminasi, dll.',
    //   to: '/admin/pricing-config',
    //   icon: Settings,
    //   gradient: 'from-pink-700 to-pink-500',
    //   shadow: 'shadow-pink-700/25',
    // },
  ];

  const stats = [
    { label: 'Box Models', value: '—', sub: 'Data loading...', icon: Box, color: 'text-color-primary' },
    { label: 'Material', value: '—', sub: 'Data loading...', icon: Package, color: 'text-blue-600' },
    { label: 'Finishing', value: '—', sub: 'Data loading...', icon: Layers, color: 'text-indigo-500' },
    { label: 'Sistem', value: 'ON', sub: 'Server berjalan', icon: Activity, color: 'text-green-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-color-darker via-[#1a3d18] to-color-primary p-6 md:p-8 shadow-xl shadow-color-darker/30">
        <div className="relative z-10">
          <p className="text-color-secondary text-xs font-bold uppercase tracking-widest mb-1">
            Welcome Back
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-lg">
            Kelola master data produk, bahan, model kotak, laminasi, dan matrix harga untuk sistem custom packaging.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-10 w-64 h-64 rounded-full bg-white/5" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Quick access cards */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Master Data Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {menuCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                to={card.to}
                id={`admin-card-${card.id}`}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100
                  hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Colored top strip */}
                <div className={`h-1.5 bg-gradient-to-r ${card.gradient}`} />

                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient}
                        flex items-center justify-center shadow-lg ${card.shadow}`}
                    >
                      <Icon size={22} className="text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-color-darker transition-colors">
                        {card.label}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                    </div>
                  </div>

                  {/* CTA row */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">Klik untuk membuka</span>
                    <div
                      className="flex items-center gap-1.5 text-color-primary text-sm font-semibold
                        group-hover:gap-2.5 transition-all duration-200"
                    >
                      <span>Buka</span>
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;


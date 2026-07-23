import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import {
  LayoutDashboard,
  Box,
  Package,
  Layers,
  DollarSign,
  CreditCard,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Bell,
  Settings,
  AlignJustify,
  Maximize,
  FileText,
  ShoppingCart,
} from 'lucide-react';
import logo from '@/assets/logo-impepact.svg';

// ── Sidebar nav items ────────────────────────────────────────────────────────
const navItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Order Management',
    to: '/admin/orders',
    icon: ShoppingCart,
  },
  // ── Master Data group ──
  { type: 'separator', label: 'Master Data' },
  {
    label: 'Box Model',
    to: '/admin/box-models',
    icon: Box,
  },
  {
    label: 'Material',
    to: '/admin/materials',
    icon: Package,
  },
  {
    label: 'Finishing Options',
    to: '/admin/finishing-options',
    icon: Layers,
  },

  { type: 'separator', label: 'Pricing Engine v3' },
  {
    label: 'Ukuran Plano',
    to: '/admin/plano-types',
    icon: Maximize,
  },
  {
    label: 'Harga Kertas Plano',
    to: '/admin/material-prices',
    icon: FileText,
  },

  // [HIDDEN] Harga CMYK & Blok - uncomment below to re-enable
  // {
  //   label: 'Harga CMYK & Blok',
  //   to: '/admin/cmyk-blok-prices',
  //   icon: AlignJustify,
  // },
  // [HIDDEN] Konfigurasi Harga - uncomment below to re-enable
  // {
  //   label: 'Konfigurasi Harga',
  //   to: '/admin/pricing-config',
  //   icon: Settings,
  // },
  { type: 'separator', label: 'Pembayaran' },
  {
    label: 'Bank Accounts',
    to: '/admin/bank-accounts',
    icon: CreditCard,
  },
];

// ── Sidebar Component ────────────────────────────────────────────────────────
const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Overlay — mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64
          flex flex-col
          bg-gradient-to-b from-color-darker via-[#1a3d18] to-[#0d2610]
          shadow-2xl shadow-black/40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link to="/admin" onClick={onClose} className="flex items-center gap-3">
            <img
              src={logo}
              alt="Impepac Admin"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <span className="text-white/90 text-xs font-semibold uppercase tracking-widest leading-tight">
              Admin Panel
            </span>
          </Link>
          {/* Close btn — mobile */}
          <button
            onClick={onClose}
            className="md:hidden text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Badge */}
        <div className="mx-4 mt-4 px-3 py-2 rounded-lg bg-color-primary/20 border border-color-primary/30 flex items-center gap-2">
          <Shield size={14} className="text-color-secondary flex-shrink-0" />
          <span className="text-color-secondary text-xs font-medium">Administrator</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar-dark">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">
            Menu
          </p>
          {navItems.map((item, idx) => {
            // Separator / section label
            if (item.type === 'separator') {
              return (
                <p key={`sep-${idx}`} className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 pt-4 pb-1">
                  {item.label}
                </p>
              );
            }

            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-color-primary text-white shadow-lg shadow-color-primary/30'
                    : 'text-white/65 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Icon
                  size={18}
                  className={`flex-shrink-0 transition-colors ${active ? 'text-white' : 'text-white/50 group-hover:text-white'}`}
                />
                <span className="flex-1 leading-tight">{item.label}</span>
                {active && <ChevronRight size={14} className="text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium text-white/65 hover:text-red-400
              hover:bg-red-500/10 transition-all duration-200 group"
          >
            <LogOut size={18} className="flex-shrink-0 transition-colors group-hover:text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// ── Admin Navbar ─────────────────────────────────────────────────────────────
const AdminNavbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Derive page title from current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/orders')) return 'Order Management';
    if (path.startsWith('/admin/box-models')) return 'Box Model Management';
    if (path.startsWith('/admin/materials')) return 'Material Management';
    if (path.startsWith('/admin/finishing-options')) return 'Finishing Options';

    if (path.startsWith('/admin/cmyk-blok-prices')) return 'Harga CMYK & Blok';
    if (path.startsWith('/admin/pricing-config')) return 'Konfigurasi Harga';
    if (path.startsWith('/admin/bank-accounts')) return 'Bank Accounts';
    return 'Admin Panel';
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center h-16 px-4 md:px-6 gap-4">
        {/* Hamburger — mobile toggle */}
        <button
          onClick={onToggleSidebar}
          id="admin-sidebar-toggle"
          className="md:hidden flex items-center justify-center w-9 h-9
            rounded-lg text-gray-600 hover:text-color-darker
            hover:bg-color-light transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Page breadcrumb */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm hidden sm:block">Admin</span>
          <span className="text-gray-300 hidden sm:block">/</span>
          <h1 className="text-sm md:text-base font-semibold text-color-darker">
            {getPageTitle()}
          </h1>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Notification bell */}
          <button
            className="relative flex items-center justify-center w-9 h-9 rounded-lg
              text-gray-500 hover:text-color-darker hover:bg-color-light transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
          </button>

          {/* Admin badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-color-lighter border border-color-light">
            <div className="w-6 h-6 rounded-full bg-color-darker flex items-center justify-center flex-shrink-0">
              <Shield size={12} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-color-darker">Admin</span>
          </div>

          {/* Logout — desktop shortcut */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              text-xs font-medium text-gray-500 hover:text-red-600
              hover:bg-red-50 border border-transparent hover:border-red-200
              transition-all duration-200"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

// ── AdminLayout (Root) ───────────────────────────────────────────────────────
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area — offset on desktop to account for sidebar */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300">
        {/* Admin Navbar */}
        <AdminNavbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

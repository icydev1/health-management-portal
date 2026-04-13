'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useRequireClientAuth } from '@/lib/auth/requireClientAuth';
import { clearAuth } from '@/store/authSlice';
import { logoutViaApi } from '@/lib/auth/tokenStorage';

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" clipRule="evenodd"></path>
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
  </svg>
);

const FolderIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 6a2 2 0 012-2h4l2-2h4a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
  </svg>
);

const DraftIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
  </svg>
);

function Avatar({ image, name, size = 9 }) {
  const sizeClass = `w-${size} h-${size}`;
  return (
    <div className={`shrink-0 ${sizeClass} rounded-full overflow-hidden border-2 border-green-500`}>
      {image ? (
        <Image
          src={image}
          alt={name || 'Admin'}
          width={36}
          height={36}
          className="w-full h-full object-cover"
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center font-bold text-black text-sm">
          {name ? name.charAt(0).toUpperCase() : 'A'}
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState('');
  const [adminImage, setAdminImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useRequireClientAuth({ role: 'ADMIN' });

  useEffect(() => {
    fetch('/api/profile', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((j) => {
        if (j.ok && j.profile) {
          setAdminName(j.profile.fullName || `${j.profile.firstName ?? ''} ${j.profile.lastName ?? ''}`.trim());
          setAdminImage(j.profile.profileImage || null);
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logoutViaApi();
    dispatch(clearAuth());
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-black text-white transition-all duration-300 flex flex-col overflow-hidden border-r border-gray-800`}
      >
        {/* Sidebar Header — app logo + name */}
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-5">
          {sidebarOpen && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="shrink-0 w-8 h-8 bg-linear-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center font-bold text-black text-sm">
                F
              </div>
              <h2 className="text-lg font-bold text-white truncate">FreelanceHub</h2>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-8 h-8 bg-linear-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center font-bold text-black text-sm">
              F
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-green-600 hover:text-white transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          <NavLink href="/admin/dashboard"   label="Dashboard"   icon={<DashboardIcon />} sidebarOpen={sidebarOpen} />
          <NavLink href="/admin/orders"      label="Orders"      icon={<FolderIcon />}    sidebarOpen={sidebarOpen} />
          <NavLink href="/admin/drafts"      label="Drafts"      icon={<DraftIcon />}     sidebarOpen={sidebarOpen} badge={3} />
          <NavLink href="/admin/freelancers" label="Freelancers" icon={<UsersIcon />}     sidebarOpen={sidebarOpen} />
          <NavLink href="/admin/invoices"    label="Invoices"    icon={<ChartIcon />}     sidebarOpen={sidebarOpen} />
          <NavLink href="/admin/analytics"   label="Analytics"   icon={<ChartIcon />}     sidebarOpen={sidebarOpen} />
          <NavLink href="/admin/settings"    label="Settings"    icon={<SettingsIcon />}  sidebarOpen={sidebarOpen} />
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 px-4 py-4 space-y-2">
          <Link
            href="/admin/profile"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-300 hover:bg-green-600 hover:text-white transition-colors duration-200 flex items-center gap-3"
          >
            <ProfileIcon />
            {sidebarOpen && 'Profile'}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200 flex items-center gap-3"
          >
            <LogoutIcon />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <div className="shrink-0 flex items-center justify-end border-b border-gray-200 bg-white px-8 py-3">
          <div className="relative" ref={dropdownRef}>
            {/* Trigger */}
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors focus:outline-none"
            >
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 leading-tight">{adminName || 'Admin'}</p>
                <p className="text-xs text-gray-400 leading-tight">Administrator</p>
              </div>
              <Avatar image={adminImage} name={adminName} />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <Link
                  href="/admin/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ProfileIcon />
                  My Profile
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <SettingsIcon />
                  Settings
                </Link>
                <div className="my-1 border-t border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogoutIcon />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <main className="flex-1 overflow-auto bg-white">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ href, label, icon, sidebarOpen, badge }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-200 ${
        isActive
          ? 'bg-green-600 text-white'
          : 'text-gray-300 hover:bg-green-600 hover:text-white'
      }`}
    >
      <div className="relative shrink-0">
        {icon}
        {badge > 0 && !sidebarOpen && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-green-700 text-[10px] font-bold rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      {sidebarOpen && <span className="text-sm font-medium flex-1">{label}</span>}
      {sidebarOpen && badge > 0 && (
        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-green-700' : 'bg-green-500 text-white'}`}>
          {badge}
        </span>
      )}
    </Link>
  );
}

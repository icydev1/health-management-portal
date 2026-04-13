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

const BriefcaseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A2.97 2.97 0 009.944 13H6.06A2.969 2.969 0 004 10.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm5 4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd"></path>
    <path d="M4 12.611A2.969 2.969 0 009.944 15h4.012A2.97 2.97 0 0016 12.611V12a1 1 0 11-2 0v.611a.969.969 0 01-.936.389H5.936A.969.969 0 015 12.611V12a1 1 0 01-1 0v.611z"></path>
  </svg>
);

const MyJobsIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
  </svg>
);

const FileIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path>
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z"></path>
    <path fillRule="evenodd" d="M2 8a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8zm4 3a1 1 0 000 2h4a1 1 0 000-2H6z" clipRule="evenodd"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
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

function Avatar({ image, name }) {
  return (
    <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden border-2 border-green-500">
      {image ? (
        <Image
          src={image}
          alt={name || 'User'}
          width={36}
          height={36}
          className="w-full h-full object-cover"
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center font-bold text-black text-sm">
          {name ? name.charAt(0).toUpperCase() : 'F'}
        </div>
      )}
    </div>
  );
}

export default function FreelancerLayout({ children }) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useRequireClientAuth({ role: 'FREELANCER' });

  useEffect(() => {
    fetch('/api/profile', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((j) => {
        if (j.ok && j.profile) {
          setUserName(j.profile.fullName || `${j.profile.firstName ?? ''} ${j.profile.lastName ?? ''}`.trim());
          setUserImage(j.profile.profileImage || null);
        }
      })
      .catch(() => {});
  }, []);

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
        {/* Logo/Header */}
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
          <NavLink href="/freelancer/dashboard" label="Dashboard"      icon={<DashboardIcon />}  sidebarOpen={sidebarOpen} />
          <NavLink href="/freelancer/jobs"       label="Available Jobs" icon={<BriefcaseIcon />}  sidebarOpen={sidebarOpen} />
          <NavLink href="/freelancer/my-jobs"    label="My Jobs"        icon={<MyJobsIcon />}     sidebarOpen={sidebarOpen} />
          <NavLink href="/freelancer/invoices"   label="Invoices"       icon={<FileIcon />}       sidebarOpen={sidebarOpen} />
          <NavLink href="/freelancer/payouts"    label="Payouts"        icon={<CreditCardIcon />} sidebarOpen={sidebarOpen} />
          <NavLink href="/freelancer/settings"   label="Settings"       icon={<SettingsIcon />}   sidebarOpen={sidebarOpen} />
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 px-4 py-4 space-y-2">
          <Link
            href="/freelancer/profile"
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
                <p className="text-sm font-bold text-gray-900 leading-tight">{userName || 'Freelancer'}</p>
                <p className="text-xs text-gray-400 leading-tight">Freelancer</p>
              </div>
              <Avatar image={userImage} name={userName} />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <Link
                  href="/freelancer/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ProfileIcon />
                  My Profile
                </Link>
                <Link
                  href="/freelancer/settings"
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

function NavLink({ href, label, icon, sidebarOpen }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/freelancer/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-200 ${
        isActive
          ? 'bg-green-600 text-white'
          : 'text-gray-300 hover:bg-green-600 hover:text-white'
      }`}
    >
      {icon}
      {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const EditIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
  </svg>
);

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0 last:pb-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value || '—'}</span>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
      />
    </div>
  );
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [imgUploading, setImgUploading] = useState(false);
  const [imgError, setImgError] = useState(null);
  const fileInputRef = useRef(null);

  const buildDraft = (p) => ({
    firstName: p.firstName ?? '',
    lastName: p.lastName ?? '',
    fullName: p.fullName ?? '',
    phone: p.phone ?? '',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/profile', { credentials: 'same-origin' });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || !json.ok) {
          if (res.status === 401) { window.location.href = '/login?error=unauthorized'; return; }
          setAuthError(json.error ?? 'Could not load profile.');
          return;
        }
        setProfile(json.profile);
      } catch (e) {
        if (!cancelled) setAuthError(e?.message ?? 'Could not load profile.');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) { setSaveError(json.error ?? 'Failed to save.'); return; }
      setProfile((prev) => ({ ...prev, ...json.profile }));
      setDraft(null);
      setIsEditing(false);
    } catch (e) {
      setSaveError(e?.message ?? 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgError(null);
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/profile/image', {
        method: 'POST',
        credentials: 'same-origin',
        body: fd,
      });
      const json = await res.json();
      if (!res.ok || !json.ok) { setImgError(json.error ?? 'Upload failed.'); return; }
      setProfile((prev) => ({ ...prev, profileImage: json.imageUrl }));
    } catch (e) {
      setImgError(e?.message ?? 'Upload failed.');
    } finally {
      setImgUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Skeleton ──
  if (!profile && !authError) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-44 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-11 w-36 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <div className="h-7 w-52 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse mx-auto mb-4" />
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
            </div>
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{authError}</div>
      </div>
    );
  }

  const displayName = profile.fullName || `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || '—';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white p-8">
      {saveError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{saveError}</div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your admin account information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => { setDraft(buildDraft(profile)); setIsEditing(true); }}
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <EditIcon />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

            {!isEditing ? (
              <div className="space-y-4">
                <InfoRow label="First Name" value={profile.firstName} />
                <InfoRow label="Last Name" value={profile.lastName} />
                <InfoRow label="Full Name" value={profile.fullName} />
                <InfoRow label="Email" value={profile.email} />
                <InfoRow label="Phone" value={profile.phone} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" name="firstName" value={draft.firstName} onChange={handleChange} placeholder="John" />
                  <Field label="Last Name" name="lastName" value={draft.lastName} onChange={handleChange} placeholder="Doe" />
                </div>
                <Field label="Full Name" name="fullName" value={draft.fullName} onChange={handleChange} placeholder="John Doe" />
                <Field label="Phone" name="phone" type="tel" value={draft.phone} onChange={handleChange} placeholder="+49 123 456 7890" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          {isEditing && (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  <><SaveIcon /> Save Changes</>
                )}
              </button>
              <button
                onClick={() => { setDraft(null); setSaveError(null); setIsEditing(false); }}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />

            <div className="relative w-32 h-32 mx-auto mb-4">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={displayName}
                  fill
                  className="rounded-full object-cover"
                  sizes="128px"
                  unoptimized
                />
              ) : (
                <div className="w-32 h-32 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-4xl">
                  {initials}
                </div>
              )}
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imgUploading}
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity disabled:opacity-60"
                  title="Change photo"
                >
                  {imgUploading ? (
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {imgError && <p className="text-xs text-red-600 mb-2">{imgError}</p>}
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={imgUploading}
                className="text-sm text-green-700 hover:text-green-800 font-semibold disabled:opacity-50"
              >
                {imgUploading ? 'Uploading…' : 'Change Photo'}
              </button>
            )}
            <p className="font-semibold text-gray-900 text-lg mt-2">{displayName}</p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Role</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {profile.role ?? 'ADMIN'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Member Since</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

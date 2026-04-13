'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const LANGUAGES = [
  'German',
  'English',
  'French',
  'Spanish',
  'Italian',
  'Portuguese',
  'Dutch',
  'Polish',
  'Turkish',
  'Arabic',
  'Russian',
  'Chinese (Mandarin)',
  'Japanese',
  'Korean',
];

const REGION_LABELS = {
  NORD_WEST: 'North West',
  BAYERN: 'Bayern',
  BERLIN_BRANDENBURG: 'Berlin / Brandenburg',
  SACHSEN: 'Sachsen',
};

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

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const EMPTY_EDU = { degree: '', fieldOfStudy: '', specialization: '' };

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Profile fields
  const [profile, setProfile] = useState(null);

  // Editable draft
  const [draft, setDraft] = useState(null);

  // Education state
  const [educations, setEducations] = useState([]);
  const [newEdu, setNewEdu] = useState(EMPTY_EDU);
  const [addingEdu, setAddingEdu] = useState(false);
  const [eduSaving, setEduSaving] = useState(false);
  const [editingEduId, setEditingEduId] = useState(null);
  const [editEduDraft, setEditEduDraft] = useState(EMPTY_EDU);
  const [eduEditSaving, setEduEditSaving] = useState(false);

  // Image upload
  const [imgUploading, setImgUploading] = useState(false);
  const [imgError, setImgError] = useState(null);
  const fileInputRef = useRef(null);

  // Language input
  const [newLang, setNewLang] = useState('');

  // Build a draft object from a profile object
  const buildDraft = (p) => ({
    firstName: p.firstName ?? '',
    lastName: p.lastName ?? '',
    fullName: p.fullName ?? '',
    email: p.email ?? '',
    phone: p.phone ?? '',
    dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
    primaryAddress: p.primaryAddress ?? '',
    secondaryAddress: p.secondaryAddress ?? '',
    region: p.region ?? '',
    languages: Array.isArray(p.languages) ? [...p.languages] : [],
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
          if (res.status === 403) {
            const em = json?.email ?? '';
            if (em) window.localStorage.setItem('pending_verify_email', em);
            window.location.href = '/verify-email';
            return;
          }
          setAuthError(json.error ?? 'Could not load profile.');
          return;
        }

        const p = json.profile;
        setProfile(p);
        setEducations(p.educations ?? []);
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

  const handleAddLanguage = () => {
    const lang = newLang.trim();
    if (!lang) return;
    setDraft((prev) => ({ ...prev, languages: [...prev.languages, lang] }));
    setNewLang('');
  };

  const handleRemoveLanguage = (idx) => {
    setDraft((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveProfile = async () => {
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
      if (!res.ok || !json.ok) {
        setSaveError(json.error ?? 'Failed to save profile.');
        return;
      }
      setProfile((prev) => ({ ...prev, ...json.profile }));
      if (json.profile.educations) setEducations(json.profile.educations);
      setDraft(null);
      setIsEditing(false);
    } catch (e) {
      setSaveError(e?.message ?? 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setDraft(null);
    setSaveError(null);
    setIsEditing(false);
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
      if (!res.ok || !json.ok) {
        setImgError(json.error ?? 'Upload failed.');
        return;
      }
      setProfile((prev) => ({ ...prev, profileImage: json.imageUrl }));
    } catch (e) {
      setImgError(e?.message ?? 'Upload failed.');
    } finally {
      setImgUploading(false);
      // Reset so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Education CRUD
  const handleAddEducation = async () => {
    if (!newEdu.degree && !newEdu.fieldOfStudy && !newEdu.specialization) return;
    setEduSaving(true);
    try {
      const res = await fetch('/api/profile/education', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEdu),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setEducations((prev) => [...prev, json.education]);
        setNewEdu(EMPTY_EDU);
        setAddingEdu(false);
      }
    } finally {
      setEduSaving(false);
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      const res = await fetch(`/api/profile/education/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        setEducations((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      // silent
    }
  };

  const startEditEdu = (edu) => {
    setEditingEduId(edu.id);
    setEditEduDraft({ degree: edu.degree ?? '', fieldOfStudy: edu.fieldOfStudy ?? '', specialization: edu.specialization ?? '' });
  };

  const cancelEditEdu = () => {
    setEditingEduId(null);
    setEditEduDraft(EMPTY_EDU);
  };

  const handleUpdateEducation = async (id) => {
    setEduEditSaving(true);
    try {
      const res = await fetch(`/api/profile/education/${id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editEduDraft),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setEducations((prev) => prev.map((e) => (e.id === id ? json.education : e)));
        cancelEditEdu();
      }
    } finally {
      setEduEditSaving(false);
    }
  };

  if (authError) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{authError}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white p-8">
        {/* Header skeleton */}
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-44 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-11 w-36 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal info card */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <div className="h-7 w-52 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Languages card */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <div className="h-7 w-36 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-7 w-20 bg-gray-100 rounded-full animate-pulse" />
                ))}
              </div>
            </div>

            {/* Education card */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-36 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar card */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse mx-auto mb-4" />
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mx-auto" />
            </div>

            {/* Account status card */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
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
          <p className="text-gray-600">Manage your personal information and education</p>
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
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Information */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
            {!isEditing ? (
              <div className="space-y-4">
                <InfoRow label="First Name" value={profile.firstName} />
                <InfoRow label="Last Name" value={profile.lastName} />
                <InfoRow label="Full Name" value={profile.fullName} />
                <InfoRow label="Email" value={profile.email} />
                <InfoRow label="Phone" value={profile.phone} />
                <InfoRow
                  label="Date of Birth"
                  value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : null}
                />
                <InfoRow label="Primary Address" value={profile.primaryAddress} />
                <InfoRow label="Secondary Address" value={profile.secondaryAddress} />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Assigned Region</span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    {profile.region ? REGION_LABELS[profile.region] ?? profile.region : '—'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" name="firstName" value={draft.firstName} onChange={handleChange} />
                  <Field label="Last Name" name="lastName" value={draft.lastName} onChange={handleChange} />
                </div>
                <Field label="Full Name" name="fullName" value={draft.fullName} onChange={handleChange} />
                <Field label="Email" name="email" type="email" value={draft.email} onChange={handleChange} />
                <Field label="Phone" name="phone" type="tel" value={draft.phone} onChange={handleChange} />
                <Field label="Date of Birth" name="dateOfBirth" type="date" value={draft.dateOfBirth} onChange={handleChange} />
                <Field label="Primary Address" name="primaryAddress" value={draft.primaryAddress} onChange={handleChange} />
                <Field label="Secondary Address" name="secondaryAddress" value={draft.secondaryAddress} onChange={handleChange} />
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Region</label>
                  <select
                    name="region"
                    value={draft.region ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
                  >
                    <option value="">— Select region —</option>
                    {Object.entries(REGION_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Languages</h2>
            {!isEditing ? (
              <div className="flex flex-wrap gap-2">
                {Array.isArray(profile.languages) && profile.languages.length > 0
                  ? profile.languages.map((lang, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        {lang}
                      </span>
                    ))
                  : <span className="text-gray-400">No languages added yet.</span>}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {draft.languages.map((lang, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {lang}
                      <button onClick={() => handleRemoveLanguage(i)} className="text-gray-400 hover:text-red-600 ml-1">×</button>
                    </span>
                  ))}
                </div>
                <select
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
                  defaultValue=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    if (!draft.languages.includes(val)) {
                      setDraft((prev) => ({ ...prev, languages: [...prev.languages, val] }));
                    }
                    e.target.value = '';
                  }}
                >
                  <option value="" disabled>— Select a language —</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Education</h2>
              {isEditing && !addingEdu && (
                <button
                  onClick={() => setAddingEdu(true)}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-semibold"
                >
                  <PlusIcon /> Add Education
                </button>
              )}
            </div>

            <div className="space-y-4">
              {educations.length === 0 && !addingEdu && (
                <p className="text-gray-400">No education entries yet.</p>
              )}

              {educations.map((edu) => (
                <div key={edu.id} className="rounded-lg border border-gray-200 overflow-hidden">
                  {editingEduId === edu.id ? (
                    /* ── Inline edit form ── */
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg space-y-3">
                      <Field
                        label="Degree"
                        name="degree"
                        value={editEduDraft.degree}
                        onChange={(e) => setEditEduDraft((p) => ({ ...p, degree: e.target.value }))}
                        placeholder="e.g. Bachelor of Science"
                      />
                      <Field
                        label="Field of Study"
                        name="fieldOfStudy"
                        value={editEduDraft.fieldOfStudy}
                        onChange={(e) => setEditEduDraft((p) => ({ ...p, fieldOfStudy: e.target.value }))}
                        placeholder="e.g. Computer Science"
                      />
                      <Field
                        label="Specialization"
                        name="specialization"
                        value={editEduDraft.specialization}
                        onChange={(e) => setEditEduDraft((p) => ({ ...p, specialization: e.target.value }))}
                        placeholder="e.g. Machine Learning"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleUpdateEducation(edu.id)}
                          disabled={eduEditSaving}
                          className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold text-sm disabled:opacity-50"
                        >
                          {eduEditSaving ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditEdu}
                          disabled={eduEditSaving}
                          className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── View row ── */
                    <div className="p-4 bg-gray-50 flex items-start justify-between">
                      <div className="space-y-1">
                        {edu.degree && <p className="font-semibold text-gray-900">{edu.degree}</p>}
                        {edu.fieldOfStudy && <p className="text-gray-600 text-sm">{edu.fieldOfStudy}</p>}
                        {edu.specialization && <p className="text-gray-500 text-sm italic">{edu.specialization}</p>}
                      </div>
                      {isEditing && (
                        <div className="flex items-center gap-2 ml-4 shrink-0">
                          <button
                            onClick={() => startEditEdu(edu)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDeleteEducation(edu.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Add new education form */}
              {addingEdu && (
                <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50 space-y-3">
                  <Field
                    label="Degree"
                    name="degree"
                    value={newEdu.degree}
                    onChange={(e) => setNewEdu((prev) => ({ ...prev, degree: e.target.value }))}
                    placeholder="e.g. Bachelor of Science"
                  />
                  <Field
                    label="Field of Study"
                    name="fieldOfStudy"
                    value={newEdu.fieldOfStudy}
                    onChange={(e) => setNewEdu((prev) => ({ ...prev, fieldOfStudy: e.target.value }))}
                    placeholder="e.g. Computer Science"
                  />
                  <Field
                    label="Specialization"
                    name="specialization"
                    value={newEdu.specialization}
                    onChange={(e) => setNewEdu((prev) => ({ ...prev, specialization: e.target.value }))}
                    placeholder="e.g. Machine Learning"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleAddEducation}
                      disabled={eduSaving}
                      className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold text-sm disabled:opacity-50"
                    >
                      {eduSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setAddingEdu(false); setNewEdu(EMPTY_EDU); }}
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                <SaveIcon />
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancelEdit}
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
            {/* Hidden file input */}
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

              {/* Upload overlay — visible only in edit mode */}
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
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Verification</span>
                <VerificationBadge status={profile.verificationStatus} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Role</span>
                <span className="font-semibold text-gray-900 text-sm capitalize">{profile.role?.toLowerCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Member Since</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

function VerificationBadge({ status }) {
  const styles = {
    APPROVED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    REJECTED: 'bg-red-100 text-red-700',
  };
  const labels = { APPROVED: 'Approved', PENDING: 'Pending', REJECTED: 'Rejected' };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {labels[status] ?? status ?? '—'}
    </span>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Product Catalog ──────────────────────────────────────────────────────────
const PRODUCT_CATALOG = [
  {
    category: 'Presentations',
    items: [
      { id: 'pres_30',  label: 'Presentation – 30 minutes', price: 350, hasTitle: true },
      { id: 'pres_60',  label: 'Presentation – 60 minutes', price: 500, hasTitle: true },
    ],
  },
  {
    category: 'Workshops',
    items: [
      { id: 'ws_90',     label: 'Workshop – 90 minutes',      price: 650,  hasTitle: true, hasDuration: false },
      { id: 'ws_120',    label: 'Workshop – 120 minutes',     price: 850,  hasTitle: true, hasDuration: false },
      { id: 'ws_180',    label: 'Workshop – 180 minutes',     price: 1100, hasTitle: true, hasDuration: false },
      { id: 'ws_custom', label: 'Workshop – Custom duration', price: null, hasTitle: true, hasDuration: true },
    ],
  },
  {
    category: 'Screenings',
    items: [
      { id: 'sc_arterien',     label: 'Artery Screening (Arterienscreening)',             price: null },
      { id: 'sc_ergonomie',    label: 'Workplace Analysis – Ergonomics Consulting',       price: null },
      { id: 'sc_fms',          label: 'FMS – Functional Movement Screening',              price: null },
      { id: 'sc_bodyscan',     label: 'BodyScan',                                         price: null },
      { id: 'sc_cardiocheck',  label: 'CardioCheck',                                      price: null },
      { id: 'sc_cardioscan',   label: 'Cardioscan®',                                      price: null },
      { id: 'sc_diabetes',     label: 'DiabetesCheck',                                    price: null },
      { id: 'sc_easytorque',   label: 'EasyTorque®',                                      price: null },
      { id: 'sc_emg',          label: 'EMG Measurement (EMG-Messung)',                    price: null },
      { id: 'sc_fuss',         label: 'Foot Pressure Measurement + Mat',                  price: null },
      { id: 'sc_futrex',       label: 'Futrex®',                                          price: null },
      { id: 'sc_hrv',          label: 'HRV-Scan',                                         price: null },
      { id: 'sc_hand',         label: 'Hand Strength Measurement (Handkraftmessung)',     price: null },
      { id: 'sc_knochen',      label: 'Bone Density Measurement (Knochendichtemessung)',  price: null },
      { id: 'sc_lunge',        label: 'Lung Function Test (Lungenfunktionstest)',          price: null },
      { id: 'sc_medimouse',    label: 'Medi Mouse®',                                      price: null },
      { id: 'sc_mobeefit',     label: 'Mobee-Fit®',                                       price: null },
      { id: 'sc_pupillo',      label: 'Pupillograph',                                     price: null },
      { id: 'sc_s3',           label: 'S3 Coordination Measurement',                      price: null },
      { id: 'sc_stoff',        label: 'Metabolic Analysis (Stoffwechselanalyse)',          price: null },
      { id: 'sc_wolff',        label: 'Dr. Wolff® Balance Check',                         price: null },
      { id: 'sc_venen',        label: 'Vein Screening (Venenscreening)',                  price: null },
      { id: 'sc_vital',        label: 'Vital Screening (Vitalscreening)',                 price: null },
      { id: 'sc_vitamind',     label: 'Vitamin D',                                        price: null },
      { id: 'sc_vo2',          label: 'VO2max Measurement (Seismofit)',                   price: null },
    ],
  },
  {
    category: 'Specials & Highlights',
    items: [
      { id: 'sp_adventurewalk',  label: 'Adventure Walk',             price: null },
      { id: 'sp_carrera',        label: 'Active Carrera Track',       price: null },
      { id: 'sp_twall',          label: 'tWall4D',                    price: null },
      { id: 'sp_fussball',       label: 'Football Darts',             price: null },
      { id: 'sp_slackline',      label: 'Slackline',                  price: null },
      { id: 'sp_erstehilfe',     label: 'First Aid Courses',          price: null },
      { id: 'sp_altersanzug',    label: 'Age Simulation Suit',        price: null },
    ],
  },
  {
    category: 'Stand Actions (Standaktionen)',
    items: [
      { id: 'sa_smoothiebike',   label: 'SmoothieBike',               price: null },
      { id: 'sa_smoothiebar',    label: 'SmoothieBar',                price: null },
      { id: 'sa_wassertypen',    label: 'Water Type Test',            price: null },
      { id: 'sa_rauschbrille',   label: 'Goggles Obstacle Course',   price: null },
      { id: 'sa_ernaehrung',     label: 'Nutrition Course',           price: null },
      { id: 'sa_mueslibar',      label: 'Müsli Bar',                  price: null },
      { id: 'sa_mueslistr',      label: 'Muesli Street',              price: null },
      { id: 'sa_parcours',       label: 'Sensory Course',             price: null },
      { id: 'sa_snackbar',       label: 'Healthy Snack Bar',          price: null },
      { id: 'sa_infusedwater',   label: 'Infused Water Bar',          price: null },
      { id: 'sa_immunpower',     label: 'Immun Power Bar',            price: null },
      { id: 'sa_icetea',         label: 'Infused Ice Tea Bar',        price: null },
      { id: 'sa_icecream',       label: 'Ice Cream Bike',             price: null },
      { id: 'sa_brainfood',      label: 'BrainfoodBar',               price: null },
      { id: 'sa_blazepods',      label: 'Blaze Pods',                 price: null },
    ],
  },
  {
    category: 'AOK Products',
    items: [
      { id: 'aok_vortrag',       label: 'Lecture: Recharge Your Battery (Fachvortrag Akku Laden)',             price: null },
      { id: 'aok_ws_akku',       label: 'Workshop: Recharge Your Battery (Workshop Akku Laden)',               price: null },
      { id: 'aok_ws_stress',     label: 'Workshop: Managing Stress (WS im Stress nicht untergehen)',           price: null },
      { id: 'aok_gidbs_kickoff', label: 'Healthy Start to Work (GidBs) – Kick-off',                           price: null },
      { id: 'aok_gidbs_stress',  label: 'GidBs Deep Dive – Stress',                                           price: null },
      { id: 'aok_gidbs_ernaehr', label: 'GidBs Deep Dive – Nutrition',                                        price: null },
      { id: 'aok_gidbs_sucht',   label: 'GidBs Deep Dive – Addiction Prevention',                             price: null },
      { id: 'aok_gidbs_bewegung',label: 'GidBs Deep Dive – Movement',                                         price: null },
      { id: 'aok_gidbs_abschl',  label: 'Healthy Start to Work – Conclusion',                                 price: null },
      { id: 'aok_eigenweg',      label: 'Finding Your Own Path (Den eigenen Weg finden)',                      price: null },
      { id: 'aok_ws_kopf',       label: 'WS: Stress Starts in the Mind (Stress entsteht im Kopf)',            price: null },
      { id: 'aok_ws_schlaf',     label: 'WS: Healthy Sleep – Strong Days (Gesunder Schlaf)',                  price: null },
      { id: 'aok_ws_zeitmanag',  label: 'WS: Effective Time & Self-Management',                               price: null },
      { id: 'aok_ws_erholen',    label: 'WS: Recover Right – Strengthen Resources',                           price: null },
      { id: 'aok_ws_digital',    label: 'WS: Digital Stress – Switch Off Consciously',                        price: null },
      { id: 'aok_ws_kombi',      label: 'WS: Stress Under Control – The Combo Offer',                         price: null },
    ],
  },
  {
    category: 'Custom Offer',
    items: [
      { id: 'custom', label: 'Custom Offer (free text)', price: null, isCustom: true },
    ],
  },
];

const ALL_ITEMS = PRODUCT_CATALOG.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, category: cat.category }))
);

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ number, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
        {number}
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm bg-white';

// ─── Product Line Item ─────────────────────────────────────────────────────────
function ProductItem({ item, onRemove, onChange }) {
  return (
    <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 relative">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-6">
        {/* Category */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">Category</p>
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">{item.category}</span>
        </div>
        {/* Product */}
        <div className="md:col-span-2">
          <p className="text-xs font-semibold text-gray-500 mb-1">Product</p>
          <p className="text-sm font-semibold text-gray-900">{item.isCustom ? item.customLabel || 'Custom Offer' : item.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        {/* Title (for presentations/workshops) */}
        {(item.hasTitle || item.isCustom) && (
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              {item.isCustom ? 'Offer Description' : 'Title / Topic'}
            </label>
            <input
              type="text"
              value={item.title || ''}
              onChange={(e) => onChange({ ...item, title: e.target.value })}
              placeholder={item.isCustom ? 'Describe the custom offer…' : 'e.g. Stress Management in the Workplace'}
              className={inputCls}
            />
          </div>
        )}
        {/* Custom duration */}
        {item.hasDuration && (
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Duration (min)</label>
            <input
              type="number"
              value={item.duration || ''}
              onChange={(e) => onChange({ ...item, duration: e.target.value })}
              placeholder="e.g. 150"
              className={inputCls}
            />
          </div>
        )}
        {/* Price */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Price (€)</label>
          <input
            type="number"
            value={item.priceOverride ?? (item.price ?? '')}
            onChange={(e) => onChange({ ...item, priceOverride: e.target.value })}
            placeholder={item.price ? String(item.price) : 'Enter price'}
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Add Product Modal ─────────────────────────────────────────────────────────
function AddProductModal({ onAdd, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  const catItems = PRODUCT_CATALOG.find((c) => c.category === selectedCategory)?.items ?? [];

  const handleAdd = () => {
    const item = ALL_ITEMS.find((i) => i.id === selectedItem);
    if (!item) return;
    onAdd({ ...item, title: '', priceOverride: item.price ?? '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Add Product</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Category" required>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setSelectedItem(''); }}
              className={inputCls}
            >
              <option value="">— Select category —</option>
              {PRODUCT_CATALOG.map((c) => (
                <option key={c.category} value={c.category}>{c.category}</option>
              ))}
            </select>
          </Field>

          {selectedCategory && (
            <Field label="Product" required>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className={inputCls}
              >
                <option value="">— Select product —</option>
                {catItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}{item.price ? ` — €${item.price}` : ''}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedItem}
            className="flex-1 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function NewOrderPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    // Contact
    contactPerson: '', email: '',
    // Company
    companyName: '', companyStreet: '', companyZip: '', companyCity: '',
    companyCountry: 'Germany', companyPhone: '', companyContactPerson: '',
    // Assignment
    date: '', time: '', zipCode: '', city: '', region: '',
    // Logistics
    directions: '', parkingInfo: '', safetyNotes: '',
    // Fee
    fee: '', travelAllowance: '',
    // Notes
    notes: '',
  });

  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleDocuments = (e) => {
    const files = Array.from(e.target.files ?? []);
    setDocuments((p) => [...p, ...files.map((f) => ({ name: f.name, size: f.size }))]);
    e.target.value = '';
  };

  const totalPrice = products.reduce((sum, p) => {
    const price = Number(p.priceOverride ?? p.price ?? 0);
    return sum + price;
  }, 0);

  const handleSave = (asDraft) => {
    if (asDraft) setSavingDraft(true); else setSaving(true);
    setTimeout(() => {
      setSaving(false); setSavingDraft(false);
      router.push(asDraft ? '/admin/drafts' : '/admin/orders');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-5 font-semibold text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">New Order / Draft</h1>
        <p className="text-gray-600">Fill in all available information. Save as Draft if not complete yet.</p>
      </div>

      <div className="space-y-6 max-w-4xl">

        {/* ── Section 1: Contact Person ── */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <SectionHeader number="1" title="Contact Person" subtitle="Primary contact for this assignment" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Contact Person" required>
              <input type="text" value={form.contactPerson} onChange={set('contactPerson')} placeholder="Full name" className={inputCls} />
            </Field>
            <Field label="Email" required>
              <input type="email" value={form.email} onChange={set('email')} placeholder="contact@company.com" className={inputCls} />
            </Field>
          </div>
        </div>

        {/* ── Section 2: Company ── */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <SectionHeader number="2" title="Company" subtitle="Full company address and additional contact" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Company Name" required>
              <input type="text" value={form.companyName} onChange={set('companyName')} placeholder="e.g. Bosch GmbH" className={inputCls} />
            </Field>
            <Field label="Company Phone">
              <input type="tel" value={form.companyPhone} onChange={set('companyPhone')} placeholder="+49 711 400 40" className={inputCls} />
            </Field>
            <Field label="Street Address" required>
              <input type="text" value={form.companyStreet} onChange={set('companyStreet')} placeholder="e.g. Hauptstraße 1" className={inputCls} />
            </Field>
            <Field label="Country">
              <input type="text" value={form.companyCountry} onChange={set('companyCountry')} placeholder="Germany" className={inputCls} />
            </Field>
            <Field label="Zip Code" required>
              <input type="text" value={form.companyZip} onChange={set('companyZip')} placeholder="e.g. 70173" className={inputCls} />
            </Field>
            <Field label="City" required>
              <input type="text" value={form.companyCity} onChange={set('companyCity')} placeholder="e.g. Stuttgart" className={inputCls} />
            </Field>
            <Field label="Additional Contact Person at Company">
              <input type="text" value={form.companyContactPerson} onChange={set('companyContactPerson')} placeholder="Name of on-site contact" className={inputCls} />
            </Field>
          </div>
        </div>

        {/* ── Section 3: Assignment Details ── */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <SectionHeader number="3" title="Assignment Details" subtitle="Date, time and location of the assignment" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Date" required>
              <input type="date" value={form.date} onChange={set('date')} className={inputCls} />
            </Field>
            <Field label="Time" required>
              <input type="time" value={form.time} onChange={set('time')} className={inputCls} />
            </Field>
            <Field label="Zip Code (Assignment Location)" required>
              <input type="text" value={form.zipCode} onChange={set('zipCode')} placeholder="e.g. 80331" className={inputCls} />
            </Field>
            <Field label="City (Assignment Location)" required>
              <input type="text" value={form.city} onChange={set('city')} placeholder="e.g. Munich" className={inputCls} />
            </Field>
            <Field label="Region">
              <select value={form.region} onChange={set('region')} className={inputCls}>
                <option value="">— Select region —</option>
                <option value="NORD_WEST">North West</option>
                <option value="BAYERN">Bayern</option>
                <option value="BERLIN_BRANDENBURG">Berlin / Brandenburg</option>
                <option value="SACHSEN">Sachsen</option>
              </select>
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Directions / How to Get There">
              <textarea value={form.directions} onChange={set('directions')} rows={3} placeholder="e.g. Take exit 12 on A8, turn left at…" className={inputCls + ' resize-none'} />
            </Field>
            <Field label="Parking Options">
              <textarea value={form.parkingInfo} onChange={set('parkingInfo')} rows={3} placeholder="e.g. Free parking available in lot B behind the building" className={inputCls + ' resize-none'} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Safety Instructions (if applicable)">
                <textarea value={form.safetyNotes} onChange={set('safetyNotes')} rows={2} placeholder="e.g. High-visibility vest required, check in at security gate" className={inputCls + ' resize-none'} />
              </Field>
            </div>
          </div>
        </div>

        {/* ── Section 4: Products ── */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <SectionHeader number="4" title="Products & Services" subtitle="Add one or more products. Prices are auto-filled from the price list." />

          {products.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 mb-4">
              No products added yet. Click below to add a product.
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              {products.map((p, i) => (
                <ProductItem
                  key={i}
                  item={p}
                  onRemove={() => setProducts((prev) => prev.filter((_, j) => j !== i))}
                  onChange={(updated) => setProducts((prev) => prev.map((x, j) => j === i ? updated : x))}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowProductModal(true)}
            className="inline-flex items-center gap-2 border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Product
          </button>

          {products.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-0.5">Total (products with known prices)</p>
                <p className="text-2xl font-bold text-green-700">€{totalPrice.toLocaleString('de-DE')}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Section 5: Fee ── */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <SectionHeader number="5" title="Fee & Travel" subtitle="Compensation for the assigned freelancer" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Freelancer Fee (€)">
              <input type="number" value={form.fee} onChange={set('fee')} placeholder="e.g. 350" className={inputCls} />
            </Field>
            <Field label="Travel Allowance / FKP (€)">
              <input type="number" value={form.travelAllowance} onChange={set('travelAllowance')} placeholder="e.g. 40" className={inputCls} />
            </Field>
          </div>
        </div>

        {/* ── Section 6: Documents ── */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <SectionHeader number="6" title="Documents" subtitle="Upload presentations, feedback forms, briefings, etc." />

          <label className="w-full border-2 border-dashed border-gray-300 hover:border-green-500 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:text-green-600 transition-colors cursor-pointer">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm font-medium">Click to upload files</span>
            <span className="text-xs">PDF, PPTX, DOCX, images accepted</span>
            <input type="file" multiple className="hidden" onChange={handleDocuments} />
          </label>

          {documents.length > 0 && (
            <ul className="mt-4 space-y-2">
              {documents.map((doc, i) => (
                <li key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate font-medium text-gray-700">{doc.name}</span>
                    <span className="text-gray-400 shrink-0">{(doc.size / 1024).toFixed(0)} KB</span>
                  </div>
                  <button onClick={() => setDocuments((p) => p.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 ml-2 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Section 7: Notes ── */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <SectionHeader number="7" title="Notes" subtitle='e.g. "Check in at reception", special requirements, etc.' />
          <textarea
            value={form.notes}
            onChange={set('notes')}
            rows={4}
            placeholder="Any additional notes for the freelancer or the team…"
            className={inputCls + ' resize-none'}
          />
        </div>

        {/* ── Action Buttons ── */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || savingDraft}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>
              ) : 'Create Order'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || savingDraft}
              className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {savingDraft ? (
                <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>
              ) : (
                <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>Save as Draft</>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving || savingDraft}
              className="sm:w-32 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Drafts are visible to all admins in the same region and will show your creator initials.
          </p>
        </div>
      </div>

      {showProductModal && (
        <AddProductModal
          onAdd={(item) => setProducts((p) => [...p, item])}
          onClose={() => setShowProductModal(false)}
        />
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Default template data ────────────────────────────────────────────────────
const DEFAULT_TEMPLATE = {
  companyName:   'FreelanceHub GmbH',
  address:       'Unter den Linden 10',
  city:          '10117 Berlin',
  country:       'Germany',
  email:         'billing@freelancehub.de',
  phone:         '+49 30 123456789',
  website:       'www.freelancehub.de',
  taxId:         'DE123456789',
  iban:          'DE89 3704 0044 0532 0130 00',
  bic:           'COBADEFFXXX',
  bankName:      'Commerzbank Berlin',
  vatRate:       '19',
  currency:      'EUR',
  paymentTerms:  '14',
  footerNote:    'Thank you for your business. Please transfer the amount within the payment period specified above.',
  primaryColor:  '#16a34a',
  showLogo:      true,
  showBankDetails: true,
  showVat:       true,
  numberPrefix:  'INV-OUT-',
  numberYear:    true,
};

const CURRENCY_OPTIONS = ['EUR', 'USD', 'GBP', 'CHF'];
const VAT_OPTIONS = ['0', '7', '19', '20', '21', '25'];
const PAYMENT_TERMS = [
  { value: '7',  label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
  { value: '45', label: '45 days' },
  { value: '60', label: '60 days' },
];

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {hint && <span className="ml-1 font-normal text-gray-400 text-xs">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm bg-white';

// ─── Invoice Preview ──────────────────────────────────────────────────────────
function InvoicePreview({ tpl }) {
  const today = new Date().toISOString().slice(0, 10);
  const dueDate = new Date(Date.now() + parseInt(tpl.paymentTerms ?? 14) * 86400000).toISOString().slice(0, 10);
  const exampleNum = `${tpl.numberPrefix}${tpl.numberYear ? '2026-' : ''}001`;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden text-[13px]">
      {/* Preview label */}
      <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Preview</span>
        <span className="ml-auto text-xs text-gray-400">Example invoice</span>
      </div>

      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {tpl.showLogo && (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl mb-3"
                style={{ backgroundColor: tpl.primaryColor }}
              >
                F
              </div>
            )}
            <h2 className="text-xl font-black text-gray-900">{tpl.companyName || 'Company Name'}</h2>
            <p className="text-gray-500 mt-0.5">{tpl.address}</p>
            <p className="text-gray-500">{tpl.city}</p>
            <p className="text-gray-500">{tpl.country}</p>
            {tpl.taxId && <p className="text-gray-400 mt-1 text-xs">Tax ID: {tpl.taxId}</p>}
          </div>
          <div className="text-right">
            <div className="text-3xl font-black mb-2" style={{ color: tpl.primaryColor }}>INVOICE</div>
            <p className="text-gray-400 text-xs">Invoice No.</p>
            <p className="font-bold text-gray-800">{exampleNum}</p>
            <p className="text-gray-400 text-xs mt-2">Issue date</p>
            <p className="font-medium text-gray-700">{today}</p>
            <p className="text-gray-400 text-xs mt-1">Due date</p>
            <p className="font-medium text-gray-700">{dueDate}</p>
          </div>
        </div>

        {/* Bill to */}
        <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bill To</p>
            <p className="font-bold text-gray-800">Example Client GmbH</p>
            <p className="text-gray-500">Musterstraße 1</p>
            <p className="text-gray-500">10115 Berlin, Germany</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Terms</p>
            <p className="font-medium text-gray-700">{tpl.paymentTerms} days net</p>
            {tpl.currency && <p className="text-gray-500 mt-1">Currency: {tpl.currency}</p>}
          </div>
        </div>

        {/* Line items */}
        <table className="w-full mb-5">
          <thead>
            <tr style={{ backgroundColor: tpl.primaryColor + '1a' }}>
              <th className="text-left px-3 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wide rounded-tl-lg">Description</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wide">Qty</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wide">Unit Price</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wide rounded-tr-lg">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-3 py-3 text-gray-700">Health Service – Freelancer Assignment</td>
              <td className="px-3 py-3 text-right text-gray-600">1</td>
              <td className="px-3 py-3 text-right text-gray-600">€800.00</td>
              <td className="px-3 py-3 text-right font-semibold text-gray-800">€800.00</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-3 py-3 text-gray-700">Platform service fee (18.75%)</td>
              <td className="px-3 py-3 text-right text-gray-600">1</td>
              <td className="px-3 py-3 text-right text-gray-600">€150.00</td>
              <td className="px-3 py-3 text-right font-semibold text-gray-800">€150.00</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-52 space-y-1.5">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">€950.00</span>
            </div>
            {tpl.showVat && (
              <div className="flex justify-between text-gray-600">
                <span>VAT ({tpl.vatRate}%)</span>
                <span className="font-medium">€{(950 * parseFloat(tpl.vatRate ?? 19) / 100).toFixed(2)}</span>
              </div>
            )}
            <div
              className="flex justify-between font-black text-base pt-2 border-t-2"
              style={{ borderColor: tpl.primaryColor, color: tpl.primaryColor }}
            >
              <span>Total</span>
              <span>€{(950 * (1 + parseFloat(tpl.vatRate ?? 19) / 100)).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Bank details */}
        {tpl.showBankDetails && tpl.iban && (
          <div className="p-4 rounded-xl border mb-4" style={{ borderColor: tpl.primaryColor + '40', backgroundColor: tpl.primaryColor + '08' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: tpl.primaryColor }}>Bank Details</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-400">Bank</p>
                <p className="font-mono text-xs font-medium text-gray-700">{tpl.bankName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">IBAN</p>
                <p className="font-mono text-xs font-medium text-gray-700">{tpl.iban}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">BIC/SWIFT</p>
                <p className="font-mono text-xs font-medium text-gray-700">{tpl.bic}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer note */}
        {tpl.footerNote && (
          <p className="text-xs text-gray-400 text-center border-t border-gray-100 pt-4">{tpl.footerNote}</p>
        )}

        {/* Contact line */}
        <div className="flex justify-center gap-4 mt-3 text-xs text-gray-400">
          {tpl.email   && <span>{tpl.email}</span>}
          {tpl.phone   && <span>·</span>}
          {tpl.phone   && <span>{tpl.phone}</span>}
          {tpl.website && <span>·</span>}
          {tpl.website && <span>{tpl.website}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InvoiceTemplatePage() {
  const [tpl, setTpl] = useState(DEFAULT_TEMPLATE);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('company'); // company | numbering | payment | appearance

  const set = (key, val) => {
    setTpl((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    // In real implementation, save to API
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { key: 'company',    label: 'Company Info' },
    { key: 'numbering',  label: 'Numbering' },
    { key: 'payment',    label: 'Payment' },
    { key: 'appearance', label: 'Appearance' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Back */}
      <div className="mb-6">
        <Link href="/admin/invoices" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Invoices
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Invoice Template</h1>
          <p className="text-gray-500 text-sm mt-1">Configure the default layout and branding for all outgoing invoices.</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            saved
              ? 'bg-green-100 text-green-700 border-2 border-green-300'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {saved ? '✓ Saved' : 'Save Template'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Left — settings panel */}
        <div className="space-y-5">

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === t.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Company Info */}
          {activeTab === 'company' && (
            <Section title="Company Information" description="This information appears on every invoice you send.">
              <div className="grid grid-cols-1 gap-4">
                <Field label="Company Name">
                  <input type="text" value={tpl.companyName} onChange={(e) => set('companyName', e.target.value)} className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Street Address">
                    <input type="text" value={tpl.address} onChange={(e) => set('address', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="City & Postcode">
                    <input type="text" value={tpl.city} onChange={(e) => set('city', e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <Field label="Country">
                  <input type="text" value={tpl.country} onChange={(e) => set('country', e.target.value)} className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email">
                    <input type="email" value={tpl.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Phone">
                    <input type="tel" value={tpl.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <Field label="Website" hint="optional">
                  <input type="text" value={tpl.website} onChange={(e) => set('website', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Tax / VAT ID">
                  <input type="text" value={tpl.taxId} onChange={(e) => set('taxId', e.target.value)} className={inputCls} />
                </Field>
              </div>
            </Section>
          )}

          {/* Numbering */}
          {activeTab === 'numbering' && (
            <Section title="Invoice Numbering" description="Define how invoice numbers are generated for outgoing invoices.">
              <div className="space-y-4">
                <Field label="Invoice Number Prefix" hint="e.g. INV-OUT-, FH-, RG-">
                  <input type="text" value={tpl.numberPrefix} onChange={(e) => set('numberPrefix', e.target.value)} className={inputCls} />
                </Field>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Include year in number</p>
                    <p className="text-xs text-gray-500 mt-0.5">e.g. {tpl.numberPrefix}2026-001 vs {tpl.numberPrefix}001</p>
                  </div>
                  <button
                    onClick={() => set('numberYear', !tpl.numberYear)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${tpl.numberYear ? 'bg-green-600' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tpl.numberYear ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Preview</p>
                  <p className="font-mono font-bold text-gray-800 text-base">
                    {tpl.numberPrefix}{tpl.numberYear ? '2026-' : ''}001
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Next number will be assigned automatically.</p>
                </div>
              </div>
            </Section>
          )}

          {/* Payment */}
          {activeTab === 'payment' && (
            <Section title="Payment Settings" description="Default payment terms and bank account shown on outgoing invoices.">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Default Payment Terms">
                    <select value={tpl.paymentTerms} onChange={(e) => set('paymentTerms', e.target.value)} className={inputCls}>
                      {PAYMENT_TERMS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Currency">
                    <select value={tpl.currency} onChange={(e) => set('currency', e.target.value)} className={inputCls}>
                      {CURRENCY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Show VAT on invoice</p>
                    <p className="text-xs text-gray-500 mt-0.5">Display VAT line item in totals section</p>
                  </div>
                  <button
                    onClick={() => set('showVat', !tpl.showVat)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${tpl.showVat ? 'bg-green-600' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tpl.showVat ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {tpl.showVat && (
                  <Field label="Default VAT Rate (%)">
                    <select value={tpl.vatRate} onChange={(e) => set('vatRate', e.target.value)} className={inputCls}>
                      {VAT_OPTIONS.map((v) => <option key={v} value={v}>{v}%</option>)}
                    </select>
                  </Field>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Show bank details</p>
                      <p className="text-xs text-gray-500 mt-0.5">Display IBAN & BIC on outgoing invoices</p>
                    </div>
                    <button
                      onClick={() => set('showBankDetails', !tpl.showBankDetails)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${tpl.showBankDetails ? 'bg-green-600' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tpl.showBankDetails ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  {tpl.showBankDetails && (
                    <div className="space-y-3">
                      <Field label="Bank Name">
                        <input type="text" value={tpl.bankName} onChange={(e) => set('bankName', e.target.value)} className={inputCls} />
                      </Field>
                      <Field label="IBAN">
                        <input type="text" value={tpl.iban} onChange={(e) => set('iban', e.target.value)} className={inputCls} placeholder="DE89 3704 0044 0532 0130 00" />
                      </Field>
                      <Field label="BIC / SWIFT">
                        <input type="text" value={tpl.bic} onChange={(e) => set('bic', e.target.value)} className={inputCls} placeholder="COBADEFFXXX" />
                      </Field>
                    </div>
                  )}
                </div>

                <Field label="Footer Note" hint="shown at the bottom of every invoice">
                  <textarea
                    rows={3}
                    value={tpl.footerNote}
                    onChange={(e) => set('footerNote', e.target.value)}
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>
            </Section>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <Section title="Appearance" description="Brand your invoices with your company colour and logo.">
              <div className="space-y-5">
                <Field label="Brand Color">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={tpl.primaryColor}
                      onChange={(e) => set('primaryColor', e.target.value)}
                      className="w-12 h-10 border-2 border-gray-200 rounded-lg cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={tpl.primaryColor}
                      onChange={(e) => set('primaryColor', e.target.value)}
                      className={`${inputCls} flex-1 font-mono`}
                      placeholder="#16a34a"
                    />
                  </div>
                </Field>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Show company logo</p>
                    <p className="text-xs text-gray-500 mt-0.5">Display the logo mark at the top of the invoice</p>
                  </div>
                  <button
                    onClick={() => set('showLogo', !tpl.showLogo)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${tpl.showLogo ? 'bg-green-600' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tpl.showLogo ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Color presets */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Color Presets</p>
                  <div className="flex gap-2 flex-wrap">
                    {['#16a34a','#2563eb','#7c3aed','#dc2626','#ea580c','#0891b2','#be185d','#374151'].map((color) => (
                      <button
                        key={color}
                        onClick={() => set('primaryColor', color)}
                        className="w-8 h-8 rounded-lg transition-transform hover:scale-110 border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: tpl.primaryColor === color ? '#111827' : 'transparent',
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* FastBill notice */}
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0">FB</div>
                  <div>
                    <p className="text-sm font-semibold text-indigo-900">FastBill Integration</p>
                    <p className="text-xs text-indigo-700 mt-0.5">
                      When FastBill is connected, approved invoices are automatically synced and branded invoices can be generated directly through FastBill.
                    </p>
                    <button className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline">Configure FastBill →</button>
                  </div>
                </div>
              </div>
            </Section>
          )}

          {/* Save button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                saved
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {saved ? '✓ Template Saved' : 'Save Template'}
            </button>
            <button
              onClick={() => { setTpl(DEFAULT_TEMPLATE); setSaved(false); }}
              className="px-4 py-3 border-2 border-gray-300 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right — live preview */}
        <div className="space-y-4">
          <InvoicePreview tpl={tpl} />
        </div>
      </div>
    </div>
  );
}

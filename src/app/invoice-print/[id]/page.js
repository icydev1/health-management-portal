'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

// ─── Mock data (same as detail page) ─────────────────────────────────────────
const MOCK_INVOICES = [
  { id: '1',  num: 'INV-2026-012', type: 'incoming', from: 'Sarah Ahmed',     initials: 'SA', amount: '€350.00',   date: '2026-04-10', due: '2026-04-24', status: 'pending',   handledBy: null,  orderRef: 'ORD-2026-045', description: 'Nutrition Presentation – PharmaGroup GmbH',  fastbillId: null,     address: 'Musterstraße 12, 10115 Berlin',                           iban: 'DE89 3704 0044 0532 0130 00', bic: 'COBADEFFXXX', bankName: 'Commerzbank Berlin', taxId: 'DE287654321', items: [{ desc: 'Nutrition Presentation (4h)', qty: 1, unit: '€350.00', total: '€350.00' }], subtotal: '€350.00', vatRate: 19, vatAmt: 66.50,  total: 416.50,  notes: '' },
  { id: '2',  num: 'INV-2026-011', type: 'incoming', from: 'Peter Schulz',    initials: 'PS', amount: '€420.00',   date: '2026-04-09', due: '2026-04-23', status: 'pending',   handledBy: null,  orderRef: 'ORD-2026-042', description: 'Workshop – Siemens AG',                       fastbillId: null,     address: 'Lindenweg 5, 20095 Hamburg',                              iban: 'DE12 2004 1010 0505 0150 00', bic: 'COBADEFFXXX', bankName: 'Commerzbank Hamburg', taxId: 'DE287123456', items: [{ desc: 'Workshop facilitation (6h)', qty: 1, unit: '€420.00', total: '€420.00' }], subtotal: '€420.00', vatRate: 19, vatAmt: 79.80,  total: 499.80,  notes: '' },
  { id: '3',  num: 'INV-2026-010', type: 'incoming', from: 'Lisa Braun',      initials: 'LB', amount: '€180.00',   date: '2026-04-07', due: '2026-04-21', status: 'on_hold',   handledBy: 'YL',  orderRef: 'ORD-2026-044', description: 'Survey Participation – TechCorp AG',          fastbillId: null,     address: 'Rosenstraße 8, 80331 München',                            iban: 'DE21 7001 1110 0530 2200 00', bic: 'COBADEFFXXX', bankName: 'Deutsche Bank München', taxId: 'DE288765432', items: [{ desc: 'Survey facilitation (2h)', qty: 1, unit: '€180.00', total: '€180.00' }], subtotal: '€180.00', vatRate: 19, vatAmt: 34.20,  total: 214.20,  notes: 'Missing receipt for travel expenses.' },
  { id: '4',  num: 'INV-2026-009', type: 'incoming', from: 'Tom Brandt',      initials: 'TB', amount: '€290.00',   date: '2026-04-05', due: '2026-04-19', status: 'approved',  handledBy: 'MS',  orderRef: 'ORD-2026-041', description: 'Cardio Screening – Deutsche Telekom',         fastbillId: 'FB-8821',address: 'Bergstraße 22, 60313 Frankfurt',                          iban: 'DE57 5001 0517 0648 4898 90', bic: 'INGDDEFFXXX', bankName: 'ING-DiBa Frankfurt', taxId: 'DE289012345', items: [{ desc: 'Cardio screening (3h)', qty: 1, unit: '€290.00', total: '€290.00' }], subtotal: '€290.00', vatRate: 19, vatAmt: 55.10,  total: 345.10,  notes: '' },
  { id: '5',  num: 'INV-2026-008', type: 'incoming', from: 'Alex Brown',      initials: 'AB', amount: '€220.00',   date: '2026-04-02', due: '2026-04-16', status: 'paid',      handledBy: 'YL',  orderRef: 'ORD-2026-040', description: 'Marketing Evaluation – MediaGroup GmbH',     fastbillId: 'FB-8810',address: 'Hauptstraße 3, 04109 Leipzig',                            iban: 'DE87 3607 0024 0689 7315 00', bic: 'DEUTDEDBLEG', bankName: 'Deutsche Bank Leipzig', taxId: 'DE290123456', items: [{ desc: 'Marketing evaluation (2.5h)', qty: 1, unit: '€220.00', total: '€220.00' }], subtotal: '€220.00', vatRate: 19, vatAmt: 41.80,  total: 261.80,  notes: '' },
  { id: '6',  num: 'INV-2026-007', type: 'incoming', from: 'Julia Meier',     initials: 'JM', amount: '€160.00',   date: '2026-03-30', due: '2026-04-13', status: 'cancelled', handledBy: 'YL',  orderRef: 'ORD-2026-039', description: 'Retail Audit – RetailPlus GmbH',              fastbillId: null,     address: 'Schillerplatz 1, 70173 Stuttgart',                        iban: 'DE91 6005 0101 7815 3869 87', bic: 'STUTTGARDXXX', bankName: 'Landesbank Stuttgart', taxId: 'DE291234567', items: [{ desc: 'Retail audit (2h)', qty: 1, unit: '€160.00', total: '€160.00' }], subtotal: '€160.00', vatRate: 19, vatAmt: 30.40,  total: 190.40,  notes: 'Cancelled – freelancer did not complete the order.' },
  { id: '7',  num: 'INV-2026-006', type: 'incoming', from: 'Maria Hoffmann',  initials: 'MH', amount: '€480.00',   date: '2026-03-25', due: '2026-04-08', status: 'paid',      handledBy: 'MS',  orderRef: 'ORD-2026-038', description: 'Employee Wellness – Bosch GmbH',              fastbillId: 'FB-8798',address: 'Kaiserstraße 14, 76133 Karlsruhe',                        iban: 'DE12 6601 0075 0515 8985 00', bic: 'COBADEFFXXX', bankName: 'Commerzbank Karlsruhe', taxId: 'DE292345678', items: [{ desc: 'Wellness workshop (full day)', qty: 1, unit: '€480.00', total: '€480.00' }], subtotal: '€480.00', vatRate: 19, vatAmt: 91.20,  total: 571.20,  notes: '' },
  { id: '8',  num: 'INV-OUT-004',  type: 'outgoing', from: 'PharmaGroup GmbH',initials: 'PG', amount: '€950.00',   date: '2026-04-08', due: '2026-04-22', status: 'pending',   handledBy: 'YL',  orderRef: 'ORD-2026-045', description: 'Service Invoice – Nutrition Presentation',    fastbillId: 'FB-8830',address: 'PharmaGroup GmbH, Am Promenadeplatz 6, 80333 München',    iban: '', bic: '', bankName: '', taxId: '', items: [{ desc: 'Nutrition Presentation – Freelancer Service', qty: 1, unit: '€800.00', total: '€800.00' }, { desc: 'Platform service fee (18.75%)', qty: 1, unit: '€150.00', total: '€150.00' }], subtotal: '€950.00', vatRate: 19, vatAmt: 180.50, total: 1130.50, notes: '' },
  { id: '9',  num: 'INV-OUT-003',  type: 'outgoing', from: 'Siemens AG',      initials: 'SI', amount: '€1,200.00', date: '2026-04-01', due: '2026-04-15', status: 'paid',      handledBy: 'MS',  orderRef: 'ORD-2026-043', description: 'Service Invoice – Presentation Review',      fastbillId: 'FB-8805',address: 'Siemens AG, Werner-von-Siemens-Str. 1, 80333 München',    iban: '', bic: '', bankName: '', taxId: '', items: [{ desc: 'Presentation Review – Freelancer Service', qty: 1, unit: '€1,010.00', total: '€1,010.00' }, { desc: 'Platform service fee (18.8%)', qty: 1, unit: '€190.00', total: '€190.00' }], subtotal: '€1,200.00', vatRate: 19, vatAmt: 228.00, total: 1428.00, notes: 'Payment received on 2026-04-14.' },
  { id: '10', num: 'INV-OUT-002',  type: 'outgoing', from: 'TechCorp AG',     initials: 'TC', amount: '€750.00',   date: '2026-03-20', due: '2026-04-03', status: 'paid',      handledBy: 'YL',  orderRef: 'ORD-2026-041', description: 'Service Invoice – Survey Participation',      fastbillId: 'FB-8790',address: 'TechCorp AG, Frankfurter Allee 100, 10247 Berlin',        iban: '', bic: '', bankName: '', taxId: '', items: [{ desc: 'Survey Participation – Freelancer Service', qty: 1, unit: '€630.00', total: '€630.00' }, { desc: 'Platform service fee (19%)', qty: 1, unit: '€120.00', total: '€120.00' }], subtotal: '€750.00', vatRate: 19, vatAmt: 142.50, total: 892.50,  notes: '' },
];

const STATUS_LABELS = {
  pending: 'Pending', on_hold: 'On Hold', approved: 'Approved', paid: 'Paid', cancelled: 'Cancelled',
};

export default function InvoicePrintPage() {
  const params = useParams();
  const invoice = MOCK_INVOICES.find((inv) => inv.id === params?.id) ?? MOCK_INVOICES[0];

  // Auto-trigger print dialog after render
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 800);
    return () => clearTimeout(timer);
  }, []);

  const isOutgoing = invoice.type === 'outgoing';
  const brandColor = '#16a34a';

  return (
    <>
      {/* Print styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #111; background: #fff; }

        @media screen {
          body { background: #f3f4f6; padding: 32px; }
          .invoice-page { max-width: 794px; margin: 0 auto; background: #fff; box-shadow: 0 4px 32px rgba(0,0,0,0.12); border-radius: 12px; overflow: hidden; }
          .print-bar { max-width: 794px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: space-between; }
          .print-btn { display: inline-flex; align-items: center; gap: 8px; background: #16a34a; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }
          .print-btn:hover { background: #15803d; }
          .back-link { font-size: 13px; color: #6b7280; text-decoration: none; display: flex; align-items: center; gap: 6px; }
          .back-link:hover { color: #111; }
        }

        @media print {
          body { padding: 0; background: #fff; }
          .invoice-page { box-shadow: none; border-radius: 0; max-width: 100%; }
          .print-bar { display: none !important; }
          @page { margin: 15mm 15mm 20mm 15mm; size: A4; }
        }

        /* ── Layout ── */
        .invoice-page { padding: 0; }
        .inv-header  { padding: 36px 44px 28px; border-bottom: 3px solid ${brandColor}; display: flex; justify-content: space-between; align-items: flex-start; }
        .inv-body    { padding: 32px 44px; }
        .inv-footer  { padding: 20px 44px; border-top: 1px solid #e5e7eb; background: #f9fafb; }

        /* ── Brand mark ── */
        .brand-mark { width: 48px; height: 48px; background: ${brandColor}; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22px; font-weight: 900; margin-bottom: 10px; }
        .company-name { font-size: 20px; font-weight: 900; color: #111; }
        .company-sub  { font-size: 12px; color: #6b7280; margin-top: 2px; line-height: 1.6; }

        /* ── Invoice title block ── */
        .inv-title-block { text-align: right; }
        .inv-title    { font-size: 30px; font-weight: 900; color: ${brandColor}; letter-spacing: -1px; }
        .inv-meta     { margin-top: 10px; font-size: 12px; color: #374151; line-height: 1.8; }
        .inv-meta strong { color: #111; }

        /* ── Parties ── */
        .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; padding: 20px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; }
        .party-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .party-name  { font-size: 14px; font-weight: 800; color: #111; margin-bottom: 4px; }
        .party-addr  { font-size: 12px; color: #4b5563; line-height: 1.6; }
        .party-tax   { font-size: 11px; color: #9ca3af; margin-top: 4px; }

        /* ── Items table ── */
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table thead tr { background: ${brandColor}18; }
        .items-table th { padding: 10px 12px; text-align: left; font-size: 10px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 2px solid ${brandColor}30; }
        .items-table th.right, .items-table td.right { text-align: right; }
        .items-table td { padding: 11px 12px; font-size: 13px; color: #1f2937; border-bottom: 1px solid #f3f4f6; }
        .items-table tbody tr:last-child td { border-bottom: none; }
        .items-table tfoot td { padding: 8px 12px; font-size: 12px; color: #4b5563; }
        .items-table tfoot .total-row td { font-size: 15px; font-weight: 900; color: ${brandColor}; padding-top: 12px; border-top: 2px solid ${brandColor}; }

        /* ── Bank details ── */
        .bank-box { margin-top: 24px; padding: 16px 20px; border: 1px solid ${brandColor}30; border-radius: 8px; background: ${brandColor}08; }
        .bank-label { font-size: 10px; font-weight: 700; color: ${brandColor}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .bank-grid  { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .bank-item-label { font-size: 10px; color: #9ca3af; margin-bottom: 2px; }
        .bank-item-val   { font-family: 'Courier New', monospace; font-size: 12px; font-weight: 600; color: #1f2937; }

        /* ── Status stamp ── */
        .status-stamp { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border: 2px solid; }
        .status-paid      { color: #15803d; border-color: #86efac; background: #f0fdf4; }
        .status-approved  { color: #1d4ed8; border-color: #93c5fd; background: #eff6ff; }
        .status-pending   { color: #b45309; border-color: #fde68a; background: #fffbeb; }
        .status-on_hold   { color: #c2410c; border-color: #fdba74; background: #fff7ed; }
        .status-cancelled { color: #dc2626; border-color: #fca5a5; background: #fef2f2; }

        /* ── Notes ── */
        .notes-box { margin-top: 20px; padding: 12px 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; font-size: 12px; color: #92400e; }

        /* ── Footer ── */
        .footer-note { font-size: 11px; color: #6b7280; text-align: center; line-height: 1.6; }
        .footer-contact { display: flex; justify-content: center; gap: 16px; margin-top: 8px; font-size: 11px; color: #9ca3af; }
        .footer-divider { color: #d1d5db; }
        .fastbill-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; background: #4338ca; color: #fff; border-radius: 4px; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; }
      `}</style>

      {/* Screen-only toolbar */}
      <div className="print-bar">
        <a href={`/admin/invoices/${invoice.id}`} className="back-link" onClick={(e) => { e.preventDefault(); window.close(); }}>
          ← Back to Invoice
        </a>
        <button className="print-btn" onClick={() => window.print()}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download / Print PDF
        </button>
      </div>

      {/* Invoice document */}
      <div className="invoice-page">

        {/* Header */}
        <div className="inv-header">
          <div>
            <div className="brand-mark">F</div>
            <div className="company-name">FreelanceHub GmbH</div>
            <div className="company-sub">
              Unter den Linden 10, 10117 Berlin<br />
              billing@freelancehub.de · +49 30 123456789<br />
              Tax ID: DE123456789
            </div>
          </div>
          <div className="inv-title-block">
            <div className="inv-title">INVOICE</div>
            <div className="inv-meta">
              <div><strong>Invoice No.</strong> {invoice.num}</div>
              <div><strong>Issue date</strong> {invoice.date}</div>
              <div><strong>Due date</strong> {invoice.due}</div>
              <div><strong>Order ref.</strong> {invoice.orderRef}</div>
              {invoice.fastbillId && (
                <div style={{ marginTop: 8 }}>
                  <span className="fastbill-badge">FB {invoice.fastbillId}</span>
                </div>
              )}
              <div style={{ marginTop: 10 }}>
                <span className={`status-stamp status-${invoice.status}`}>
                  {STATUS_LABELS[invoice.status] ?? invoice.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="inv-body">

          {/* Parties */}
          <div className="parties">
            <div>
              <div className="party-label">{isOutgoing ? 'Bill To' : 'From (Freelancer)'}</div>
              <div className="party-name">{invoice.from}</div>
              <div className="party-addr">{invoice.address}</div>
              {invoice.taxId && <div className="party-tax">Tax ID: {invoice.taxId}</div>}
            </div>
            <div>
              <div className="party-label">{isOutgoing ? 'From' : 'Bill To'}</div>
              <div className="party-name">FreelanceHub GmbH</div>
              <div className="party-addr">Unter den Linden 10<br />10117 Berlin, Germany</div>
              <div className="party-tax">Tax ID: DE123456789</div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20, padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Service Description</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{invoice.description}</div>
          </div>

          {/* Line items */}
          <table className="items-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Description</th>
                <th className="right" style={{ width: '10%' }}>Qty</th>
                <th className="right" style={{ width: '20%' }}>Unit Price</th>
                <th className="right" style={{ width: '20%' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.desc}</td>
                  <td className="right">{item.qty}</td>
                  <td className="right">{item.unit}</td>
                  <td className="right" style={{ fontWeight: 700 }}>{item.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="right" style={{ paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>Subtotal</td>
                <td className="right" style={{ paddingTop: 16, borderTop: '1px solid #e5e7eb', fontWeight: 600 }}>{invoice.subtotal}</td>
              </tr>
              <tr>
                <td colSpan={3} className="right">VAT ({invoice.vatRate}%)</td>
                <td className="right" style={{ fontWeight: 600 }}>€{invoice.vatAmt.toFixed(2)}</td>
              </tr>
              <tr className="total-row">
                <td colSpan={3} className="right">Total Due</td>
                <td className="right">€{invoice.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Bank details (incoming: freelancer's bank; outgoing: FreelanceHub's bank) */}
          {(invoice.iban || isOutgoing) && (
            <div className="bank-box">
              <div className="bank-label">Payment Details</div>
              <div className="bank-grid">
                <div>
                  <div className="bank-item-label">Bank</div>
                  <div className="bank-item-val">{isOutgoing ? 'Commerzbank Berlin' : invoice.bankName}</div>
                </div>
                <div>
                  <div className="bank-item-label">IBAN</div>
                  <div className="bank-item-val">{isOutgoing ? 'DE89 3704 0044 0532 0130 00' : invoice.iban}</div>
                </div>
                <div>
                  <div className="bank-item-label">BIC / SWIFT</div>
                  <div className="bank-item-val">{isOutgoing ? 'COBADEFFXXX' : invoice.bic}</div>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: '#6b7280' }}>
                Please use <strong>{invoice.num}</strong> as the payment reference.
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="notes-box">
              <strong>Note:</strong> {invoice.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="inv-footer">
          <div className="footer-note">
            Thank you for your business. Please transfer the amount within the payment period specified above.
          </div>
          <div className="footer-contact">
            <span>billing@freelancehub.de</span>
            <span className="footer-divider">·</span>
            <span>+49 30 123456789</span>
            <span className="footer-divider">·</span>
            <span>www.freelancehub.de</span>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { jsPDF } from 'jspdf';

// ─── Invoice number generator ─────────────────────────────────────────────────
function genInvoiceNo() {
  const d = new Date();
  return `VLAB-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}${String(Date.now()).slice(-4)}`;
}

// ─── PDF Invoice generator ────────────────────────────────────────────────────
function generateInvoicePDF(data, plan) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, margin = 20;
  let y = margin;

  // Header bar
  pdf.setFillColor(11, 17, 32);
  pdf.rect(0, 0, W, 40, 'F');

  // Brand
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('⚡ VLab', margin, 16);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(148, 163, 184);
  pdf.text('Virtual Laboratory Platform for Engineering Colleges', margin, 23);
  pdf.text('contact@vlab.edu.in  |  vlab.vercel.app', margin, 29);

  // Invoice label top-right
  pdf.setTextColor(13, 148, 136);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE', W - margin, 16, { align: 'right' });
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(200, 200, 200);
  pdf.text(`No: ${data.invoiceNo}`, W - margin, 23, { align: 'right' });
  pdf.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, W - margin, 29, { align: 'right' });
  pdf.text(`Valid for 30 days`, W - margin, 35, { align: 'right' });

  y = 52;

  // Billed To section
  pdf.setTextColor(100, 116, 139);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BILLED TO', margin, y);
  y += 5;
  pdf.setTextColor(30, 41, 59);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.collegeName, margin, y);
  y += 5;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.text(data.deptName, margin, y); y += 5;
  pdf.text(`Contact: ${data.contactName}`, margin, y); y += 5;
  pdf.text(`Email: ${data.email}`, margin, y); y += 5;
  if (data.gst) { pdf.text(`GSTIN: ${data.gst}`, margin, y); y += 5; }
  if (data.phone) { pdf.text(`Phone: ${data.phone}`, margin, y); y += 5; }

  y += 8;

  // Plan table
  pdf.setFillColor(241, 245, 249);
  pdf.rect(margin, y, W - 2 * margin, 10, 'F');
  pdf.setTextColor(51, 65, 85);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Description', margin + 3, y + 6.5);
  pdf.text('Amount (INR)', W - margin - 3, y + 6.5, { align: 'right' });
  y += 12;

  const planPrices = { pilot: '0', department: '35,000', campus: '1,20,000' };
  const planDesc = {
    pilot: `VLab Pilot Plan — 45 Days\n1 Teacher · 1 Class · All Experiments\nFull access to circuit simulation & analytics`,
    department: `VLab Department Plan — Annual\nUp to 10 Teachers · Unlimited Students\nAll experiments · Analytics · AI Lab Reports\nPDF lab record exports · Priority support`,
    campus: `VLab Campus Plan — Annual\nUnlimited Teachers & Departments\nWhite-label (your logo & domain)\nAll Department features + dedicated onboarding\nQuarterly NAAC/NBA reports · SLA 99.5%`,
  };

  const lines = planDesc[plan.id].split('\n');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text(lines[0], margin + 3, y);
  y += 5;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(71, 85, 105);
  lines.slice(1).forEach(l => { pdf.text(l, margin + 3, y); y += 5; });

  const baseAmount = planPrices[plan.id];
  const numericAmount = parseInt(baseAmount.replace(/,/g, '')) || 0;
  const gst = Math.round(numericAmount * 0.18);
  const total = numericAmount + gst;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text(`₹${baseAmount}`, W - margin - 3, y - (lines.length - 1) * 5 - 5, { align: 'right' });

  y += 6;
  // Divider
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, y, W - margin, y);
  y += 8;

  if (numericAmount > 0) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);
    pdf.text('Subtotal', W - margin - 40, y);
    pdf.text(`₹${baseAmount}`, W - margin - 3, y, { align: 'right' });
    y += 6;
    pdf.text('GST @ 18%', W - margin - 40, y);
    pdf.text(`₹${gst.toLocaleString('en-IN')}`, W - margin - 3, y, { align: 'right' });
    y += 8;
    pdf.setFillColor(13, 148, 136);
    pdf.rect(W - margin - 70, y - 5, 70, 12, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('Total Due', W - margin - 40, y + 3);
    pdf.text(`₹${total.toLocaleString('en-IN')}`, W - margin - 3, y + 3, { align: 'right' });
    y += 18;
  } else {
    pdf.setFillColor(13, 148, 136);
    pdf.rect(W - margin - 70, y - 5, 70, 12, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('Total Due', W - margin - 40, y + 3);
    pdf.text('₹0 (Free)', W - margin - 3, y + 3, { align: 'right' });
    y += 18;
  }

  // Payment instructions
  y += 4;
  pdf.setFillColor(248, 250, 252);
  pdf.rect(margin, y, W - 2 * margin, numericAmount > 0 ? 40 : 18, 'F');
  pdf.setTextColor(100, 116, 139);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAYMENT INSTRUCTIONS', margin + 4, y + 6);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(51, 65, 85);
  if (numericAmount > 0) {
    pdf.text('Bank Transfer (NEFT / RTGS):', margin + 4, y + 12);
    pdf.text('Account Name: VLab Technologies', margin + 4, y + 18);
    pdf.text('Account No: XXXX-XXXX-XXXX  |  IFSC: XXXXXX  |  Bank: HDFC Bank', margin + 4, y + 24);
    pdf.text('UPI: vlab@upi  |  Reference: use your Invoice Number as payment remark', margin + 4, y + 30);
    pdf.text('After payment, reply to this email with your UTR/transaction ID. Invite codes sent within 24 hours.', margin + 4, y + 36);
  } else {
    pdf.text('This is a free pilot. Reply to get your onboarding invite codes immediately.', margin + 4, y + 12);
  }
  y += numericAmount > 0 ? 48 : 26;

  // Footer
  pdf.setFillColor(11, 17, 32);
  pdf.rect(0, 278, W, 19, 'F');
  pdf.setTextColor(100, 116, 139);
  pdf.setFontSize(8);
  pdf.text('VLab — Virtual Laboratory Platform  |  contact@vlab.edu.in  |  vlab.vercel.app', W / 2, 287, { align: 'center' });
  pdf.text('This is a computer-generated document.', W / 2, 292, { align: 'center' });

  return pdf;
}

// ─── Main Modal Component ─────────────────────────────────────────────────────
export default function InvoiceRequestModal({ plan, onClose }) {
  const [form, setForm] = useState({
    contactName: '', collegeName: '', deptName: '', email: '', phone: '', gst: '', message: '',
  });
  const [step, setStep] = useState('form'); // 'form' | 'done'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const no = genInvoiceNo();
      setInvoiceNo(no);
      const requestData = { ...form, invoiceNo: no };

      // Save request to Firestore
      await setDoc(doc(db, 'invoice_requests', no), {
        ...requestData,
        planId: plan.id,
        planName: plan.name,
        planPrice: plan.price,
        status: 'pending', // pending → payment_received → codes_sent
        createdAt: new Date(),
      });

      // Generate and auto-download the PDF for the HOD
      const pdf = generateInvoicePDF(requestData, plan);
      pdf.save(`VLab-Invoice-${no}.pdf`);

      setStep('done');
    } catch (err) {
      console.error(err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const I = (props) => (
    <input
      {...props}
      style={{ width: '100%', boxSizing: 'border-box', background: '#0d1626', border: '1px solid #1e2d45', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', marginBottom: 12 }}
    />
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#111d2e', border: `1px solid ${plan.color}44`, borderRadius: 20, padding: 36, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: `0 0 60px ${plan.glow}` }}>

        {step === 'form' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: plan.color, letterSpacing: 1, marginBottom: 4 }}>{plan.name.toUpperCase()} PLAN</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{plan.price} <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b' }}>{plan.period}</span></div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>A PDF invoice will download instantly for your records.</div>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 22, padding: 0, lineHeight: 1 }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Contact Person Name *</label>
              <I placeholder="Dr. Rajesh Sharma" value={form.contactName} onChange={set('contactName')} required />

              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>College / University Name *</label>
              <I placeholder="VIT University, Chennai" value={form.collegeName} onChange={set('collegeName')} required />

              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Department *</label>
              <I placeholder="Dept. of Electrical & Electronics Engineering" value={form.deptName} onChange={set('deptName')} required />

              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Official Email *</label>
              <I type="email" placeholder="hod.eee@vitchennai.edu.in" value={form.email} onChange={set('email')} required />

              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Phone</label>
              <I type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />

              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>GSTIN (optional, for GST invoice)</label>
              <I placeholder="29AABCU9603R1ZX" value={form.gst} onChange={set('gst')} />

              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Any specific requirements?</label>
              <textarea
                placeholder="e.g. Need demo session, custom domain required, etc."
                value={form.message} onChange={set('message')}
                style={{ width: '100%', boxSizing: 'border-box', background: '#0d1626', border: '1px solid #1e2d45', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', minHeight: 80, resize: 'vertical', marginBottom: 12 }}
              />

              {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}

              <button
                type="submit" disabled={loading}
                style={{ width: '100%', padding: '14px 0', background: plan.ctaBg, border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Generating Invoice…' : '📄 Download Invoice PDF'}
              </button>
              <div style={{ textAlign: 'center', fontSize: 12, color: '#475569', marginTop: 10 }}>
                Your request is saved. We'll contact you within 24 hours.
              </div>
            </form>
          </>
        ) : (
          // Success state
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Invoice Downloaded!</div>
            <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 24 }}>
              Your PDF invoice <strong style={{ color: '#94a3b8' }}>{invoiceNo}</strong> has been saved to your Downloads folder.
              <br /><br />
              <strong style={{ color: '#0d9488' }}>Next steps:</strong><br />
              1. Share the PDF with your Accounts / Principal for approval.<br />
              2. Pay via NEFT/RTGS to the bank details in the invoice.<br />
              3. Reply to our email with your UTR number.<br />
              4. Your invite codes will be emailed within <strong style={{ color: '#94a3b8' }}>24 hours</strong>.
            </div>
            <div style={{ background: '#0d1626', border: '1px solid #1e2d45', borderRadius: 12, padding: 16, marginBottom: 24, textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>CONTACT US</div>
              <div style={{ fontSize: 14, color: '#94a3b8' }}>📧 contact@vlab.edu.in</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Reference your invoice number: <span style={{ fontFamily: 'monospace', color: '#0d9488' }}>{invoiceNo}</span></div>
            </div>
            <button onClick={onClose} style={{ padding: '12px 32px', background: plan.ctaBg, border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { jsPDF } from 'jspdf';

/**
 * generateLabCertificate
 * Creates a premium dark-themed lab completion certificate PDF.
 *
 * @param {object} opts
 * @param {string} opts.studentName     - Full name of the student
 * @param {string} opts.experimentName  - Title of the completed experiment
 * @param {number} opts.vivaScore       - AI Viva score (0-100)
 * @param {string} opts.teacherName     - Teacher/evaluator name
 * @param {string} opts.className       - Class name (e.g. "EEE - B")
 * @param {string} opts.institutionName - College/institution name
 */
export function generateLabCertificate({
  studentName = 'Student',
  experimentName = 'Lab Experiment',
  vivaScore = 0,
  teacherName = 'Faculty',
  className = '',
  institutionName = 'V-Lab Enterprise',
}) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297, H = 210;

  // ── Background ───────────────────────────────────────────────────────────────
  doc.setFillColor(10, 10, 18);          // #0a0a12
  doc.rect(0, 0, W, H, 'F');

  // ── Outer gold border ────────────────────────────────────────────────────────
  doc.setDrawColor(245, 158, 11);        // amber gold
  doc.setLineWidth(1.5);
  doc.rect(8, 8, W - 16, H - 16, 'S');

  // ── Inner subtle border ──────────────────────────────────────────────────────
  doc.setDrawColor(56, 189, 248);        // sky blue
  doc.setLineWidth(0.4);
  doc.rect(12, 12, W - 24, H - 24, 'S');

  // ── Corner accents ───────────────────────────────────────────────────────────
  const corners = [[14, 14], [W - 14, 14], [14, H - 14], [W - 14, H - 14]];
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(1);
  corners.forEach(([cx, cy]) => {
    doc.circle(cx, cy, 2, 'S');
  });

  // ── Horizontal rule below header area ───────────────────────────────────────
  doc.setDrawColor(56, 189, 248, 0.3);
  doc.setLineWidth(0.3);
  doc.line(20, 48, W - 20, 48);
  doc.line(20, H - 48, W - 20, H - 48);

  // ── V-Lab wordmark top-left ──────────────────────────────────────────────────
  // Icon square (gradient simulated as sky blue)
  doc.setFillColor(56, 189, 248);
  doc.roundedRect(20, 16, 10, 10, 2, 2, 'F');
  // ECG line inside icon (simplified as white text)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('∿', 22.5, 23);

  doc.setTextColor(248, 250, 252);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('V-Lab', 33, 24);

  doc.setTextColor(56, 189, 248);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('ENTERPRISE', 33, 30);

  // ── "Certificate of Lab Completion" label ────────────────────────────────────
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  const certLabel = 'CERTIFICATE OF LAB COMPLETION';
  const certLabelW = doc.getTextWidth(certLabel);
  doc.text(certLabel, (W - certLabelW) / 2, 28);

  // Underline the label
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.5);
  doc.line((W - certLabelW) / 2, 29.5, (W + certLabelW) / 2, 29.5);

  // ── "This is to certify that" ────────────────────────────────────────────────
  doc.setTextColor(148, 163, 184);  // slate-400
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const certifyText = 'This is to certify that';
  doc.text(certifyText, (W - doc.getTextWidth(certifyText)) / 2, 60);

  // ── Student Name (hero text) ─────────────────────────────────────────────────
  doc.setTextColor(248, 250, 252);
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  const nameW = doc.getTextWidth(studentName);
  doc.text(studentName, (W - nameW) / 2, 80);

  // Name underline
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(0.8);
  doc.line((W - nameW) / 2, 82, (W + nameW) / 2, 82);

  // ── "has successfully completed" ─────────────────────────────────────────────
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const completedText = 'has successfully completed the virtual laboratory experiment';
  doc.text(completedText, (W - doc.getTextWidth(completedText)) / 2, 93);

  // ── Experiment Name ──────────────────────────────────────────────────────────
  doc.setTextColor(56, 189, 248);
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  const expW = doc.getTextWidth(experimentName);
  doc.text(experimentName, (W - expW) / 2, 107);

  // ── Three detail columns ─────────────────────────────────────────────────────
  const colY = 128;
  const cols = [
    { label: 'AI VIVA SCORE', value: `${vivaScore}%`, color: [129, 140, 248] },
    { label: 'CLASS', value: className || 'EEE / ECE', color: [56, 189, 248] },
    { label: 'DATE', value: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), color: [245, 158, 11] },
  ];

  cols.forEach((col, idx) => {
    const colX = 60 + idx * 88;

    // Box background
    doc.setFillColor(15, 15, 26);
    doc.setDrawColor(...col.color);
    doc.setLineWidth(0.5);
    doc.roundedRect(colX - 25, colY - 10, 50, 22, 3, 3, 'FD');

    // Label
    doc.setTextColor(...col.color);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(col.label, colX - doc.getTextWidth(col.label) / 2, colY);

    // Value
    doc.setTextColor(248, 250, 252);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(col.value, colX - doc.getTextWidth(col.value) / 2, colY + 9);
  });

  // ── Footer: Teacher signature + Institution ──────────────────────────────────
  const footerY = H - 26;

  // Left: Issued by
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('ISSUED BY', 28, footerY - 6);
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.3);
  doc.line(20, footerY - 4, 90, footerY - 4);
  doc.setTextColor(248, 250, 252);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(teacherName, 20, footerY);
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Lab Faculty / Evaluator', 20, footerY + 5.5);

  // Center: Institution
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text(institutionName, W / 2 - doc.getTextWidth(institutionName) / 2, footerY);
  doc.setTextColor(56, 189, 248);
  doc.setFontSize(6.5);
  const poweredBy = 'Powered by V-Lab Enterprise · AI-Enabled Lab Assessment';
  doc.text(poweredBy, W / 2 - doc.getTextWidth(poweredBy) / 2, footerY + 5.5);

  // Right: Verification badge
  doc.setFillColor(10, 10, 18);
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(0.5);
  doc.circle(W - 35, footerY - 1, 10, 'FD');
  doc.setTextColor(56, 189, 248);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.text('AI', W - 35 - doc.getTextWidth('AI') / 2, footerY - 3);
  doc.text('VERIFIED', W - 35 - doc.getTextWidth('VERIFIED') / 2, footerY + 1);
  doc.setFontSize(5.5);
  doc.setTextColor(71, 85, 105);
  doc.text('v-lab.enterprise', W - 35 - doc.getTextWidth('v-lab.enterprise') / 2, footerY + 7);

  // ── Save ─────────────────────────────────────────────────────────────────────
  const safeName = studentName.replace(/\s+/g, '_');
  const safeExp = experimentName.replace(/\s+/g, '_');
  doc.save(`VLab_Certificate_${safeName}_${safeExp}.pdf`);
}

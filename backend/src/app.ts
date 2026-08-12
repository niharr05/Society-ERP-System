import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Society ERP Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Mock Razorpay Payment Verification
app.post('/api/payments/create-order', (req, res) => {
  const { amount, billId, unitId } = req.body;
  
  if (!amount || !billId) {
    return res.status(400).json({ error: 'Amount and billId are required' });
  }

  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  res.json({
    success: true,
    orderId,
    amount: Math.round(amount * 100), // amount in paise
    currency: 'INR',
    billId,
  });
});

app.post('/api/payments/verify', (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, billId } = req.body;
  
  // Signature verification logic
  res.json({
    success: true,
    message: 'Payment verified successfully',
    receiptNumber: `REC-${Date.now()}`,
    paymentId: razorpayPaymentId || `pay_mock_${Date.now()}`,
    billId,
  });
});

import PDFDocument from 'pdfkit';

app.get('/api/bills/:billId/download', (req, res) => {
  const { billId } = req.params;
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Maintenance_Bill_${billId}.pdf`);

  doc.pipe(res);

  // Header
  doc.fontSize(18).text('Royal Heights Co-Op Housing Society', { align: 'center' });
  doc.fontSize(10).text('Plot 42, Sector 18, Palm Beach Road, Navi Mumbai • Reg: HSG/MUM/2021/8849', { align: 'center' });
  doc.moveDown();

  doc.fontSize(14).text(`MAINTENANCE BILL RECEIPT - #${billId}`, { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(11).text(`Bill Date: ${new Date().toLocaleDateString('en-IN')}`);
  doc.text(`Due Date: 10th August 2026`);
  doc.text(`Unit: B-201 (Priya Patel)`);
  doc.moveDown();

  // Table
  doc.fontSize(12).text('Charge Breakdown:', { underline: true });
  doc.fontSize(10).text('1. Base Maintenance Charges (1,000 sq.ft @ Rs 3.5): Rs 3,500');
  doc.text('2. Sinking Fund Reserve: Rs 350');
  doc.text('3. Common Area Lighting & Water: Rs 450');
  doc.text('4. Security & Guard Services: Rs 200');
  doc.moveDown();

  doc.fontSize(13).text('Total Amount Due: Rs 3,850', { bold: true });
  doc.moveDown(2);

  doc.fontSize(9).text('This is a computer generated maintenance receipt. Signature not required.', { align: 'center', italic: true });

  doc.end();
});

app.listen(PORT, () => {
  console.log(`🚀 Society ERP Backend running on port ${PORT}`);
});

import express from 'express';
import multer from 'multer';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "your-very-secret-admin-key";

const app = express();
app.use(cors());
app.use(express.json());

const KYC_DB = path.join(process.cwd(), 'kyc_db.json');

// Helper to read/write KYC DB
function readKYC() {
  if (!fs.existsSync(KYC_DB)) return {};
  return JSON.parse(fs.readFileSync(KYC_DB, 'utf8'));
}
function writeKYC(data) {
  fs.writeFileSync(KYC_DB, JSON.stringify(data, null, 2));
}

// File upload setup
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed!'));
    }
  },
});

// For demo, use email as user ID
let user2FASecrets = {};

// 1. 2FA Setup: Generate secret and QR code
app.get('/2fa/setup', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email required" });

  const secret = speakeasy.generateSecret({ name: 'CryptoApp' });
  user2FASecrets[email] = secret.base32;
  const otpauth_url = secret.otpauth_url;
  const qr = await QRCode.toDataURL(otpauth_url);
  res.json({ secret: secret.base32, qr });
});

// 2. 2FA Verify
app.post('/2fa/verify', (req, res) => {
  const { token, email } = req.body;
  if (!email || !user2FASecrets[email]) {
    return res.status(400).json({ error: "No 2FA secret for this user" });
  }
  const verified = speakeasy.totp.verify({
    secret: user2FASecrets[email],
    encoding: 'base32',
    token,
    window: 1,
  });
  res.json({ verified });
});

// 3. KYC Submission (fields + file upload)
app.post(
  '/kyc/submit',
  upload.fields([
    { name: 'driversLicense', maxCount: 1 },
    { name: 'ssc', maxCount: 1 },
  ]),
  (req, res) => {
    const {
      fullName,
      email,
      phone,
      dob,
      address,
      ssn,
    } = req.body;

    const driversLicenseFile = req.files['driversLicense']?.[0]?.path || null;
    const sscFile = req.files['ssc']?.[0]?.path || null;

    // Save to "DB"
    const kycDB = readKYC();
    kycDB[email] = {
      fullName,
      email,
      phone,
      dob,
      address,
      ssn,
      driversLicenseFile,
      sscFile,
      kycStatus: 'pending',
      kycMessage: '',
      date: new Date().toISOString(),
    };
    writeKYC(kycDB);

    res.json({ success: true, message: 'KYC submitted!', kyc: kycDB[email] });
  }
);

// 4. Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 5. Get KYC status for a user
app.get('/kyc/status/:email', (req, res) => {
  const kycDB = readKYC();
  const user = kycDB[req.params.email];
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// --- ADMIN ROUTES WITH SECURITY ---

function requireAdminKey(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (key !== ADMIN_API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid admin key" });
  }
  next();
}

// 6. Admin: Get all KYC submissions
app.get('/admin/kyc/all', requireAdminKey, (req, res) => {
  const kycDB = readKYC();
  res.json(kycDB);
});

// 7. Admin: Verify or reject KYC
app.post('/admin/kyc/verify', requireAdminKey, (req, res) => {
  const { email, status, message } = req.body; // status: 'verified' or 'rejected'
  const kycDB = readKYC();
  if (!kycDB[email]) return res.status(404).json({ error: 'Not found' });
  kycDB[email].kycStatus = status;
  kycDB[email].kycMessage = message || '';
  writeKYC(kycDB);
  res.json({ success: true, kyc: kycDB[email] });
});

// 8. Admin: Add or update admin note for a KYC record
app.post('/admin/kyc/note', requireAdminKey, (req, res) => {
  const { email, note } = req.body;
  const kycDB = readKYC();
  if (!kycDB[email]) return res.status(404).json({ error: 'Not found' });
  kycDB[email].adminNote = note;
  writeKYC(kycDB);
  res.json({ success: true, kyc: kycDB[email] });
});

// 9. Admin: Delete a KYC record and its files
app.post('/admin/kyc/delete', requireAdminKey, (req, res) => {
  const { email } = req.body;
  const kycDB = readKYC();
  const record = kycDB[email];
  if (!record) return res.status(404).json({ error: 'Not found' });

  // Delete files if they exist
  ['driversLicenseFile', 'sscFile'].forEach((field) => {
    if (record[field]) {
      const filePath = path.join(process.cwd(), record[field]);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
        }
      }
    }
  });

  // Delete record from DB
  delete kycDB[email];
  writeKYC(kycDB);
  res.json({ success: true });
});

app.listen(4243, () => console.log('KYC+2FA server running on port 4243'));
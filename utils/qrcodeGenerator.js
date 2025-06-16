const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function generateQRCode(id) {
  const outputPath = path.join(__dirname, `../qrcodes/qr_${id}.png`);
  const qrData = `visitor:${id}`;

  try {
    await QRCode.toFile(outputPath, qrData, {
      width: 200,
      margin: 1,
    });
    return outputPath;
  } catch (err) {
    console.error('QR code generation failed:', err);
    return null;
  }
}

module.exports = { generateQRCode };

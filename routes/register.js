const express = require('express');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const sendEmail = require('../utils/sendEmail'); // bu fonksiyon ayrı dosyada olacak

const router = express.Router();

const visitorsFile = path.join(__dirname, '../data/visitors.json');

// Yardımcı fonksiyon: JSON dosyasını oku
function readVisitors() {
  if (!fs.existsSync(visitorsFile)) return [];
  const data = fs.readFileSync(visitorsFile);
  return JSON.parse(data);
}

// Yardımcı fonksiyon: JSON dosyasına yaz
function writeVisitors(data) {
  fs.writeFileSync(visitorsFile, JSON.stringify(data, null, 2));
}

router.post('/', async (req, res) => {
  try {
    const { name, lastName, email, company, origin, source } = req.body;
    if (!name || !lastName || !email || !company) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const badgeId = Date.now().toString();
    const fullName = `${name} ${lastName}`;
    const qrPath = path.join(__dirname, `../public/qrcodes/${badgeId}.png`);
    const qrUrl = `https://badge.elanexpo.net/badge.html?badge_id=${badgeId}`;

    await QRCode.toFile(qrPath, qrUrl);

    const newVisitor = {
      id: badgeId,
      fullName,
      email,
      company,
      origin,
      source,
      createdAt: new Date().toISOString()
    };

    const visitors = readVisitors();
    visitors.push(newVisitor);
    writeVisitors(visitors);

    if (config.sendEmail) {
      await sendEmail({
        to: email,
        subject: config.emailSubject,
        text: config.emailBody.replace('[NAME]', fullName),
        attachments: [
          {
            filename: 'qrcode.png',
            path: qrPath,
            cid: 'qrcode'
          }
        ]
      });
    }

    res.redirect(`/success.html?badge_id=${badgeId}`);

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

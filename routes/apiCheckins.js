const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const checkinFile = path.join(__dirname, '../data/checkins.json');

router.get('/', (req, res) => {
  if (!fs.existsSync(checkinFile)) return res.json([]);
  const data = fs.readFileSync(checkinFile);
  const checkins = JSON.parse(data);
  res.json(checkins);
});

module.exports = router;

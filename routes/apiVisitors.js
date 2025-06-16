const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const visitorsFile = path.join(__dirname, '../data/visitors.json');

router.get('/', (req, res) => {
  if (!fs.existsSync(visitorsFile)) return res.json([]);
  const data = fs.readFileSync(visitorsFile);
  const visitors = JSON.parse(data);
  res.json(visitors);
});

module.exports = router;

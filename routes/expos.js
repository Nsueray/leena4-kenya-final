const express = require('express');
const router = express.Router();
const { createExpo, getExpos } = require('../controllers/expoController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, createExpo);
router.get('/', authenticateToken, getExpos);

module.exports = router;

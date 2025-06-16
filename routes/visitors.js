const express = require('express');
const router  = express.Router();
const {
  registerVisitor,
  getVisitorsByExpo,
  getVisitorById,
  searchVisitor
} = require('../controllers/visitorController');
const authenticateToken = require('../middleware/authMiddleware');

// 1) Önce PUBLIC search:
router.get('/search',          searchVisitor);

// 2) badge.html için public get by id
router.get('/public/:id',      getVisitorById);

// 3) Diğerlerini authenticateToken ile:
router.post('/',               authenticateToken, registerVisitor);
router.get('/:expo_id',        authenticateToken, getVisitorsByExpo);

module.exports = router;

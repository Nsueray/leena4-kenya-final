const express = require('express');
const router = express.Router();
const { createFormField, getFormFields } = require('../controllers/formFieldController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, createFormField);
router.get('/:expo_id', getFormFields);

module.exports = router;

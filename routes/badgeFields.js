const express = require('express');
const router = express.Router();
const { getBadgeFieldsByExpo, setBadgeFields } = require('../controllers/badgeFieldController');

router.get('/:expo_id', getBadgeFieldsByExpo);
router.post('/', setBadgeFields);

module.exports = router;

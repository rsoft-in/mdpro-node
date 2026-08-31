const express = require('express');
const router = express.Router();
const adressenController = require('../controllers/adressen');
const attachTenantDb = require('../middleware/tenant_db');

router.post('/get', attachTenantDb, adressenController.getAdressen);

module.exports = router;
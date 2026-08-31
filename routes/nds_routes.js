const express = require('express');
const router = express.Router();
const ndsController = require('../controllers/nds');
const attachTenantDb = require('../middleware/tenant_db');

router.post('/get', attachTenantDb, ndsController.getNds);

module.exports = router;
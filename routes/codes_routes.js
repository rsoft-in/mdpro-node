const express = require('express');
const router = express.Router();
const codesController = require('../controllers/codes');
const attachTenantDb = require('../middleware/tenant_db');

router.post('/get', attachTenantDb, codesController.getCodes);
router.post('/get_by_art', attachTenantDb, codesController.getCodesByArt);

module.exports = router;
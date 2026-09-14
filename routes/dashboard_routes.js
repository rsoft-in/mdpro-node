const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
const attachTenantDb = require('../middleware/tenant_db');

router.post('/get_stats', attachTenantDb, dashboardController.getStats);

module.exports = router;
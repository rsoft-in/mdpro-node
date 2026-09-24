const express = require('express');
const router = express.Router();
const ndsController = require('../controllers/nds');
const attachTenantDb = require('../middleware/tenant_db');

router.post('/get', attachTenantDb, ndsController.getNds);
router.post('/check_constraint', attachTenantDb, ndsController.checkConstraint);
router.post('/alter_field', attachTenantDb, ndsController.alterField);

module.exports = router;
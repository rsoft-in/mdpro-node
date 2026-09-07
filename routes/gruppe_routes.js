const express = require('express');
const router = express.Router();
const gruppeController = require('../controllers/gruppe');
const attachTenantDb = require('../middleware/tenant_db');

router.post('/get', attachTenantDb, gruppeController.get);
router.post('/get_emails', attachTenantDb, gruppeController.getEmails);
router.post('/update', attachTenantDb, gruppeController.updateGruppe);
router.post('/update_use_email', attachTenantDb, gruppeController.updateUseEmail);
router.post('/update_active', attachTenantDb, gruppeController.updateActive);
router.post('/delete', attachTenantDb, gruppeController.deleteGruppe);

module.exports = router;
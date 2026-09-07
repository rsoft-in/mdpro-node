const express = require('express');
const router = express.Router();
const genossenschaftsController = require('../controllers/genossenschafts');
const attachTenantDb = require('../middleware/tenant_db');

router.post('/get', attachTenantDb, genossenschaftsController.get);
router.post('/update', attachTenantDb, genossenschaftsController.updateGenossenschaft);
router.post('/delete', attachTenantDb, genossenschaftsController.deleteGenossenschaft);

module.exports = router;
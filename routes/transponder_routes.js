const express = require('express');
const router = express.Router();
const transponderController = require('../controllers/transponder');
const attachTenantDb = require('../middleware/tenant_db');

router.post('/get', attachTenantDb, transponderController.getTransponder);
router.post('/update', attachTenantDb, transponderController.updateTransponder);
router.post('/delete', attachTenantDb, transponderController.deleteTransponder);
router.post('/export_xlsx', attachTenantDb, transponderController.exportToXlsx);

module.exports = router;
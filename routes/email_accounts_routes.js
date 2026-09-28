const express = require('express');
const router = express.Router();
const emailAccountsController = require('../controllers/email_accounts');
const attachTenantDb = require('../middleware/tenant_db');

router.post('/get', attachTenantDb, emailAccountsController.getEmailAccounts);

module.exports = router;

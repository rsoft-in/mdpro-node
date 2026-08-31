const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const attachTenantDb = require('../middleware/tenant_db');

router.post('/get', attachTenantDb, productController.getProducts);
router.post('/get_active', attachTenantDb, productController.getProducts);

module.exports = router;
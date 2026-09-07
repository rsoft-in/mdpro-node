const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const attachTenantDb = require('../middleware/tenant_db');

router.post('/get', attachTenantDb, productController.getProducts);
router.post('/get_active', attachTenantDb, productController.getProducts);
router.post('/update', attachTenantDb, productController.updateProduct);
router.post('/update_active', attachTenantDb, productController.updateActive);
router.post('/delete', attachTenantDb, productController.deleteProduct);

module.exports = router;
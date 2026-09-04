const { getTenantPool } = require('../config/db');

function attachTenantDb(req, res, next) {
    const { tenant_id } = req.body;
    if (!tenant_id) {
        return res.status(400).json({ error: 'tenant_id parameter is required' });
    }

    try {
        req.db = getTenantPool(tenant_id);
        next();
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
}

module.exports = attachTenantDb;
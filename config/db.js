const mysql = require('mysql2');
const TENANT_CREDENTIALS = require('./tenants');

const pools = new Map();

// Base options applied to all connection pools
const DEFAULT_POOL_OPTIONS = {
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

/**
 * Gets an existing connection pool for a tenant or creates a new one.
 * @param {string} tenantId - The unique key identifying the tenant
 */
function getTenantPool(tenantId) {
    if (!tenantId) {
        throw new Error('Tenant identifier is required');
    }

    // 1. Return cached pool if it already exists
    if (pools.has(tenantId)) {
        return pools.get(tenantId);
    }

    // 2. Fetch credentials for the tenant
    const config = TENANT_CREDENTIALS[tenantId];
    if (!config) {
        throw new Error(`No database credentials found for tenant: ${tenantId}`);
    }

    // 3. Create pool with tenant-specific credentials
    const newPool = mysql.createPool({
        ...DEFAULT_POOL_OPTIONS,
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database
    }).promise();

    // 4. Cache and return
    pools.set(tenantId, newPool);
    return newPool;
}

module.exports = { getTenantPool };
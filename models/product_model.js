async function get(db, search, active, sort, pageSize, offset) {
    var activeFilter = '';
    if (active === 1) {
        activeFilter = ' AND product_active = 1';
    }
    const query = `SELECT * FROM product
                    WHERE (productid LIKE ? OR productname LIKE ?)
                    ${activeFilter}
                    ORDER BY ${sort}
                    LIMIT ? OFFSET ?`;

    const values = [`%${search}%`, `%${search}%`, Number(pageSize), Number(offset)];
    const [rows] = await db.query(query, values);
    return rows;
}

async function getCount(db, search, active) {
    var activeFilter = '';
    if (active === 1) {
        activeFilter = ' AND product_active = 1';
    }
    const query = `SELECT count(*) as nrec FROM product
                    WHERE (productid LIKE ? OR productname LIKE ?)
                    ${activeFilter}`;

    const values = [`%${search}%`, `%${search}%`];
    const [rows] = await db.query(query, values);
    return rows;
}

async function getActive(db) {
    const query = `SELECT * FROM product WHERE product_active = 1 ORDER BY ${sort}`;
    const [rows] = await db.query(query);
    return rows;
}

async function insertProduct(db, data, callback) {
    const query = `INSERT INTO product (productid, productname, 
                    productconvfactor, productname_reg, 
                    product_segment, product_segment2, product_quality, 
                    product_user, product_modified)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, now())`;
    try {
        const result = await db.query(query, data);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
};

async function updateProduct(db, data, callback) {
    const query = `UPDATE product SET productname = ?, 
                    productconvfactor = ?, productname_reg = ?,
                    product_segment = ?, product_segment2 = ?, 
                    product_quality = ?, product_user = ?, 
                    product_modified = now()
                    WHERE productid = ?`;
    try {
        const result = await db.query(query, data);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
};

async function updateActive(db, productid, callback) {
    const query = `UPDATE product SET product_active = !product_active 
                    WHERE productid = ?`;
    const values = [`${productid}`];
    try {
        const result = await db.query(query, values);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
};

async function deleteProduct(db, productId, callback) {
    const query = `DELETE FROM product WHERE productid = ?`;
    const values = [`${productId}`];
    try {
        const result = await db.query(query, values);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
};

module.exports = {
    get, getCount, getActive, insertProduct, updateProduct, updateActive, deleteProduct
};

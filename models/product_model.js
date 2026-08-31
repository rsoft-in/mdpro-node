async function get(db, search, sort, pageSize, offset) {
    const query = `SELECT * FROM product
                    WHERE productid LIKE ? OR productname LIKE ?
                    ORDER BY ${sort}
                    LIMIT ? OFFSET ?`;

    const values = [`%${search}%`, `%${search}%`, Number(pageSize), Number(offset)];
    const [rows] = await db.query(query, values);
    return rows;
}

async function getCount(db, search) {
    const query = `SELECT count(*) as nrec FROM product
                    WHERE productid LIKE ? OR productname LIKE ?`;

    const values = [`%${search}%`, `%${search}%`];
    const [rows] = await db.query(query, values);
    return rows;
}

async function getActive(db) {
    const query = `SELECT * FROM product WHERE product_active = 1 ORDER BY ${sort}`;
    const [rows] = await db.query(query);
    return rows;
}

module.exports = {
    get, getCount, getActive
};
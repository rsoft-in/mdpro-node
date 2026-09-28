async function get(db, keyword, sort, pageSize, offset) {
    const query = `SELECT *
                    FROM emailaccounts
                    WHERE email_address LIKE ? OR email_username LIKE ? OR email_smtp_server LIKE ? 
                    ORDER BY ${sort}
                    LIMIT ? OFFSET ?`;

    const values = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, Number(pageSize), Number(offset)];
    const [rows] = await db.query(query, values);
    return rows;
}

async function getCount(db, keyword) {
    const query = `SELECT count(*) as nrec FROM emailaccounts
                    WHERE email_address LIKE ? OR email_username LIKE ? OR email_smtp_server LIKE ?`;
    const values = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`];
    const [rows] = await db.query(query, values);
    return rows;
}

async function getDefault(db) {
    const query = `SELECT * FROM emailaccounts WHERE email_isdefault = 1`;
    const [rows] = await db.query(query);
    return rows;
}

module.exports = {
    get, getCount, getDefault
}
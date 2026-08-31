async function get(db, search, sort, pageSize, offset) {
    const query = `SELECT * FROM codes
                    WHERE (cod_art LIKE ? OR cod_code LIKE ? OR cod_bez LIKE ?)
                    ORDER BY ${sort}
                    LIMIT ? OFFSET ?`;

    const values = [`%${search}%`, `%${search}%`, `%${search}%`, Number(pageSize), Number(offset)];
    const [rows] = await db.query(query, values);
    return rows;
}

async function getCount(db, search) {
    const query = `SELECT count(*) as nrec FROM codes
                    WHERE (cod_art LIKE ? OR cod_code LIKE ? OR cod_bez LIKE ?)`;

    const values = [`%${search}%`, `%${search}%`, `%${search}%`];
    const [rows] = await db.query(query, values);
    return rows;
}

async function getByArt(db, codArt, sort) {
    const query = `SELECT * FROM codes
                    WHERE cod_art = ? ORDER BY ${sort}`;

    const values = [`${codArt}`];
    const [rows] = await db.query(query, values);
    return rows;
}

module.exports = {
    get, getCount, getByArt
};
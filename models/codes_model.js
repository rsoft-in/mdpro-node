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

async function insertCodes(db, data, callback) {
    const query = `INSERT INTO codes (cod_art, cod_code, cod_bez, cod_wert, cod_abbreviation, cod_user, cod_modified)
                    VALUES (?, ?, ?, ?, ?, ?, now())`;
    try {
        const result = await db.query(query, data);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
};

async function updateCodes(db, data, callback) {
    const query = `UPDATE codes SET cod_bez = ?, cod_wert = ?, cod_abbreviation = ?, cod_user = ?, cod_modified = now()
                    WHERE cod_art = ? AND cod_code = ?`;
    try {
        const result = await db.query(query, data);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
};

async function deleteCodes(db, codArt, codCode, callback) {
    const query = `DELETE FROM codes WHERE cod_art = ? AND cod_code = ?`;
    const values = [`${codArt}`, `${codCode}`];
    try {
        const result = await db.query(query, values);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
};

module.exports = {
    get, getCount, getByArt, insertCodes, updateCodes, deleteCodes
};
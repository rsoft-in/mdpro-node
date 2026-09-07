async function get(db, search, active, sort, pageSize, offset) {
    var activeFilter = '';
    if (active === 1) {
        activeFilter = ' AND gruppeactive = 1';
    }
    const query = `SELECT * FROM gruppe 
                    WHERE (gruppecode LIKE ? OR gruppename LIKE ?)
                    ${activeFilter}
                    ORDER BY ${sort} LIMIT ? OFFSET ?`;
    const values = [`%${search}%`, `%${search}%`, Number(pageSize), Number(offset)];
    const [rows] = await db.query(query, values);
    return rows;
}

async function getCount(db, search, active) {
    var activeFilter = '';
    if (active === 1) {
        activeFilter = ' AND gruppeactive = 1';
    }
    const query = `SELECT count(*) as nrec FROM gruppe
                    WHERE (gruppecode LIKE ? OR gruppename LIKE ?)
                    ${activeFilter}`;

    const values = [`%${search}%`, `%${search}%`];
    const [rows] = await db.query(query, values);
    return rows;
}

async function getEmails(db, search) {
    const query = `SELECT * FROM gruppe 
                    WHERE gruppeemail != '' AND (gruppecode LIKE ? 
                    OR gruppename LIKE ? 
                    OR gruppeemail LIKE ?) 
                    ORDER BY gruppename`;
    const values = [`%${search}%`, `%${search}%`, `%${search}%`];
    const [rows] = await db.query(query, values);
    return rows;
}

async function insertGruppe(db, data, callback) {
    const query = `INSERT INTO gruppe (gruppecode, gruppename, gruppeemail, gruppeexpformat, gruppeusemail, gruppeactive, gruppe_master, gruppemodified)
                    VALUES (?, ?, ?, ?, ?, ?, ?, now())`;
    try {
        const result = await db.query(query, data);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
}

async function updateGruppe(db, data, callback) {
    const query = `UPDATE gruppe SET gruppename = ?, gruppeemail = ?, gruppeexpformat = ?, gruppeusemail = ?, gruppeactive = ?, gruppemodified = now()
                    WHERE gruppecode = ?`;
    try {
        const result = await db.query(query, data);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
}

async function updateUseEmail(db, gruppeCode, callback) {
    const query = `UPDATE gruppe SET gruppeusemail = !gruppeusemail WHERE gruppecode = ?`;
    const values = [`${gruppeCode}`];
    try {
        const result = await db.query(query, values);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
}

async function updateActive(db, gruppeCode, callback) {
    const query = `UPDATE gruppe SET gruppeactive = !gruppeactive WHERE gruppecode = ?`;
    const values = [`${gruppeCode}`];
    try {
        const result = await db.query(query, values);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
}

async function deleteGruppe(db, gruppeCode, callback) {
    const query = `DELETE FROM gruppe WHERE gruppecode = ?`;
    const values = [`${gruppeCode}`];
    try {
        const result = await db.query(query, values);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
}

module.exports = {
    get, getCount, getEmails, insertGruppe, updateGruppe, updateUseEmail, updateActive, deleteGruppe
}
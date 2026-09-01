async function get(db, filter, sort, pageSize, offset) {
  const query = `SELECT *
                    FROM adressen
                    WHERE ${filter}
                    ORDER BY ${sort}
                    LIMIT ? OFFSET ?`;

  const values = [Number(pageSize), Number(offset)];
  const [rows] = await db.query(query, values);
  return rows;
}

async function getCount(db, filter) {
  const query = `SELECT count(*) as nrec FROM adressen
                    WHERE ${filter}`;

  const [rows] = await db.query(query);
  return rows;
}

async function insertAdressen(db, data, callback) {
    const query = `INSERT INTO adressen (adr_kunu, adr_anred, adr_vor, adr_nach, adr_firma1, adr_firma, adr_zus, adr_post, adr_ordnr_p, adr_str, adr_plz, adr_ort, adr_ord_nr, adr_tel_g, adr_tel_p, adr_tel_f, adr_natel, adr_email, adr_bur_nr, adr_bemerkung, adr_properties, adr_codes, adr_arexnr, adr_latitude, adr_longitude)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
        const result = await db.query(query, data);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
};

async function updateAdressen(db, data, callback) {
    const query = `UPDATE adressen SET adr_anred = ?, adr_vor = ?, adr_nach = ?, adr_firma1 = ?, adr_firma = ?, adr_zus = ?, adr_post = ?, adr_ordnr_p = ?, adr_str = ?, adr_plz = ?, adr_ort = ?, adr_ord_nr = ?, adr_tel_g = ?, adr_tel_p = ?, adr_tel_f = ?, adr_natel = ?, adr_email = ?, adr_bur_nr = ?, adr_bemerkung = ?, adr_properties = ?, adr_codes = ?, adr_arexnr = ?, adr_latitude = ?, adr_longitude = ?
                    WHERE adr_kunu = ?`;
    try {
        const result = await db.query(query, data);
        callback(null, result);
    } catch (error) {
        callback(error);
    }
};

async function deleteAdressen(db, adr_kunu, callback) {
    const query = `DELETE FROM adressen WHERE adr_kunu = ?`;
    const values = [`${adr_kunu}`];
    try {
        const result = await db.query(query, values);
        callback(null, result);
    } catch (error) {
        callback(error);
    }

};

module.exports = {
  get,
  getCount,
  insertAdressen,
  updateAdressen,
  deleteAdressen
};

async function get(db, filter, sort, pageSize, offset) {
  const query = `SELECT transponder.*, adressen.adr_vor, adressen.adr_nach, adressen.adr_str, adressen.adr_plz, adressen.adr_ort, gruppe.gruppename, product.productname
                    FROM transponder
                    LEFT JOIN adressen ON adressen.adr_kunu = transponder.kundennr
                    LEFT JOIN gruppe ON gruppe.gruppecode = transponder.gruppecode
                    LEFT JOIN product ON product.productid = transponder.produkt
                    WHERE  ${filter}
                    ORDER BY ${sort}
                    LIMIT ? OFFSET ?`;

  const values = [Number(pageSize), Number(offset)];
  const [rows] = await db.query(query, values);
  return rows;
}

async function getCount(db, filter) {
  const query = `SELECT COUNT(*) as nrec
                    FROM transponder
                    LEFT JOIN adressen ON adressen.adr_kunu = transponder.kundennr
                    LEFT JOIN gruppe ON gruppe.gruppecode = transponder.gruppecode
                    LEFT JOIN product ON product.productid = transponder.produkt
                    WHERE ${filter}`;

  const [rows] = await db.query(query);
  return rows;
}

async function insertTransponder(db, data, callback) {
  const query = `INSERT INTO transponder (transid, tr_vondate, tr_bisdate, produkt, 
                  lieferart, prodnr, genonr, verbnr, qk_unt, gruppecode, 
                  kundennr, donotshow, dailyhalt, tr_codes, bemerkung, 
                  gisx, gisy, incl_f_vge, sperre, hinweis, liveport, tr_modified)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())`;
  try {
    const result = await db.query(query, data);
    callback(null, result);
  } catch (error) {
    callback(error);
  }
};

async function updateTransponder(db, data, callback) {
  const query = `UPDATE transponder SET tr_bisdate = ?, produkt = ?, 
                lieferart = ?, prodnr = ?, genonr = ?, verbnr = ?, qk_unt = ?, 
                gruppecode = ?, kundennr = ?, donotshow = ?, dailyhalt = ?, 
                tr_codes = ?, bemerkung = ?, gisx = ?, gisy = ?, incl_f_vge = ?, 
                sperre = ?, hinweis = ?, liveport = ?, tr_modified = now() 
                WHERE transid = ? AND tr_vondate = ?`;
  try {
    const result = await db.query(query, data);
    callback(null, result);
  } catch (error) {
    callback(error);
  }
};

async function deleteTransponder(db, transid, tr_vondate, callback) {
  const query = `DELETE FROM transponder WHERE transid = ? AND tr_vondate = ?`;
  const values = [`${transid}`, `${tr_vondate}`];
  try {
    const result = await db.query(query, values);
    callback(null, result);
  } catch (error) {
    callback(error);
  }

};


module.exports = {
  get, getCount, insertTransponder, updateTransponder, deleteTransponder
};
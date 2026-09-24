async function get(db, filter, sort, pageSize, offset) {
  const query = `SELECT nds.*, transponder.gruppecode, adressen.adr_kunu, adressen.adr_vor, adressen.adr_nach, product.productname, transponder.verbnr
                  FROM nds
                  LEFT JOIN transponder ON transponder.transid = nds.transid AND (tr_vondate <= tourdtyear) AND (tr_bisdate >= tourdtyear OR tr_bisdate is null)
                  LEFT JOIN product ON product.productid = transponder.produkt
                  LEFT JOIN adressen ON adressen.adr_kunu = transponder.kundennr
                  WHERE ${filter}
                  ORDER BY ${sort} LIMIT ? OFFSET ?`;
  const values = [Number(pageSize), Number(offset)];
  const [rows] = await db.query(query, values);
  return rows;
}

async function getStats(db, filter) {
  const query = `SELECT count(*) as records, SUM(LEFT(nds.transid, 1) <> 'F' AND (product.productname = '' OR product.productname IS NULL)) as pdef, SUM(milchmenge) as totalmenge, SUM(mengekg) as totalmengekg
                  FROM nds
                  LEFT JOIN transponder ON transponder.transid = nds.transid AND (tr_vondate <= tourdtyear) AND (tr_bisdate >= tourdtyear OR tr_bisdate is null)
                  LEFT JOIN product ON product.productid = transponder.produkt
                  LEFT JOIN adressen ON adressen.adr_kunu = transponder.kundennr
                  WHERE ${filter}`;
  const [rows] = await db.query(query);
  return rows;
}

async function getAbholStats(db, filter) {
  const query = `SELECT SUM(milchmenge) as totalmenge, SUM(mengekg) as totalmengekg
                  FROM nds
                  LEFT JOIN transponder ON transponder.transid = nds.transid AND (tr_vondate <= tourdtyear) AND (tr_bisdate >= tourdtyear OR tr_bisdate is null)
                  LEFT JOIN product ON product.productid = transponder.produkt
                  LEFT JOIN adressen ON adressen.adr_kunu = transponder.kundennr
                  WHERE (transponder.lieferart = '2') AND ${filter}`;
  const [rows] = await db.query(query);
  return rows;
}

async function getMonthCount(db) {
  const query = `SELECT count(*) as nds_count FROM nds WHERE MONTH(tourdtyear) = MONTH(CURRENT_DATE()) AND YEAR(tourdtyear) = YEAR(CURRENT_DATE())`;
  const [rows] = await db.query(query);
  return rows;
}

async function getByKey(db, data) {
  const sqlQry = `SELECT * FROM nds 
                  WHERE tourdtyear = ? AND liefdatum = ? 
                    AND pendzeit = ? AND transid = ? 
                    AND milchmenge = ? AND probenfnr = ?`;
  const [rows] = await db.query(sqlQry, data);
  return rows;
}

async function alterField(db, type, oldValue, newValue, filter, callback) {
  const query = `UPDATE nds 
					LEFT JOIN transponder ON (transponder.transid = nds.transid)
          AND (transponder.tr_vondate <= nds.tourdtyear) AND (transponder.tr_bisdate >= nds.tourdtyear OR transponder.tr_bisdate is null )
          LEFT JOIN product ON product.productid = transponder.produkt
					LEFT JOIN adressen ON adressen.adr_kunu = transponder.kundennr
          SET ${type} = ? WHERE (${type} = ?) AND ${filter}`;
  const values = [`${newValue}`, `${oldValue}`];
  try {
    const result = await db.query(query, values);
    callback(null, result);
  } catch (error) {
    callback(error);
  }
}

module.exports = {
  get,
  getStats,
  getAbholStats,
  getMonthCount,
  getByKey,
  alterField
};

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

module.exports = {
  get,
  getStats,
  getAbholStats,
};

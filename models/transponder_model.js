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

module.exports = {
    get, getCount
};
async function get(db, keyword, sort, pageSize, offset) {
  const query = `SELECT *
                    FROM genossenschaft
                    WHERE genonr LIKE ? OR bez LIKE ?
                    ORDER BY ${sort}
                    LIMIT ? OFFSET ?`;

  const values = [`%${keyword}%`, `%${keyword}%`, Number(pageSize), Number(offset)];
  const [rows] = await db.query(query, values);
  return rows;
}

async function getCount(db, keyword) {
  const query = `SELECT count(*) as nrec FROM genossenschaft
                    WHERE genonr LIKE ? OR bez LIKE ?`;

  const values = [`%${keyword}%`, `%${keyword}%`];
  const [rows] = await db.query(query, values);
  return rows;
}

async function insertGenossenschaft(db, data, callback) {
  const query = `INSERT INTO genossenschaft (genonr, bez, geno_modified)
                  VALUES (?, ?, now())`;
  try {
      const result = await db.query(query, data);
      callback(null, result);
  } catch (error) {
      callback(error);
  }
};

async function updateGenossenschaft(db, data, callback) {
  const query = `UPDATE genossenschaft SET bez = ?, geno_modified = now()
                  WHERE genonr = ?`;
  try {
      const result = await db.query(query, data);
      callback(null, result);
  } catch (error) {
      callback(error);
  }
};

async function deleteGenossenschaft(db, genonr, callback) {
  const query = `DELETE FROM genossenschaft WHERE genonr = ?`;
  const values = [`${genonr}`];
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
  insertGenossenschaft,
  updateGenossenschaft,
  deleteGenossenschaft
};
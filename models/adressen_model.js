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

module.exports = {
  get,
  getCount,
};

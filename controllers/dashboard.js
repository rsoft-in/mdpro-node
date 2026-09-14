const Adressen = require("../models/adressen_model");
const Transponder = require('../models/transponder_model');
const Nds = require("../models/nds_model");

const getStats = async (req, res) => {
  try {
    const [adressenResult, transponderResult, ndsResult] = await Promise.all([
      Adressen.getCount(req.db, '(1=1)'),
      Transponder.getCount(req.db, '(1=1)'),
      Nds.getMonthCount(req.db)
    ]);

    res.json({
      adressen: adressenResult[0].nrec,
      transponder: transponderResult[0].nrec,
      nds: ndsResult[0].nds_count
    });
  } catch (err) {
    console.error("Error fetching Statistics:", err.stack);
    res.status(500).send("Error fetching Statistics");
  }
};

module.exports = {
    getStats
}
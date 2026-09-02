const Transponder = require('../models/transponder_model');

genFilter = (json) => {
    let filt = "";

    if (json.keyword) {
        filt += ` AND ( concat(adr_vor, adr_nach) LIKE '%${json.keyword}%' 
                    OR concat(adr_nach, adr_vor) LIKE '%${json.keyword}%'
                    OR (transid LIKE '%${json.keyword}%')
                    OR (genonr LIKE '%${json.keyword}%')
                    OR (transponder.gruppecode LIKE '%${json.keyword}%')
                    OR (gruppename LIKE '%${json.keyword}%')
                    OR (tr_codes LIKE '%${json.keyword}%') )`;
    }

    if (json.tr) {
        if (json.tr.includes(',')) {
            const formattedTr = json.tr.replace(/\s+/g, '').replace(/,/g, "','");
            filt += ` AND transid IN ('${formattedTr}')`;
        } else {
            filt += ` AND (transid LIKE '%${json.tr}%')`;
        }
    }

    if (json.adr) {
        filt += ` AND (concat(adr_vor, adr_nach) LIKE '%${json.adr}%' 
                    OR concat(adr_nach, adr_vor) LIKE '%${json.adr}%')`;
    }

    if (json.dta) {
        filt += " AND (tr_vondate <= now() AND (tr_bisdate >= now() OR tr_bisdate IS NULL) )";
    }

    if (json.pnr) {
        filt += ` AND (prodnr LIKE '%${json.pnr}%')`;
    }

    if (json.lief !== undefined && json.lief !== null) {
        const lief = typeof json.lief === 'string' ? JSON.parse(json.lief) : json.lief;
        if (Array.isArray(lief) && lief.length > 0 && lief[0]) {
            filt += ` AND ( lieferart IN ('${lief.join("','")}') )`;
        }
    }

    if (json.prod !== undefined && json.prod !== null) {
        const prod = typeof json.prod === 'string' ? JSON.parse(json.prod) : json.prod;
        if (Array.isArray(prod) && prod.length > 0 && prod[0]) {
            filt += ` AND ( produkt IN ('${prod.join("','")}') )`;
        }
    }

    if (json.gn) {
        filt += ` AND (genonr LIKE '%${json.gn}%')`;
    }

    if (json.gr) {
        filt += ` AND (transponder.gruppecode LIKE '%${json.gr}%' OR gruppename LIKE '${json.gr}%')`;
    }

    if (json.cs) {
        filt += ` AND (tr_codes LIKE '%${json.cs}%')`;
    }

    if (json.active) {
        filt += " AND (tr_vondate <= now() AND (tr_bisdate >= now() OR tr_bisdate IS NULL) )";
    }

    if (json.liveport) {
        filt += ` AND (liveport = '${json.liveport}')`;
    }

    return "(1=1) " + filt;
}

const getTransponder = async (req, res) => {
    const sort = req.body.sort || "transponder.transid";
    const page = parseInt(req.body.page) || 0;
    const pageSize = parseInt(req.body.page_size) || 25;
    const offset = page * pageSize;
    const filter = genFilter(req.body);

    try {
        const [dataResults, countResults] = await Promise.all([
            Transponder.get(req.db, filter, sort, pageSize, offset),
            Transponder.getCount(req.db, filter),
        ]);
        res.json({
            transponder: dataResults,
            records: countResults[0].nrec,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching Transponder");
    }
};

const updateTransponder = (req, res) => {
    const isNew = req.body.is_new || false;
    const transId = req.body.transid || '';
    const trVonDate = req.body.tr_vondate || '';
    const trBisDate = req.body.tr_bisdate || '';
    const produkt = req.body.produkt || '';
    const lieferArt = req.body.lieferart || '';
    const prodNr = req.body.prodnr || 0;
    const genoNr = req.body.genonr || '';
    const verbNr = req.body.verbnr || '';
    const qkUnt = req.body.qk_unt || '';
    const gruppeCode = req.body.gruppecode || '';
    const kundenNr = req.body.kundennr || '';
    const doNotShow = req.body.donotshow || 0;
    const dailyHalt = req.body.dailyhalt || 0;
    const trCodes = req.body.tr_codes || '';
    const bemerkung = req.body.bemerkung || '';
    const gisX = req.body.gisx || '';
    const gisY = req.body.gisy || '';
    const inclFVGE = req.body.incl_f_vge || 0;
    const sperre = req.body.sperre || '';
    const hinweis = req.body.hinweis || '';
    const livePort = req.body.liveport || '';

    var bisDatum = trBisDate == '' ? null : trBisDate

    if (isNew) {
        const data = [transId, trVonDate, bisDatum, produkt,
            lieferArt, prodNr, genoNr, verbNr, qkUnt, gruppeCode,
            kundenNr, doNotShow, dailyHalt, trCodes, bemerkung,
            gisX, gisY, inclFVGE, sperre, hinweis, livePort];
        Transponder.insertTransponder(req.db, data, (err, result) => {
            if (err) {
                console.error("Error inserting Transponder:", err.stack);
                res.status(500).send("Error inserting Transponder");
            } else {
                res.status(200).send('SUCCESS');
            }
        });
    } else {
        const data = [bisDatum, produkt, lieferArt, prodNr, 
            genoNr, verbNr, qkUnt, gruppeCode, kundenNr, doNotShow, 
            dailyHalt, trCodes, bemerkung, gisX, gisY, inclFVGE, 
            sperre, hinweis, livePort, transId, trVonDate];
        Transponder.updateTransponder(req.db, data, (err, result) => {
            if (err) {
                console.error("Error updating Transponder:", err.stack);
                res.status(500).send("Error updating Transponder");
            } else {
                res.status(200).send('SUCCESS');
            }
        });
    }
};

const deleteTransponder = (req, res) => {
  const transId = req.body.transid || '';
  const trVonDate = req.body.tr_vondate || '';
  Transponder.deleteTransponder(req.db, transId, trVonDate, (err, result) => {
    if (err) {
      console.error("Error deleting Transponder:", err.stack);
      res.status(500).send("Error deleting Transponder");
    } else {
      res.status(200).send('SUCCESS');
    }
  });
};


module.exports = {
    getTransponder, updateTransponder, deleteTransponder
};
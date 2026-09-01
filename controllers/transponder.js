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

module.exports = {
    getTransponder
};
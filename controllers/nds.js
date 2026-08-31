const Nds = require("../models/nds_model");
const { buildFilter, convertDate_DE_UN } = require("../middleware/utility");

ndsFilter = (post) => {
  let filt = "";
  filt += buildFilter("nds.transid", post?.transid);
  filt += buildFilter("nds.tournr", post?.tournr);
  filt += buildFilter("transponder.gruppecode", post?.gruppe);
  filt += buildFilter("fahcode", post?.fahcode);
  filt += buildFilter("probenfnr", post?.probenfnr);
  filt += buildFilter("tr_codes", "*" + (post?.tc ?? ""));
  filt += buildFilter("systemnr", post?.sysnr);

  // Handle JSON array or direct Array input for 'la'
  const la =
    typeof post?.la === "string" ? JSON.parse(post.la) : post?.la || [];
  if (Array.isArray(la) && la.length > 0 && la[0]) {
    filt += ` AND ( lieferart IN ('${la.join("','")}') )`;
  }

  // Handle JSON array or direct Array input for 'prod'
  const prod =
    typeof post?.prod === "string" ? JSON.parse(post.prod) : post?.prod || [];
  if (Array.isArray(prod) && prod.length > 0 && prod[0]) {
    filt += ` AND ( productid IN ('${prod.join("','")}') )`;
  }

  if (post?.kunden) {
    filt += ` AND (adr_vor LIKE '%${post.kunden}%' OR adr_nach LIKE '%${post.kunden}%' OR adr_kunu LIKE '${post.kunden}%')`;
  }

  if (post?.und == 1) {
    filt +=
      " AND (productname = '' OR productname IS NULL) AND (LEFT(nds.transid, 1) <> 'F')";
  }

  if (post?.unxp == 1) {
    filt += " AND (nds.ne_id is null OR nds.ne_id = '')";
  }

  if (post?.probennr) {
    filt += buildFilter("probennr", post.probennr);
  }

  const fromdate = convertDate_DE_UN(post?.fromdate);
  const todate = convertDate_DE_UN(post?.todate);
  const dateField =
    post?.show_liefdatum == 1 ? "nds.liefdatum" : "nds.tourdtyear";

  filt += ` AND (${dateField} >= '${fromdate}')`;
  filt += ` AND (${dateField} <= '${todate}')`;

  return "(1=1) " + filt;
};

const getNds = async (req, res) => {
  const sort = req.body.sort || "tourdtyear,tournr,pendzeit";
  const page = parseInt(req.body.pn) || 0;
  const pageSize = parseInt(req.body.ps) || 25;
  const offset = page * pageSize;
  let filter = ndsFilter(req.body);
  try {
    const [dataResults, statsResult, abholStatsResult] = await Promise.all([
      Nds.get(req.db, filter, sort, pageSize, offset),
      Nds.getStats(req.db, filter),
      Nds.getAbholStats(req.db, filter),
    ]);
    res.json({
      nds: dataResults,
      stats: statsResult[0],
      abholStats: abholStatsResult[0],
    });
  } catch (err) {
    console.error("Error fetching Nds:", err.stack);
    res.status(500).send("Error fetching Nds");
  }
};

module.exports = {
  getNds,
};

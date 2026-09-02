const Adressen = require("../models/adressen_model");

adressenFilter = (post) => {
  let filter = "";
  if (post.keyword) {
    filter += ` AND ( (adr_kunu LIKE '%${post.keyword}%') 
            OR (CONCAT(adr_nach, ' ', adr_vor) LIKE '%${post.keyword}%') 
            OR (CONCAT(adr_vor, ' ', adr_nach) LIKE '%${post.keyword}%')
            OR (adr_str LIKE '%${post.keyword}%' OR adr_plz LIKE '%${post.keyword}%' OR adr_ort LIKE '%${post.keyword}%')
            OR (adr_codes LIKE '%${post.keyword}%')
            OR (adr_firma LIKE '%${post.keyword}%')
            OR (adr_firma1 LIKE '%${post.keyword}%')
            OR (adr_email LIKE '%${post.keyword}%') )`;
  }

  if (post.adr_kunu) {
    filter += ` AND (adr_kunu LIKE '%${post.adr_kunu}%')`;
  }

  if (post.name) {
    filter += ` AND (CONCAT(adr_nach, ' ', adr_vor) LIKE '%${post.name}%' 
            OR CONCAT(adr_vor, ' ', adr_nach) LIKE '%${post.name}%')`;
  }

  if (post.address) {
    filter += ` AND (adr_str LIKE '${post.address}%' 
            OR adr_plz LIKE '${post.address}%' 
            OR adr_ort LIKE '${post.address}%')`;
  }

  if (post.codes) {
    filter += ` AND (adr_codes LIKE '${post.codes}%')`;
  }
  return "(1=1) " + filter;
};

const getAdressen = async (req, res) => {
  const sort = req.body.sort || "adr_avor";
  const page = parseInt(req.body.page) || 0;
  const pageSize = parseInt(req.body.page_size) || 25;
  const offset = page * pageSize;
  const filter = adressenFilter(req.body);

  try {
    const [dataResults, countResults] = await Promise.all([
      Adressen.get(req.db, filter, sort, pageSize, offset),
      Adressen.getCount(req.db, filter),
    ]);

    res.json({
      adressen: dataResults,
      records: countResults[0].nrec,
    });
  } catch (err) {
    console.error("Error fetching Adressen:", err.stack);
    res.status(500).send("Error fetching Adressen");
  }
};

const updateAdressen = (req, res) => {
  const isNew = req.body.is_new || false;
  const adr_kunu = req.body.adr_kunu || '';
  const adr_anred = req.body.adr_anred || '';
  const adr_vor = req.body.adr_vor || '';
  const adr_nach = req.body.adr_nach || '';
  const adr_firma1 = req.body.adr_firma1 || '';
  const adr_firma = req.body.adr_firma || '';
  const adr_zus = req.body.adr_zus || '';
  const adr_post = req.body.adr_post || '';
  const adr_ordnr_p = req.body.adr_ordnr_p || '';
  const adr_str = req.body.adr_str || '';
  const adr_plz = req.body.adr_plz || '';
  const adr_ort = req.body.adr_ort || '';
  const adr_ord_nr = req.body.adr_ord_nr || '';
  const adr_tel_g = req.body.adr_tel_g || '';
  const adr_tel_p = req.body.adr_tel_p || '';
  const adr_tel_f = req.body.adr_tel_f || '';
  const adr_natel = req.body.adr_natel || '';
  const adr_email = req.body.adr_email || '';
  const adr_bur_nr = req.body.adr_bur_nr || '';
  const adr_bemerkung = req.body.adr_bemerkung || '';
  const adr_properties = req.body.adr_properties || '';
  const adr_codes = req.body.adr_codes || '';
  const adr_arexnr = req.body.adr_arexnr || '';
  const adr_latitude = req.body.adr_latitude || '';
  const adr_longitude = req.body.adr_longitude || '';

  if (isNew) {
    const data = [adr_kunu, adr_anred, adr_vor, adr_nach, adr_firma1, adr_firma, adr_zus, adr_post, adr_ordnr_p, adr_str, adr_plz, adr_ort, adr_ord_nr, adr_tel_g, adr_tel_p, adr_tel_f, adr_natel, adr_email, adr_bur_nr, adr_bemerkung, adr_properties, adr_codes, adr_arexnr, adr_latitude, adr_longitude];
    Adressen.insertAdressen(req.db, data, (err, result) => {
      if (err) {
        console.error("Error inserting Adressen:", err.stack);
        res.status(500).send("Error inserting Adressen");
      } else {
        res.status(200).send('SUCCESS');
      }
    });
  } else {
    const data = [adr_anred, adr_vor, adr_nach, adr_firma1, adr_firma, adr_zus, adr_post, adr_ordnr_p, adr_str, adr_plz, adr_ort, adr_ord_nr, adr_tel_g, adr_tel_p, adr_tel_f, adr_natel, adr_email, adr_bur_nr, adr_bemerkung, adr_properties, adr_codes, adr_arexnr, adr_latitude, adr_longitude, adr_kunu];
    Adressen.updateAdressen(req.db, data, (err, result) => {
      if (err) {
        console.error("Error updating Adressen:", err.stack);
        res.status(500).send("Error updating Adressen");
      } else {
        res.status(200).send('SUCCESS');
      }
    });
  }
};

const deleteAdressen = (req, res) => {
  const adr_kunu = req.body.adr_kunu || '';
  Adressen.deleteAdressen(req.db, adr_kunu, (err, result) => {
    if (err) {
      console.error("Error deleting Adressen:", err.stack);
      res.status(500).send("Error deleting Adressen");
    } else {
      res.status(200).send('SUCCESS');
    }
  });
};

module.exports = {
  getAdressen,
  updateAdressen,
  deleteAdressen
};

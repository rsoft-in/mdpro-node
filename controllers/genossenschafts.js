const Genossenschafts = require('../models/genossenschafts_model');

const get = async (req, res) => {
  const sort = req.body.sort || 'genonr';
  const page = parseInt(req.body.page) || 0;
  const pageSize = parseInt(req.body.page_size) || 25;
  const offset = page * pageSize;
  const keyword = req.body.keyword || '';

  try {
    const [dataResults, countResults] = await Promise.all([
      Genossenschafts.get(req.db, keyword, sort, pageSize, offset),
      Genossenschafts.getCount(req.db, keyword),
    ]);

    res.json({
      genossenschafts: dataResults,
      records: countResults[0].nrec,
    });
  } catch (err) {
    console.error('Error fetching Genossenschafts:', err.stack);
    res.status(500).send('Error fetching Genossenschafts');
  }
};

const updateGenossenschaft = (req, res) => {
  const isNew = req.body.isNew || false;
  const genonr = req.body.genonr || '';
  const bez = req.body.bez || '';

  if (isNew) {
    const data = [genonr, bez];
    Genossenschafts.insertGenossenschaft(req.db, data, (err, result) => {
      if (err) {
        console.error('Error inserting Genossenschaft:', err.stack);
        res.status(500).send('Error inserting Genossenschaft');
      } else {
        res.status(200).send('SUCCESS');
      }
    });
  } else {
    const data = [bez, genonr];
    Genossenschafts.updateGenossenschaft(req.db, data, (err, result) => {
      if (err) {
        console.error('Error updating Genossenschaft:', err.stack);
        res.status(500).send('Error updating Genossenschaft');
      } else {
        res.status(200).send('SUCCESS');
      }
    });
  }
};

const deleteGenossenschaft = (req, res) => {
  const genonr = req.body.genonr || '';

  Genossenschafts.deleteGenossenschaft(req.db, genonr, (err, result) => {
    if (err) {
      console.error('Error deleting Genossenschaft:', err.stack);
      res.status(500).send('Error deleting Genossenschaft');
    } else {
      res.status(200).send('SUCCESS');
    }
  });
};

module.exports = {
  get, updateGenossenschaft, deleteGenossenschaft
};
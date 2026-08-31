const Codes = require('../models/codes_model');

const getCodes = async (req, res) => {
    const search = req.body.keyword || '';
    const sort = req.body.sort || 'cod_code';
    const page = parseInt(req.body.page) || 0;
    const pageSize = parseInt(req.body.page_size) || 25;
    const offset = page * pageSize;

    try {
        const [dataResults, countResults] = await Promise.all([
            Codes.get(req.db, search, sort, pageSize, offset),
            Codes.getCount(req.db, search)
        ]);

        res.json({
            codes: dataResults,
            records: countResults[0].nrec
        });
    } catch (err) {
        console.error('Error fetching Codes:', err.stack);
        res.status(500).send('Error fetching Codes');
    }
};

const getCodesByArt = async (req, res) => {
    const cod_art = req.body.cod_art || '';
    const sort = req.body.sort || 'cod_bez';

    try {
        const [dataResults] = await Promise.all([
            Codes.getByArt(req.db, cod_art, sort),
        ]);

        res.json({
            codes: dataResults
        });
    } catch (err) {
        console.error('Error fetching Codes:', err.stack);
        res.status(500).send('Error fetching Codes');
    }
};

module.exports = {
    getCodes, getCodesByArt
}
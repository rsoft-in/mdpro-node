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

const updateCodes = (req, res) => {
    const codArt = req.body.cod_art;
    const codCode = req.body.cod_code;
    const codBez = req.body.cod_bez;
    const codWert = req.body.cod_wert;
    const codUser = req.body.cod_user;
    const codAbbreviation = req.body.cod_abbreviation;
    const isNew = req.body.isNew;

    if (isNew) {
        const data = [codArt, codCode, codBez, codWert, codAbbreviation, codUser];
        Codes.insertCodes(req.db, data, (err, result) => {
            if (err) {
                console.error('Error inserting Code:', err.stack);
                res.status(500).send('Error inserting Code');
            } else {
                res.json("SUCCESS");
            }
        });
    } else {
        const data = [codBez, codWert, codAbbreviation, codUser, codArt, codCode];
        Codes.updateCodes(req.db, data, (err, result) => {
            if (err) {
                console.error('Error updating Code:', err.stack);
                res.status(500).send('Error updating Code');
            } else {
                res.json("SUCCESS");
            }
        });
    }
};

const deleteCodes = (req, res) => {
    const codArt = req.body.cod_art;
    const codCode = req.body.cod_code;

    Codes.deleteCodes(req.db, codArt, codCode, (err, result) => {
        if (err) {
            console.error('Error deleting Code:', err.stack);
            res.status(500).send('Error deleting Code');
        } else {
            res.json("SUCCESS");
        }
    });
};

module.exports = {
    getCodes, getCodesByArt, updateCodes, deleteCodes
}
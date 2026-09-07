const Gruppe = require("../models/gruppe_model");

const get = async (req, res) => {
    const keyword = req.body.keyword || '';
    const sort = req.body.sort || "gruppename";
    const page = parseInt(req.body.page) || 0;
    const pageSize = parseInt(req.body.page_size) || 25;
    const offset = page * pageSize;

    try {
        const [dataResults, countResults] = await Promise.all([
            Gruppe.get(req.db, keyword, sort, pageSize, offset),
            Gruppe.getCount(req.db, keyword),
        ]);

        res.json({
            gruppe: dataResults,
            records: countResults[0].nrec,
        });
    } catch (err) {
        console.error("Error fetching Gruppe:", err.stack);
        res.status(500).send("Error fetching Gruppe");
    }
};

const getEmails = async (req, res) => {
    const keyword = req.body.keyword || '';

    try {
        const [dataResults] = await Promise.all([
            Gruppe.getEmails(req.db, keyword),
        ]);

        res.json({
            gruppe: dataResults
        });
    } catch (err) {
        console.error("Error fetching Gruppe:", err.stack);
        res.status(500).send("Error fetching Gruppe");
    }
}

const updateGruppe = (req, res) => {
    const isNew = req.body.is_new || false;
    const gruppeCode = req.body.gruppecode || '';
    const gruppeName = req.body.gruppename || '';
    const gruppeEmail = req.body.gruppeemail || '';
    const gruppeExpFormat = req.body.gruppeexpformat || '';
    const gruppeUseMail = req.body.gruppeusemail || 0;
    const gruppeActive = req.body.gruppeactive || 0;

    if (isNew) {
        const data = [gruppeCode, gruppeName, gruppeEmail, gruppeExpFormat, gruppeUseMail, gruppeActive, 0];
        Gruppe.insertGruppe(req.db, data, (err, result) => {
            if (err) {
                console.error("Error inserting Gruppe:", err.stack);
                res.status(500).send("Error inserting Gruppe");
            } else {
                res.status(200).send('SUCCESS');
            }
        });
    } else {
        const data = [gruppeName, gruppeEmail, gruppeExpFormat, gruppeUseMail, gruppeActive, gruppeCode];
        Gruppe.updateGruppe(req.db, data, (err, result) => {
            if (err) {
                console.error("Error updating Gruppe:", err.stack);
                res.status(500).send("Error updating Gruppe");
            } else {
                res.status(200).send('SUCCESS');
            }
        });
    }
};

const updateUseEmail = (req, res) => {
    const gruppeCode = req.body.gruppecode || '';
    Gruppe.updateUseEmail(req.db, gruppeCode, (err, result) => {
        if (err) {
            console.error("Error updating Gruppe:", err.stack);
            res.status(500).send("Error updating Gruppe");
        } else {
            res.status(200).send('SUCCESS');
        }
    });
};

const updateActive = (req, res) => {
    const gruppeCode = req.body.gruppecode || '';
    Gruppe.updateActive(req.db, gruppeCode, (err, result) => {
        if (err) {
            console.error("Error updating Gruppe:", err.stack);
            res.status(500).send("Error updating Gruppe");
        } else {
            res.status(200).send('SUCCESS');
        }
    });
};

const deleteGruppe = (req, res) => {
    const gruppeCode = req.body.gruppecode || '';
    Gruppe.deleteGruppe(req.db, gruppeCode, (err, result) => {
        if (err) {
            console.error("Error deleting Gruppe:", err.stack);
            res.status(500).send("Error deleting Gruppe");
        } else {
            res.status(200).send('SUCCESS');
        }
    });
};

module.exports = {
    get, getEmails, updateGruppe, updateUseEmail, updateActive, deleteGruppe
}
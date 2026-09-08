const Gruppe = require("../models/gruppe_model");

const get = async (req, res) => {
    const keyword = req.body.keyword || '';
    const sort = req.body.sort || "gruppename";
    const active = req.body.active || 0;
    const page = parseInt(req.body.page) || 0;
    const pageSize = parseInt(req.body.page_size) || 25;
    const offset = page * pageSize;

    try {
        const [dataResults, countResults] = await Promise.all([
            Gruppe.get(req.db, keyword, active, sort, pageSize, offset),
            Gruppe.getCount(req.db, keyword, active),
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

const download = async (req, res) => {
    const post = req.body;
    let rowsAffected = 0;
    let rowsUpdated = 0;
    let rowsFailed = 0;
    let error = "";

    const insertGruppeAsync = (db, data) => {
        return new Promise((resolve, reject) => {
            Gruppe.insertGruppe(db, data, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    const updateGruppeAsync = (db, data) => {
        return new Promise((resolve, reject) => {
            Gruppe.updateOnImport(db, data, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    const url = "https://regtool.mdpro.ch/ws/public/index.php/gruppe/get_all";
    try {
        const postData = new URLSearchParams({ dbconnection: post.tenant_id });
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: postData
        });

        const parsed = await response.json();

        for (const gruppe of parsed) {
            const existing = await Gruppe.getByCode(req.db, gruppe.gruppe_code);
            try {
                const [dataResults] = await Promise.all([
                    Gruppe.getByCode(req.db, gruppe.gruppe_code),
                ]);
                const existing = dataResults;
                if (!existing || existing.length === 0) {
                    const data = [gruppe.gruppe_code, gruppe.gruppe_name, gruppe.gruppe_email, 'APN', 0, 0, 1];
                    await insertGruppeAsync(req.db, data);
                    rowsAffected++;
                } else {
                    const data = [
                        gruppe.gruppe_name,
                        gruppe.gruppe_email,
                        gruppe.gruppe_code
                    ];
                    await updateGruppeAsync(req.db, data);
                    rowsUpdated++;
                }
            } catch (err) {
                error += `Unable to import Gruppe: ${gruppe.gruppe_code}`;
                console.error("Error fetching Gruppe:", err.stack);
                rowsFailed++;
            }
        }

        return res.json({
            inserted: rowsAffected,
            update: rowsUpdated,
            failed: rowsFailed,
            error: error
        });

    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

module.exports = {
    get, getEmails, updateGruppe, updateUseEmail, updateActive, deleteGruppe, download
}
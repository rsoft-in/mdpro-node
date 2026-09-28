const EmailAccounts = require('../models/email_accounts_model');

const getEmailAccounts = async (req, res) => {
  const keyword = req.body.keyword || '';
  const sort = req.body.sort || "email_smtp_server";
  const page = parseInt(req.body.page) || 0;
  const pageSize = parseInt(req.body.page_size) || 25;
  const offset = page * pageSize;

  try {
    const [dataResults, countResults] = await Promise.all([
      EmailAccounts.get(req.db, keyword, sort, pageSize, offset),
      EmailAccounts.getCount(req.db, keyword),
    ]);

    res.json({
      emailaccounts: dataResults,
      records: countResults[0].nrec,
    });
  } catch (err) {
    console.error("Error fetching Email Accounts:", err.stack);
    res.status(500).send("Error fetching Email Accounts");
  }
};

module.exports = {
    getEmailAccounts
}
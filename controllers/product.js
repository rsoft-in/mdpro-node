const Product = require('../models/product_model');

const getProducts = async (req, res) => {
    const search = req.body.keyword || '';
    const sort = req.body.sort || 'productid';
    const page = parseInt(req.body.page) || 0;
    const pageSize = parseInt(req.body.page_size) || 25;
    const offset = page * pageSize;

    try {
        const [dataResults, countResults] = await Promise.all([
            Product.get(req.db, search, sort, pageSize, offset),
            Product.getCount(req.db, search)
        ]);

        res.json({
            products: dataResults,
            records: countResults[0].nrec
        });
    } catch (err) {
        console.error('Error fetching Products:', err.stack);
        res.status(500).send('Error fetching Products');
    }
};

const getProductsActive = async (req, res) => {
    const sort = req.body.sort || 'productid';
    try {
        const [dataResults] = await Promise.all([
            Product.getActive(req.db),
        ]);

        res.json({
            products: dataResults,
        });
    } catch (err) {
        console.error('Error fetching Products:', err.stack);
        res.status(500).send('Error fetching Products');
    }
};

module.exports = {
    getProducts, getProductsActive
};
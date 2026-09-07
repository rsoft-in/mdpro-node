const Product = require('../models/product_model');

const getProducts = async (req, res) => {
    const search = req.body.keyword || '';
    const active = req.body.active || 0;
    const sort = req.body.sort || 'productid';
    const page = parseInt(req.body.page) || 0;
    const pageSize = parseInt(req.body.page_size) || 25;
    const offset = page * pageSize;

    try {
        const [dataResults, countResults] = await Promise.all([
            Product.get(req.db, search, active, sort, pageSize, offset),
            Product.getCount(req.db, search, active)
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

const updateProduct = (req, res) => {
    const productid = req.body.productid;
    const productname = req.body.productname;
    const productconvfactor = req.body.productconvfactor;
    const productname_reg = req.body.productname_reg;
    const product_segment = req.body.product_segment;
    const product_segment2 = req.body.product_segment2;
    const product_quality = req.body.product_quality;
    const product_user = req.body.product_user;
    const isNew = req.body.isNew;

    if (isNew) {
        const data = [productid, productname, productconvfactor, productname_reg, 
            product_segment, product_segment2, product_quality, product_user];
        Product.insertProduct(req.db, data, (err, result) => {
            if (err) {
                console.error('Error inserting Product:', err.stack);
                res.status(500).send('Error inserting Product');
            } else {
                res.json("SUCCESS");
            }
        });
    } else {
        const data = [productname, productconvfactor, productname_reg, 
            product_segment, product_segment2, product_quality, product_user, productid];
        Product.updateProduct(req.db, data, (err, result) => {
            if (err) {
                console.error('Error updating Product:', err.stack);
                res.status(500).send('Error updating Product');
            } else {
                res.json("SUCCESS");
            }
        });
    }
};

const updateActive = (req, res) => {
    const productid = req.body.productid;

    Product.updateActive(req.db, productid, (err, result) => {
        if (err) {
            console.error('Error updating Product Active:', err.stack);
            res.status(500).send('Error updating Product Active');
        } else {
            res.json("SUCCESS");
        }
    });
};

const deleteProduct = (req, res) => {
    const productid = req.body.productid;

    Product.deleteProduct(req.db, productid, (err, result) => {
        if (err) {
            console.error('Error deleting Product:', err.stack);
            res.status(500).send('Error deleting Product');
        } else {
            res.json("SUCCESS");
        }
    });
};

module.exports = {
    getProducts, getProductsActive, updateProduct, updateActive, deleteProduct
};

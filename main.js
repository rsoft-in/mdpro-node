const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const adressenRoutes = require('./routes/adressen_routes');
const ndsRoutes = require('./routes/nds_routes');
const codesRoutes = require('./routes/codes_routes');
const productRoutes = require('./routes/product_routes');

app.use('/api/adressen', adressenRoutes);
app.use('/api/nds', ndsRoutes);
app.use('/api/codes', codesRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.send('MDPRO WEB SERVICE');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
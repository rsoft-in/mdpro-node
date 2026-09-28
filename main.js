const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dashboardRoutes = require('./routes/dashboard_routes');
const adressenRoutes = require('./routes/adressen_routes');
const ndsRoutes = require('./routes/nds_routes');
const codesRoutes = require('./routes/codes_routes');
const productRoutes = require('./routes/product_routes');
const transponderRoutes = require('./routes/transponder_routes');
const genossenschaftsRoutes = require('./routes/genossenschafts_routes');
const gruppeRoutes = require('./routes/gruppe_routes');
const emailAccountRoutes = require('./routes/email_accounts_routes');

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/adressen', adressenRoutes);
app.use('/api/nds', ndsRoutes);
app.use('/api/codes', codesRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transponder', transponderRoutes);
app.use('/api/genossenschafts', genossenschaftsRoutes);
app.use('/api/gruppe', gruppeRoutes);
app.use('/api/email_accounts', emailAccountRoutes);

app.get('/', (req, res) => {
    res.send('MDPRO WEB SERVICE');
});

app.get('/api', (req, res) => {
    res.send('MDPRO WEB SERVICE');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
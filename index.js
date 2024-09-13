const axios = require('axios');
const express = require('express');
const app = express();
const {router} = require('./routes/subdRoutes')

app.use(express.json()); 

app.use('/subdomains',router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

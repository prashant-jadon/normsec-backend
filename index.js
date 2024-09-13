const axios = require('axios');
const express = require('express');
const app = express();
const {router} = require('./routes/subdRoutes')
const {connectTODb} = require('./connection')

app.use(express.json()); 

connectTODb('mongodb://127.0.0.1:27017');

app.use('/subdomains',router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

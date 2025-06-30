const axios = require('axios');
const express = require('express');
const app = express();
const {router} = require('./routes/subdRoutes')
const {connectTODb} = require('./connection')

app.use(express.json()); 

connectTODb('mongodb+srv://prashant:prashant@cluster0.zktg0fy.mongodb.net/');

app.use('/subdomains',router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

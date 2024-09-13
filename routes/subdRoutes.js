const express = require('express')
const router = express.Router()
const {handleGetSubdomains,handleSubdRequest} = require('../controller/makeSubdomainRequest')

router.post('/',handleSubdRequest);
router.get('/results/:domain',handleGetSubdomains);

module.exports = {
    router
}
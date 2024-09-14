const express = require('express')
const router = express.Router()
const {handleGetSubdomains,handleSubdRequest, handleGetSubdomains403} = require('../controller/makeSubdomainRequest')

router.post('/',handleSubdRequest);
router.get('/results/:domain',handleGetSubdomains);
router.get('/results403/:domain',handleGetSubdomains403);

module.exports = {
    router
}
const mongoose = require('mongoose')

const schema = mongoose.Schema({
    domain:{
        type:String,
        required:true
    },
    jsonData: {
        type: Object,  // This allows the field to accept any valid JSON object
        required: true
      },
},{timestamps:true})

const Subdomains = mongoose.model('subdomains',schema)

module.exports = {
    Subdomains
}
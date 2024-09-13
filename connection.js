//todo
const mongoose = require('mongoose')

async function connectTODb(uri) {
   try {
    mongoose.connect(uri);
    console.log("Connceted to DB");
   } catch (error) {
    console.log(error)
   }
}

module.exports = {
    connectTODb
}
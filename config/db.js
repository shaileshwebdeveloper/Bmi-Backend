// We do this to connect with MongoDB atlas
// We use dot env because we want to keep our credentials hidden.


const mongoose =  require('mongoose')

require('dotenv').config()   

const connection = mongoose.connect(process.env.MONGO_URL)

module.exports = {connection}
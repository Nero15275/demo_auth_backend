const mongoose = require(`mongoose`)
const dburl = process.env.dburl
mongoose.connect(dburl, {
    // useNewUrlPerser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`DB connection Successfull`)
}).catch((err) => {
    console.log(`db Connection Failed Error` + err)
})
module.exports = mongoose;
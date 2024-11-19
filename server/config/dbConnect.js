const { default: mongoose } = require("mongoose")

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL)
        console.log('Database connection successfully')
    } catch (error) {
        console.log('Error connecting to Mongo')
    }
}

module.exports = dbConnect;
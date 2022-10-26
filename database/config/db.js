const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect("mongodb+srv://admin:admin@cluster0.pssyct6.mongodb.net/mgmt_db?retryWrites=true&w=majority")
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB;
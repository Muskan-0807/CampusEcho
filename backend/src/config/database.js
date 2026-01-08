const mongoose= require ('mongoose');
require('dotenv').config();

const connectDB = async()=> {
    await mongoose.connect(
        process.env.MONGO_URL, { dbName: "CampusEchoDB" }); 
};
  
module.exports = connectDB;
//code to connect to mongoose database
const mongoose=require('mongoose');
const mongoURI="mongodb://localhost:27017/inotebook";
const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to Mongo DB successfully!");
    })
}
module.exports=connectToMongo;

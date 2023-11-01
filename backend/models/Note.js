const mongoose=require('mongoose');
const { Schema } = mongoose;
const NotesSchema=new Schema({
    //like a foreign key whose type is id of anoher model
    //user model is the reference
    user:{
        type:mongoose.Schema.Types.ObjectId,     
        ref:'user'     
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        default:"General"
    },
    date:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model('note',NotesSchema);
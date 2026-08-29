const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
}, {timestamps:true})

const UserModel = mongoose.model("iNotebook_user_details", UserSchema);
module.exports = UserModel
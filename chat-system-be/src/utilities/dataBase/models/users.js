const mongoose = require('mongoose');

const Schema = mongoose.Schema;     // its a class for models entities

const User = new Schema({
    userName:{
        type: String,
        required: true
    },
    password : { type : String, required : true },
    unreadMsgCount: { type: Number , requied: false, default:0},
})

module.exports = mongoose.model('User',User);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;     // its a class for models entities

const Comment = new Schema({
    userId :{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    comment:{ type : String, required:true},
    createdAt: { 
        type: Date, 
        default: Date,
        default: () => new Date(
          new Date().setHours(
            new Date().getHours() + 5,
            new Date().getMinutes() + 30
          )
        ), 
        required:false 
    },
    postId:{
        type: Schema.Types.ObjectId,
        ref:'Post',
        required:true
    }
})

module.exports = mongoose.model('Comment',Comment);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;     // its a class for models entities

const Post = new Schema({
    userId :{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{ type : String, required:true},
    description : { type : String, required : true },
    url: { type: String , requied: true},
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
    updatedAt: { type: Date, required:false },
})

module.exports = mongoose.model('Post',Post);
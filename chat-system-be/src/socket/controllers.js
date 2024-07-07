const { ObjectId } = require("mongodb");
const CommentModel = require("../utilities/dataBase/models/comments");
const UsersModel = require("../utilities/dataBase/models/users");


exports.addComment = async(data, socket)=>{
    try{
        const {userId, postId, comment} =data;

        //get the user details
        const user = await UsersModel.findOne({_id:new ObjectId(userId)})

        const newComment = {
            userId: new ObjectId(userId),
            comment: comment,
            postId:new ObjectId(postId),
        }

        const savedComment = await CommentModel.create(newComment);

        socket.broadcast.emit("add_comment_listen", {
            ...newComment,
            _id: savedComment._id,
            userName: user.userName,
        })
    }catch(e){
        console.log(e)
    }
}
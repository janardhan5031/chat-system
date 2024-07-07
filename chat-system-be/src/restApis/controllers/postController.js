const { response } = require("express");
const PostModel = require("../../utilities/dataBase/models/posts");
const {uploadToS3} = require("../../utilities/services/s3_bucket")
const { ObjectId } = require("mongodb");
const CommentsModel = require("../../utilities/dataBase/models/comments")

exports.createPost = async (req,res)=>{
    try{
        const {title, description,loginResponse} = req.body;
        const file = req.file;

        console.log(loginResponse);
        
        const url = await uploadToS3(file)
        console.log(url)

        // create a new post
        const postDetails = {
            userId: new ObjectId(`${loginResponse._id}`),
            title,
            description,
            url,
        }
        const post = await PostModel.create(postDetails)

        res.status(200).json({
            status:"SUCCESS",
            message:"Post created successfully",
            result:{
                ...postDetails,
                _id:post._id,
            }
        })

    }catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
}

exports.getPosts = async (req,res)=>{
    try{
        const posts = await PostModel.aggregate([
            {
                $lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    pipeline:[
                        {
                            $project:{
                                _id:1,
                                userName:'$userName',
                            }
                        }
                    ],
                    as:'metaData'
                }
            },
            {
                $unwind:"$metaData"
            },
            {
                $sort:{
                    createdAt:-1
                }
            }
        ])

        res.status(200).json({
            status:"SUCCESS",
            message:"Posts fetched successfully",
            result:posts,
        })
    }catch(error){
        console.log(error)
        res.status(500).send(err.message)
    }
}

exports.getPostComments = async(req, res)=>{
    try{
        const {postId} = req.query

        const comments = await CommentsModel.aggregate([
            {
                $match:{
                    postId:new ObjectId(postId),
                }
            },
            {
                $lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    pipeline:[
                        {
                            $project:{
                                _id:1,
                                userName:'$userName',
                            }
                        }
                    ],
                    as:'metaData'
                }
            },
            {
                $unwind:"$metaData"
            },
            {
                $sort:{
                    createdAt:-1
                }
            },
            {
                $project:{
                    _id:1,
                    userId:1,
                    userName:"$metaData.userName",
                    comment:1,
                    createdAt:1,
                    postId:1
                }
            }
        ])

        res.status(200).json({
            status:"SUCCESS",
            message:"Comments fetched successfully",
            result:comments,
        })
    }catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
}
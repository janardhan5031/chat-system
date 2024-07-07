const User = require("../../utilities/dataBase/models/users");
const jwt = require('jsonwebtoken');   

exports.login = async (req, res)=>{
    try{
        const {userName, password}= req.body;
        // check if user exists and password is correct
        const [existingUser]= await User.aggregate([
            {
                $match: {
                    userName,
                }
            }
        ])

        function sendSuccess(data){
            res.status(200).json({
                status:"SUCCESS",
                message:"Login Successfully",
                access_token:data.token,
                userName: data.userName,
                _id: data._id,
                unreadMsgCount: data.unreadMsgCount,
            })
        }

        if(!existingUser){
            // save the new User
            const createdUser = await User.create({userName, password});
            const newUser = {
                userName:createdUser.userName, 
                _id:createdUser._id,
                unreadMsgCount: createdUser.unreadMsgCount,
            }
            const token = await createToken(newUser)
            sendSuccess({...newUser, token})
            return;
        }

        if(existingUser && existingUser.password!=password){
          res.status(403).json({
            status:"Failed",
            message:"Invalid Password"
          })
          return ;
        }


        // allow the user to login 
        const token = await createToken({userName:existingUser.userName, _id:existingUser._id})

        sendSuccess({...existingUser, token})
    }catch(err){
        console.log(err)
        res.status(500).send("server error")
    }
}


const createToken = (data)=>{
    try{
        return new Promise((resolve, reject)=>{
            const token = jwt.sign(data,process.env.SECRETE_KEY);
            resolve(token)
        })
    }catch(error){
        throw new Error(error.message)
    }
}



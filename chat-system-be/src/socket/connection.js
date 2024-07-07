// const Clients = require('../models/clients.js');
const jwt = require('jsonwebtoken');
const controllers = require("./controllers")

exports.connect = (socket)=>{    
    
    console.log(`client connected: ${JSON.stringify(socket.handshake.loginResponse)}`);
    
    // send the data to all clients on event based
    socket.on('news_post', (data)=>{
        console.log(data);
        socket.broadcast.emit("news_post_listen", data);
    } )

    socket.on("add_commnet",(data)=>{
        controllers.addComment(data, socket);
    })
    
    
    socket.on('disconnect', async ()=>{
        // await Clients.update({isConnected:false},{where:{connectionId:socket.id}})
        console.log('===> socket disconnected',socket.id)
    })

    socket.on('error',()=>{
        console.log('something went wrong',socket.id)
    })
    socket.on('connect_error',()=>{
        console.log('connection error',socket.id)
    })
}

exports.disconnect=(socket)=>{
    console.log(`===> ${socket.id} is disconnected`)
}

exports.error =(error)=>{
    console.log('something went wrong ',error)
}

exports.validateAccessToken= (socket, next)=>{
    const accessToken = socket.handshake.auth.access_token;
    try{
        const userData = jwt.verify(accessToken, process.env.SECRETE_KEY);
        socket.handshake["loginResponse"] = userData;

        next();
    }catch(err){
        console.log('Invalid token')
        socket.disconnect();
        return next(err)
    }
}

async function isAuthorized(socket, next){
    const token = socket.handshake.auth.token;
    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const err = new Error("not authorized");
        
        // const client = await Clients.findOne({where:{name:user.name,email:user.email}});
        
        // console.log(client)
        if(!client){
            err.data = { content: "Please retry later", message:'Client not exists in database' }; 
            return next(err);
        }
        else if(client.dataValues.isConnected){
            err.data ={
                content:'please retry later',
                message:'Client already connected with this credentials'
            }
            return next(err)
        }

        
        // await Clients.update({isConnected:true,connectionId:socket.id},{where:{name:user.name}})

        next()
        

    }
    catch(err){
        console.log(err)
    }
    
    
}


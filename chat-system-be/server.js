const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const socket_io = require('socket.io')
const {ConnectDatabase} = require('./src/utilities/dataBase/config');
const router = require('./src/restApis/routes/routes');
const Connection = require("./src/socket/connection")

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.get('/',(req,res)=>{
    res.send('hello world');
})

app.use("/v1",router)


async function connectDb(){
    return await Promise.resolve(ConnectDatabase());
}
connectDb();

let server;
if (process.env.HTTPS == 'https') {
    const fs = require("fs");
    const https = require("https");
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CRT),
        ca: [fs.readFileSync(process.env.SSL_CAB), fs.readFileSync(process.env.SSL_CRT)],
        requestCert: false,
        rejectUnauthorized: false
    }
    server = https.createServer(options, app);
}
else {
    server = require('http').Server(app);
}

server.listen(process.env.PORT,async ()=>{
    console.log(`server listening at http://localhost:${process.env.PORT}`);
})

const io = socket_io(server,{'pingInterval':4000,'pingTimeout':2000});

// const source = io.of('/socket');  // room for sending data to clients after some delay

// /middlewares 
io.use(Connection.validateAccessToken);
// io.use((socket, next) => Connection.checkSecret(socket,next,process.env.io_SECRET));

// for io connection 
io.on('connection', socket=> Connection.connect(socket));  
io.on('disconnect', socket => Connection.disconnect(socket));
io.on('error',err => Connection.error(err));





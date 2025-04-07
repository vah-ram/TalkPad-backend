import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { Server } from 'socket.io';
import signRouter from './routes/userRoute.js';
import messageRouter from './routes/messageRoute.js';

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', signRouter);
app.use('/api/messages', messageRouter);

mongoose.connect(mongoose.connect(process.env.MONGO_URL))
    .then(() => console.log("MongoDb connected!!!"))
    .catch(err => console.log(err));


const server = app.listen( PORT, () => {
    console.log("Server is Listening!!!");
});

const io = new Server(server, {
    cors: {
        origin: 'https://talkpad22.onrender.com',
        credentials: true
      }
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
    socket.on('add-user', (user) => {
        onlineUsers.set(user,socket.id)
    });

    socket.on('send-message', (data) => {
        const sendReceiveUser = onlineUsers.get(data.to);
        if(sendReceiveUser) {
            socket.to(sendReceiveUser).emit('receive-message', data.message)
        }
    })
})
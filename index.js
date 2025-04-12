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

mongoose.connect('mongodb+srv://Vahram:vahram12345@cluster0.powdqsm.mongodb.net/SpeakPad')
    .then(() => console.log("MongoDb connected!!!"))
    .catch(err => console.log(err));


const server = app.listen( PORT, () => {
    console.log("Server is Listening!!!");
});

const io = new Server(server, {
    cors: {
        origin: 'http://talkpad.free.nf',
        credentials: true
      }
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
    socket.on('add-user', (user) => {
        onlineUsers.set(user,socket.id);

       io.emit('online-users', Array.from(onlineUsers.keys()));
    });

    socket.on('send-message', (data) => {
        const sendReceiveUser = onlineUsers.get(data.to);
        if(sendReceiveUser) {
            socket.to(sendReceiveUser).emit('receive-message', data)
        }
    });

    socket.on('disconnect', () => {
        for(let [userId,sockId] of onlineUsers.entries()) {
            if( sockId === socket.id ) {
                onlineUsers.delete(userId);
                break;
            }
        };
        io.emit('online-users', Array.from(onlineUsers.keys()));
    });
});
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import signRouter from './routes/userRoute.js';
import messageRouter from './routes/messageRoute.js';
import fileRouter from './routes/fileRoute.js'
import profileRouter from './routes/ProfileRoute.js'
import convertRouter from './routes/convertRouter.js'

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));
app.use('/uploadProfile', express.static('uploadProfile'));
app.use('/api/auth', signRouter);
app.use('/api/messages', messageRouter);
app.use('/api/files', fileRouter);
app.use('/api/user', profileRouter);
app.use('/converts', convertRouter);

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
        onlineUsers.set(user, socket.id);

       io.emit('online-users', Array.from(onlineUsers.keys()));
    });

    socket.on('join-group', (groupId) => {
        socket.join(groupId);
    });      
    
    socket.on('send-message', (data) => {
        const sendReceiveUser = onlineUsers.get(data.to);
        const sendSender = onlineUsers.get(data.from);

        if (data.type === "Group") {
            io.to(data.to).emit('receive-message', data);
            io.to(data.to).emit('last-message', {
                message: data.message,
                image: data.image,
                from: data.from,
                to: data.to,
                createdAt: data.createdAt,
            });
        } else {
            if (sendReceiveUser) {
                socket.to(sendReceiveUser).emit('receive-message', data);
                socket.to(sendReceiveUser).emit('refresh-contacts');
                socket.to(sendReceiveUser).emit('last-message', {
                    message: data.message,
                    image: data.image,
                    from: data.from,
                    to: data.to,
                    createdAt: data.createdAt,
                });
            }

        if (sendSender) {
            socket.to(sendSender).emit('last-message', {
                message: data.message,
                image: data.image,
                from: data.from,
                to: data.to,
                createdAt: data.createdAt,
            });
        }
    }
    });

    socket.on("refresh-contacts", () => {
        socket.emit('refresh-contacts')
    })

    socket.on("refresh-message", (data) => {

        if (data.type === "Group") {
            io.to(data.to).emit('refresh-message', { contactId: data.to });
        }
        if (data.type === "User") {
            const receiverSocketId = onlineUsers.get(data.to);
            const senderSocketId = onlineUsers.get(data.from);
    
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('refresh-message', { contactId: data.from });
            }
            if (senderSocketId) {
                io.to(senderSocketId).emit('refresh-message', { contactId: data.to });
            }
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

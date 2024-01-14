const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Include CORS

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = socketIo(server, {
    cors: {
        origin: function (origin, callback) {
            const allowedOrigins = ["http://xero-force.vercel.app", "http://localhost:3000"];
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Origin not allowed by CORS'));
            }
        },
        methods: ["GET", "POST"]
    }
});


const PORT = process.env.PORT || 8080;

let socketIdMap = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register', (userId) => {
        socketIdMap[userId] = socket.id;
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove the socket ID from the map on disconnect
        for (let userId in socketIdMap) {
            if (socketIdMap[userId] === socket.id) {
                delete socketIdMap[userId];
                break;
            }
        }
    });
});

// Use CORS middleware for Express
app.use(cors({
    origin: ["http://xero-force.vercel.app", "http://localhost:3000"],
}));


app.use(express.json());

app.post('/insertEvent', (req, res) => {
    const userId = req.body.userId;
    const socketId = socketIdMap[userId];
    if (socketId) {
        io.to(socketId).emit('newMessage', { userId: userId });
        res.send('Event inserted for user: ' + userId);
    } else {
        res.status(404).send('User not connected');
    }
});

server.listen(PORT, () => {
    console.log(`Socket.IO server listening on port ${PORT}`);
});

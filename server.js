const express = require('express');
const https = require('https');
const fs = require('fs');
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

const app = express();
const server = https.createServer({
    key: fs.readFileSync('./https-certificate/key.pem'),
    cert: fs.readFileSync('./https-certificate/cert.pem')
}, app);

const io = new Server(server);

io.on("connection", (socket) => {
    console.log(`user connected ${socket.id}`);
    
    // Listen for paint data from clients
    socket.on('paint', (data) => {
        console.log(`Received paint data from ${socket.id}:`, data);
        
        // Broadcast paint data to all other clients
        socket.broadcast.emit('paint', data);
    });

    socket.on('disconnect', () => {
        console.log(`user disconnected ${socket.id}`);
    });
});

app.use(express.static('public'));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

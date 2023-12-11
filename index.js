const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://127.0.0.1:3000', // Replace with your client origin
    methods: ['GET', 'POST'],
  },
});

const users = {};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// if any new user joins, let other users connected to the server know!
io.on('connection', (socket) => {
  socket.on('new-user-joined', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  // if someone sends a message, broadcast it to other people
  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });

    // if someone leaves the chat, let others know
    socket.on('disconnect', () => {
      socket.broadcast.emit('left', users[socket.id]);
      delete users[socket.id];
    });
  });
});

// Set up a route to handle the initial connection from the client
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(filePath);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

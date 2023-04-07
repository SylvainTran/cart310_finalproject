const { Server } = require('socket.io');

const io = new Server(7778);
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist/lightworks/'));
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/dist/lightworks/index.html');
});

// Node.js
const port = process.env.PORT || 7777;

app.listen(port, function() {
  console.log('Server running on port ' + port);  
});

/// Socket.io
io.on("connection", (socket) => {
  // send a message to the client
  socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });

  // receive a message from the client
  socket.on("hello from client", (...args) => {
    // ...
  });

  // emit the "mouse" event to all connected clients with the current mouse position
  socket.on('mouse', function(data) {
    console.log('mouse:', data);
    socket.broadcast.emit('mouse', data);
  });
});


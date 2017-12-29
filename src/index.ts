// Setup basic express server
import * as express from 'express';
import { createServer } from 'http';
import { Base64 } from 'js-base64';
import { getApi, getApiFromAppState } from 'services/fb';
const app = express();
const path = require('path');
const server = createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

const numUsers = 0;

io.on('connection', function(socket) {
  let fbApi = null;
  const addedUser = false;

  console.log('User connected');

  socket.on('login', async ({ email, password }) => {
    try {
      const api = await getApi(email, password);
      fbApi = api;
      socket.emit('sessionCreated', Base64.encode(JSON.stringify(api.getAppState())));
    } catch (err) {
      console.log(err);
    }
  });

  socket.on('restoreSession', async ({ session }) => {
    console.log('restore');
    try {
      const api = await getApiFromAppState(JSON.parse(Base64.decode(session)));
      fbApi = api;
      socket.emit('sessionCreated', Base64.encode(JSON.stringify(api.getAppState())));
    } catch (err) {
      console.log(err);
    }
  });

  socket.on('sendMessage', async ({ message, threadId }) => {
    fbApi.sendMessage(message, threadId, () => {
      socket.emit('sent');
    });
  });
});

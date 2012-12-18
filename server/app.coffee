io = require('socket.io').listen(8000)

@mySocket = null

io.sockets.on 'connection', (socket) =>

  @mySocket = socket

  @mySocket.on 'notePlayed', (guid, event) =>

    @mySocket.emit 'playNote', guid, event

# var io = require('socket.io').listen(80);

# var playerNum = 1;

# io.sockets.on('connection', function (socket) {
#   socket.emit('connected', playerNum++);
# });

# io.sockets.on('notePlayed', function (socket, event) {
#   socket.emit('sendNote', event);
# });
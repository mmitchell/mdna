io = require('socket.io').listen(8000)

io.sockets.on 'connection', (socket) ->

  socket.on 'notePlayed', (guid, event) ->

    socket.emit 'playNote', guid, event

# var io = require('socket.io').listen(80);

# var playerNum = 1;

# io.sockets.on('connection', function (socket) {
#   socket.emit('connected', playerNum++);
# });

# io.sockets.on('notePlayed', function (socket, event) {
#   socket.emit('sendNote', event);
# });
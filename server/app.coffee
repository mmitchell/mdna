io = require('socket.io').listen(8000)

players = {}

io.sockets.on 'joinSession', (guid) ->

  players[guid] = true

io.sockets.on 'notePlayed', (guid, event) ->

  io.sockets.emit 'playNote',
    guid: guid,
    event: event

# var io = require('socket.io').listen(80);

# var playerNum = 1;

# io.sockets.on('connection', function (socket) {
#   socket.emit('connected', playerNum++);
# });

# io.sockets.on('notePlayed', function (socket, event) {
#   socket.emit('sendNote', event);
# });
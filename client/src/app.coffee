MasterKey = require './master_key'
MidiManager = require './midi_manager'

keys_down = new Array(88).join('0').split('').map(parseFloat)

module.exports = class App

  boot: ->

    @masterKey = new MasterKey x: 50, y: 50
    @masterKey.init()
    @masterKey.draw()

    @masterKey2 = new MasterKey x: 500, y: 50
    @masterKey2.init()
    @masterKey2.draw()

    setTimeout =>
      navigator.requestMIDIAccess @success, @error
    , 200


    @connect()

  success: (access) =>

    @midiManager = new MidiManager access

    @midiManager.onMessage (event) =>

      @socket.emit 'notePlayed', @guid, event

      if keys_down[event.note.num] isnt event.velocity

        keys_down[event.note.num] = event.velocity

        @masterKey.update event

  error: ->

    alert "We could not load a MIDI device. Please reload and we'll try again."

  connect: ->

    @guid = Math.floor(Math.random()*100)

    @socket = io.connect('http://localhost:8000')

    @socket.emit 'joinSession', @guid

    @socket.on 'playNote', (guid, event) ->

      return if guid is @guid

      @midiManager.output.play event
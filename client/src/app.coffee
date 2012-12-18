MasterKey = require './master_key'
MidiManager = require './midi_manager'
MidiEvent = require './midi_event'

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

    @socket.on 'playNote', (guid, _event) =>

      return if guid is @guid

      event = MidiEvent.initFromObject _event

      @midiManager.output.send event.rawData()

      @masterKey2.update event
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

  success: (access) =>

    @midiManager = new MidiManager access

    @midiManager.onMessage (event) =>

      if keys_down[event.note.num] isnt event.velocity

        keys_down[event.note.num] = event.velocity

        @masterKey.update event
        @masterKey2.update event

  error: ->

    alert "We could not load a MIDI device. Please reload and we'll try again."

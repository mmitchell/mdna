MasterKey = require './master_key'
MidiManager = require './midi_manager'

keys_down = new Array(88).join('0').split('').map(parseFloat)

module.exports = class App

  boot: ->

    @masterKey = new MasterKey

    @masterKey.init()

    @masterKey.draw()

    setTimeout =>
      navigator.requestMIDIAccess @success, @error
    , 200

  success: (access) =>

    @midiAccess = new MidiManager access

    @midiAccess.onMessage (event) =>

      if keys_down[event.note.num] isnt event.velocity

        keys_down[event.note.num] = event.velocity

        @masterKey.update event

  error: ->

    alert "We could not load a MIDI device. Please reload and we'll try again."

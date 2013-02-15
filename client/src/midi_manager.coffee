MidiEvent = require './midi_event'

module.exports = class MidiManager

  constructor: (@access) ->

    outputs = @access.getOutputs()
    @output = @access.getOutput outputs[0] if outputs.length

    inputs = @access.getInputs()
    @input = @access.getInput inputs[0] if inputs.length

  onMessage: (cb) ->

    @input.onmessage = (_event) =>

      @output.send _event.data

      cb (new MidiEvent _event)
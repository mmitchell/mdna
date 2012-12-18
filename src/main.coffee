MidiEvent = require './midi_event'
MasterKey = require './master_key'

#Globals (I know...)
m = null
i = null
masterKey = null

keys_down = new Array(88).join('0').split('').map(parseFloat)

success = (access) ->
  m = access
  outputs = m.enumerateOutputs()
  output = m.getOutput(outputs[0])  if outputs.length
  inputs = m.enumerateInputs()
  i = m.getInput(inputs[0])
  i.onmessage = (_event) ->
    output.send _event.data
    event = new MidiEvent(_event)
    
    # Check for double key downs
    if keys_down[event.note.num] isnt event.velocity
      keys_down[event.note.num] = event.velocity
      update_master_key event

error = (access) ->
  console.log "MIDIAccess error."

update_master_key = (event) ->

  if event.isNoteUp()
    masterKey.nodes[event.note.position()].off()
  else
    masterKey.nodes[event.note.position()].on()

  masterKey.draw()

module.exports = class App

  boot: ->

    masterKey = new MasterKey

    masterKey.init()

    masterKey.draw()

    setTimeout ->
      navigator.requestMIDIAccess(success, error)
    , 200

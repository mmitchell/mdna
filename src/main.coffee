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
  unless is_same_note_down_elsewhere(event.note)
    if event.isNoteUp()
      masterKey.nodes[event.note.position()].off()
    else
      masterKey.nodes[event.note.position()].on()

  interval_index = 0

  for i in [0...12]
    for j in [0...i]
      masterKey.intervals[interval_index].attr
        opacity: 0.15
        stroke: "#ffffff"

      if masterKey.nodes[i].down and masterKey.nodes[j].down
        masterKey.intervals[interval_index].attr
          opacity: 1.0
          stroke: interval_color(i, j)

      interval_index++

is_same_note_down_elsewhere = (note) ->
  # world's worst list comprehension
  # (i for i in [note.position()...88] when i % 12 is note.position() and keys_down[i] > 0 and i isnt note.num).length > 0

  i = note.position()

  while i < 88
    return true  if keys_down[i] > 0 and i isnt note.num
    i = i + 12
  false

interval_color = (note_1, note_2) ->
  dist = Math.abs(note_1 - note_2)
  dist = 12 - dist  if dist > 6
  colors = ["#bf001c", "#bf5600", "#bfac00", "#00bf85", "#00a2bf", "#5f00bf"]
  colors[dist - 1]

module.exports = class App

  boot: ->

    masterKey = new MasterKey

    masterKey.draw()

    setTimeout ->
      navigator.requestMIDIAccess(success, error)
    , 200

  
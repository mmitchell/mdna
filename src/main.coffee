MidiEvent = require './midi_event'

#Globals (I know...)
m = null
i = null
WIDTH = 600
HEIGHT = 400
RADIUS = 150
NODE_COLOR = "#1090B3"
keys_down = new Array(88).join('0').split('').map(parseFloat)
intervals = new Array(66).join('0').split('').map(parseFloat)
master_key = [0,0,0,0,0,0,0,0,0,0,0,0]

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
      master_key[event.note.position()].data("note", "up").attr("opacity", 0.35).g.remove()
    else
      master_key[event.note.position()].g = master_key[event.note.position()]
                                                  .data("note", "down")
                                                  .attr("opacity", 1.0)
                                                  .glow(color: "#FFF")

  interval_index = 0

  for i in [0...12]
    for j in [0...i]
      intervals[interval_index].attr
        opacity: 0.15
        stroke: "#ffffff"

      if master_key[i].data("note") is "down" and master_key[j].data("note") is "down"
        intervals[interval_index].attr
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

node_position = (node_idx) ->
  x = RADIUS * Math.sin(2 * Math.PI * (node_idx / 12)) + WIDTH / 2
  y = -RADIUS * Math.cos(2 * Math.PI * (node_idx / 12)) + HEIGHT / 2
  
  { x: x, y: y }

gameSetup = ->

  mdna = Raphael 50, 50, WIDTH, HEIGHT

  interval_index = 0

  for i in [0...12]
    for j in [0...i]
      intervals[interval_index] = mdna.path("M" + node_position(i).x + "," + node_position(i).y + 
                                              "L" + node_position(j).x + "," + node_position(j).y)
      intervals[interval_index].attr
        fill: NODE_COLOR
        stroke: "#ffffff"
        "stroke-width": 3
        opacity: 0.15

      interval_index++

      master_key.forEach (ele, idx, arr) ->
        arr[idx] = mdna.circle node_position(idx).x, node_position(idx).y, 20

        arr[idx].data("note", "up")
                .attr
                  fill: NODE_COLOR
                  stroke: "#ffffff"
                  "stroke-width": 6
                  opacity: 0.35

module.exports = class App

  boot: ->

    setTimeout ->
      navigator.requestMIDIAccess(success, error)
    , 200
  
    setTimeout ->
      gameSetup()
    , 300

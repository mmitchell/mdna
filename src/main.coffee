class MidiEvent

  constructor: (event) ->
    @type = event.data[0]
    @note = event.data[1]
    @velocity = event.data[2]

  # Not all midi-keyboards adhere to the spec;
  # some use the proper keyup command while others
  # use a keydown with zero velocity to mean keyup.
  isNoteUp: ->

    @velocity is 0 or (128 <= @type <= 143)

class Note

  constructor: (@num)

  position: -> @num % 12

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

setTimeout ->
  navigator.requestMIDIAccess(success, error)
, 200

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
      master_key[event.note.position()].g = master_key[event.note.position()].data("note", "down").attr("opacity", 1.0).glow(color: "#FFF")
  interval_index = 0
  i = 0

  while i < 12
    j = 0

    while j < i
      intervals[interval_index].attr
        opacity: 0.15
        stroke: "#ffffff"

      if master_key[i].data("note") is "down" and master_key[j].data("note") is "down"
        intervals[interval_index].attr
          opacity: 1.0
          stroke: interval_color(i, j)

      interval_index++
      j++
    i++
is_same_note_down_elsewhere = (note) ->
  i = note.position()

  while i < 88
    return true  if keys_down[i] > 0 and i isnt note.num
    i = i + 12
  false
interval_index_mapper = (note_1, note_2) ->
  return note_1 * 12 + note_2  if note_1 > note_2
  note_2 * 12 + note_1
interval_color = (note_1, note_2) ->
  dist = Math.abs(note_1 - note_2)
  dist = 12 - dist  if dist > 6
  colors = ["#bf001c", "#bf5600", "#bfac00", "#00bf85", "#00a2bf", "#5f00bf"]
  colors[dist - 1]
node_position = (node_idx) ->
  x = RADIUS * Math.sin(2 * Math.PI * (node_idx / 12)) + WIDTH / 2
  y = -RADIUS * Math.cos(2 * Math.PI * (node_idx / 12)) + HEIGHT / 2
  x: x
  y: y
m = null
i = null
MidiEvent = (->
  MidiEvent = (event) ->
    @type = event.data[0]
    @note = new Note(event.data[1])
    @velocity = event.data[2]
  MidiEvent::masterKeyPosition = ->
    @note % 12

  MidiEvent::isNoteUp = ->
    @velocity is 0 or (@type >= 128 and @type <= 143)

  MidiEvent
)()
Note = (->
  Note = (num) ->
    @num = num
  Note::position = ->
    @num % 12

  Note::name = ->
    _name = undefined
    switch @position()
      when 0
        _name = "C"
      when 1
        _name = "C#"
      when 2
        _name = "D"
      when 3
        _name = "Eb"
      when 4
        _name = "E"
      when 5
        _name = "F"
      when 6
        _name = "F#"
      when 7
        _name = "G"
      when 8
        _name = "Ab"
      when 9
        _name = "A"
      when 10
        _name = "Bb"
      when 11
        _name = "B"
    _name

  Note
)()
setTimeout (->
  navigator.requestMIDIAccess success, error
), 200
WIDTH = 600
HEIGHT = 400
RADIUS = 150
NODE_COLOR = "#1090B3"
keys_down = new Array(88).join("0").split("").map(parseFloat)
intervals = new Array(66).join("0").split("").map(parseFloat)
master_key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
setTimeout (game_setup = ->
  mdna = Raphael(50, 50, WIDTH, HEIGHT)
  
  # Create the array of interval lines
  interval_index = 0
  i = 0

  while i < 12
    j = 0

    while j < i
      intervals[interval_index] = mdna.path("M" + node_position(i).x + "," + node_position(i).y + "L" + node_position(j).x + "," + node_position(j).y)
      intervals[interval_index].attr
        fill: NODE_COLOR
        stroke: "#ffffff"
        "stroke-width": 3
        opacity: 0.15

      interval_index++
      j++
    i++
  
  # Create the array of 12 note nodes
  master_key.forEach (ele, idx, arr) ->
    arr[idx] = mdna.circle(node_position(idx).x, node_position(idx).y, 20)
    arr[idx].data("note", "up").attr
      fill: NODE_COLOR
      stroke: "#ffffff"
      "stroke-width": 6
      opacity: 0.35


), 300
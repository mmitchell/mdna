Note = require './note'

module.exports = class MidiEvent

  @initFromObject: (obj) ->

    new MidiEvent
      data: [obj.type, obj.note.num, obj.velocity]

  constructor: (event) ->

    @type = event.data[0]
    @note = new Note event.data[1]
    @velocity = event.data[2]

  # Not all midi-keyboards adhere to the spec;
  # some use the proper keyup command while others
  # use a keydown with zero velocity to mean keyup.
  isNoteUp: ->

    @velocity is 0 or (128 <= @type <= 143)

  rawData: ->

    [@type, @note.num, @velocity]
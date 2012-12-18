module.exports = class Note

  constructor: (@num) ->

  position: -> @num % 12
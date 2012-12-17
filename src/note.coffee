module.exports = class Note

  constructor: (num) ->
    @num = num

  position: -> @num % 12
module.exports = class Interval

  constructor: (@n1, @n2) ->

  init: (g) ->

    @line = g.path ("M" + @n1.x + "," + @n1.y + "L" + @n2.x + "," + @n2.y)

  draw: (g) ->

    if @n1.down and @n2.down
      @line.attr
        opacity: 1.0
        stroke: @color()
        'stroke-width': 3
    else
      @line.attr
        opacity: 0.15
        stroke: "#ffffff"
        'stroke-width': 3

  color: ->
    dist = Math.abs(@n1.position - @n2.position)
    dist = 12 - dist if dist > 6
    colors = ["#bf001c", "#bf5600", "#bfac00", "#00bf85", "#00a2bf", "#5f00bf"]
    colors[dist - 1]
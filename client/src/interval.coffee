module.exports = class Interval

  COLORS: [
    "#BF001C", # red
    "#BF5600", # orange
    "#BFAC00", # yellow
    "#00BF85", # green
    "#00A2BF", # blue
    "#5F00BF"  # purple
  ]

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
    @COLORS[dist - 1]
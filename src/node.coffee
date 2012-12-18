module.exports = class Node

  COLOR: "#1090B3"

  constructor: ({@x, @y}) ->

  draw: (g) ->

    @circle = g.circle @x, @y, 20

    @down = false

    @circle.attr
      fill: @COLOR
      stroke: "#ffffff"
      "stroke-width": 6
      opacity: 0.35

  off: ->

    return unless @down

    @down = false

    @circle.attr('opacity', 0.35)

    @g.remove()

  on: ->

    return if @down

    @down = true

    @circle.attr('opacity', 1.0)

    @g = @circle.glow(color: "#FFF")
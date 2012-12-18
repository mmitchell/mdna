module.exports = class Node

  constructor: ({@x, @y, @position}) ->

    @down = 0

  init: (g) ->

    @circle = g.circle(@x, @y, 20)
               .attr
                 fill: "#1090B3"
                 stroke: "#ffffff"
                 "stroke-width": 6
                 opacity: 0.35

  draw: ->

    if @down > 0
      @circle.attr('opacity', 1.0)
      @g ?= @circle.glow color: "#FFF"

    else
      @circle.attr('opacity', 0.35)
      @g?.remove()

  off: -> @down -= 1

  on: -> @down += 1
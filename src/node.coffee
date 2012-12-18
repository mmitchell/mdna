module.exports = class Node

  constructor: ({@x, @y, @position}) ->

    @down = false

  init: (g) ->

    @circle = g.circle(@x, @y, 20)
               .attr
                 fill: "#1090B3"
                 stroke: "#ffffff"
                 "stroke-width": 6
                 opacity: 0.35

  draw: ->

    if @down
      @circle.attr('opacity', 1.0)
      @g ?= @circle.glow color: "#FFF"

    else
      @circle.attr('opacity', 0.35)
      @g?.remove()

  off: -> @down = false

  on: -> @down = true
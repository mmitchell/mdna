Node = require './node'

module.exports = class MasterKey

  RADIUS: 150
  WIDTH: 600
  HEIGHT: 400
  NODE_COLOR: "#1090B3"

  constructor: (opts) ->

    @g = Raphael 50, 50, @WIDTH, @HEIGHT

    @intervals = new Array(66).join('0').split('').map(parseFloat)

    @nodes = [0...12].map (i) =>
      new Node
        x: @RADIUS * Math.sin(2 * Math.PI * (i / 12)) + @WIDTH / 2
        y: -@RADIUS * Math.cos(2 * Math.PI * (i / 12)) + @HEIGHT / 2

  draw: ->

    @drawLines()
    @drawCircles()

  drawLines: ->
    interval_index = 0

    for i in [0...12]
      for j in [0...i]
        [a, b] = [@nodes[i], @nodes[j]]

        @intervals[interval_index] = @g.path("M" + a.x + "," + a.y + 
                                             "L" + b.x + "," + b.y)

        @intervals[interval_index].attr
          stroke: "#ffffff"
          "stroke-width": 3
          opacity: 0.15

        interval_index++

  drawCircles: ->

    node.draw @g for node in @nodes

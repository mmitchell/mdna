Node = require './node'
Interval = require './interval'

module.exports = class MasterKey

  RADIUS: 150
  WIDTH: 600
  HEIGHT: 400
  NODE_COLOR: "#1090B3"

  constructor: (opts) ->

    @nodes = [0...12].map (i) =>
      new Node
        x: @RADIUS * Math.sin(2 * Math.PI * (i / 12)) + @WIDTH / 2
        y: -@RADIUS * Math.cos(2 * Math.PI * (i / 12)) + @HEIGHT / 2
        position: i

    @intervals = @makeIntervals()

  init: ->

    g = Raphael 50, 50, @WIDTH, @HEIGHT

    interval.init g for interval in @intervals
    node.init g for node in @nodes

  draw: ->

    interval.draw() for interval in @intervals
    node.draw() for node in @nodes

  makeIntervals: ->

    throw "Nodes must be constructed first!" unless @nodes?

    ints = []

    for i in [0...12]
      for j in [0...i]
        ints.push new Interval @nodes[i], @nodes[j]

    ints

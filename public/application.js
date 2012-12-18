

(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), indexPath = expand(path, './index'), module, fn;
      module   = cache[path] || cache[indexPath]      
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = indexPath]) {
        module = {id: path, exports: {}};
        cache[path] = module.exports;
        fn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        return cache[path] = module.exports;
      } else {
        throw 'module ' + name + ' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
    this.require.modules = modules;
    this.require.cache   = cache;
  }
  return this.require.define;
}).call(this)({
  "main": function(exports, require, module) {(function() {
  var App, MasterKey, MidiEvent, error, i, interval_color, is_same_note_down_elsewhere, keys_down, m, masterKey, success, update_master_key;

  MidiEvent = require('./midi_event');

  MasterKey = require('./master_key');

  m = null;

  i = null;

  masterKey = null;

  keys_down = new Array(88).join('0').split('').map(parseFloat);

  success = function(access) {
    var inputs, output, outputs;
    m = access;
    outputs = m.enumerateOutputs();
    if (outputs.length) {
      output = m.getOutput(outputs[0]);
    }
    inputs = m.enumerateInputs();
    i = m.getInput(inputs[0]);
    return i.onmessage = function(_event) {
      var event;
      output.send(_event.data);
      event = new MidiEvent(_event);
      if (keys_down[event.note.num] !== event.velocity) {
        keys_down[event.note.num] = event.velocity;
        return update_master_key(event);
      }
    };
  };

  error = function(access) {
    return console.log("MIDIAccess error.");
  };

  update_master_key = function(event) {
    var interval_index, j, _i, _results;
    if (!is_same_note_down_elsewhere(event.note)) {
      if (event.isNoteUp()) {
        masterKey.nodes[event.note.position()].off();
      } else {
        masterKey.nodes[event.note.position()].on();
      }
    }
    interval_index = 0;
    _results = [];
    for (i = _i = 0; _i < 12; i = ++_i) {
      _results.push((function() {
        var _j, _results1;
        _results1 = [];
        for (j = _j = 0; 0 <= i ? _j < i : _j > i; j = 0 <= i ? ++_j : --_j) {
          masterKey.intervals[interval_index].attr({
            opacity: 0.15,
            stroke: "#ffffff"
          });
          if (masterKey.nodes[i].down && masterKey.nodes[j].down) {
            masterKey.intervals[interval_index].attr({
              opacity: 1.0,
              stroke: interval_color(i, j)
            });
          }
          _results1.push(interval_index++);
        }
        return _results1;
      })());
    }
    return _results;
  };

  is_same_note_down_elsewhere = function(note) {
    i = note.position();
    while (i < 88) {
      if (keys_down[i] > 0 && i !== note.num) {
        return true;
      }
      i = i + 12;
    }
    return false;
  };

  interval_color = function(note_1, note_2) {
    var colors, dist;
    dist = Math.abs(note_1 - note_2);
    if (dist > 6) {
      dist = 12 - dist;
    }
    colors = ["#bf001c", "#bf5600", "#bfac00", "#00bf85", "#00a2bf", "#5f00bf"];
    return colors[dist - 1];
  };

  module.exports = App = (function() {

    function App() {}

    App.prototype.boot = function() {
      masterKey = new MasterKey;
      masterKey.draw();
      return setTimeout(function() {
        return navigator.requestMIDIAccess(success, error);
      }, 200);
    };

    return App;

  })();

}).call(this);
}, "master_key": function(exports, require, module) {(function() {
  var MasterKey, Node;

  Node = require('./node');

  module.exports = MasterKey = (function() {

    MasterKey.prototype.RADIUS = 150;

    MasterKey.prototype.WIDTH = 600;

    MasterKey.prototype.HEIGHT = 400;

    MasterKey.prototype.NODE_COLOR = "#1090B3";

    function MasterKey(opts) {
      var _this = this;
      this.g = Raphael(50, 50, this.WIDTH, this.HEIGHT);
      this.intervals = new Array(66).join('0').split('').map(parseFloat);
      this.nodes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function(i) {
        return new Node({
          x: _this.RADIUS * Math.sin(2 * Math.PI * (i / 12)) + _this.WIDTH / 2,
          y: -_this.RADIUS * Math.cos(2 * Math.PI * (i / 12)) + _this.HEIGHT / 2
        });
      });
    }

    MasterKey.prototype.draw = function() {
      this.drawLines();
      return this.drawCircles();
    };

    MasterKey.prototype.drawLines = function() {
      var i, interval_index, j, _i, _results;
      interval_index = 0;
      _results = [];
      for (i = _i = 0; _i < 12; i = ++_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (j = _j = 0; 0 <= i ? _j < i : _j > i; j = 0 <= i ? ++_j : --_j) {
            this.intervals[interval_index] = this.g.path("M" + this.node_position(i).x + "," + this.node_position(i).y + "L" + this.node_position(j).x + "," + this.node_position(j).y);
            this.intervals[interval_index].attr({
              fill: this.NODE_COLOR,
              stroke: "#ffffff",
              "stroke-width": 3,
              opacity: 0.15
            });
            _results1.push(interval_index++);
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    MasterKey.prototype.drawCircles = function() {
      var node, _i, _len, _ref, _results;
      _ref = this.nodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(node.draw(this.g));
      }
      return _results;
    };

    MasterKey.prototype.node_position = function(node_idx) {
      var x, y;
      x = this.RADIUS * Math.sin(2 * Math.PI * (node_idx / 12)) + this.WIDTH / 2;
      y = -this.RADIUS * Math.cos(2 * Math.PI * (node_idx / 12)) + this.HEIGHT / 2;
      return {
        x: x,
        y: y
      };
    };

    return MasterKey;

  })();

}).call(this);
}, "midi_event": function(exports, require, module) {(function() {
  var MidiEvent, Note;

  Note = require('./note');

  module.exports = MidiEvent = (function() {

    function MidiEvent(event) {
      this.type = event.data[0];
      this.note = new Note(event.data[1]);
      this.velocity = event.data[2];
    }

    MidiEvent.prototype.isNoteUp = function() {
      var _ref;
      return this.velocity === 0 || ((128 <= (_ref = this.type) && _ref <= 143));
    };

    return MidiEvent;

  })();

}).call(this);
}, "node": function(exports, require, module) {(function() {
  var Node;

  module.exports = Node = (function() {

    Node.prototype.COLOR = "#1090B3";

    function Node(_arg) {
      this.x = _arg.x, this.y = _arg.y;
    }

    Node.prototype.draw = function(g) {
      this.circle = g.circle(this.x, this.y, 20);
      this.down = false;
      return this.circle.attr({
        fill: this.COLOR,
        stroke: "#ffffff",
        "stroke-width": 6,
        opacity: 0.35
      });
    };

    Node.prototype.off = function() {
      this.down = false;
      this.circle.attr('opacity', 0.35);
      return this.g.remove();
    };

    Node.prototype.on = function() {
      this.down = true;
      this.circle.attr('opacity', 1.0);
      return this.g = this.circle.glow({
        color: "#FFF"
      });
    };

    return Node;

  })();

}).call(this);
}, "note": function(exports, require, module) {(function() {
  var Note;

  module.exports = Note = (function() {

    function Note(num) {
      this.num = num;
    }

    Note.prototype.position = function() {
      return this.num % 12;
    };

    return Note;

  })();

}).call(this);
}
});
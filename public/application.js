

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
  "app": function(exports, require, module) {(function() {
  var App, MasterKey, MidiManager, keys_down,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  MasterKey = require('./master_key');

  MidiManager = require('./midi_manager');

  keys_down = new Array(88).join('0').split('').map(parseFloat);

  module.exports = App = (function() {

    function App() {
      this.success = __bind(this.success, this);

    }

    App.prototype.boot = function() {
      var _this = this;
      this.masterKey = new MasterKey;
      this.masterKey.init();
      this.masterKey.draw();
      return setTimeout(function() {
        return navigator.requestMIDIAccess(_this.success, _this.error);
      }, 200);
    };

    App.prototype.success = function(access) {
      var _this = this;
      this.midiAccess = new MidiManager(access);
      return this.midiAccess.onMessage(function(event) {
        if (keys_down[event.note.num] !== event.velocity) {
          keys_down[event.note.num] = event.velocity;
          return _this.masterKey.update(event);
        }
      });
    };

    App.prototype.error = function() {
      return alert("We could not load a MIDI device. Please reload and we'll try again.");
    };

    return App;

  })();

}).call(this);
}, "interval": function(exports, require, module) {(function() {
  var Interval;

  module.exports = Interval = (function() {

    Interval.prototype.COLORS = ["#BF001C", "#BF5600", "#BFAC00", "#00BF85", "#00A2BF", "#5F00BF"];

    function Interval(n1, n2) {
      this.n1 = n1;
      this.n2 = n2;
    }

    Interval.prototype.init = function(g) {
      return this.line = g.path("M" + this.n1.x + "," + this.n1.y + "L" + this.n2.x + "," + this.n2.y);
    };

    Interval.prototype.draw = function(g) {
      if (this.n1.down && this.n2.down) {
        return this.line.attr({
          opacity: 1.0,
          stroke: this.color(),
          'stroke-width': 3
        });
      } else {
        return this.line.attr({
          opacity: 0.15,
          stroke: "#ffffff",
          'stroke-width': 3
        });
      }
    };

    Interval.prototype.color = function() {
      var dist;
      dist = Math.abs(this.n1.position - this.n2.position);
      if (dist > 6) {
        dist = 12 - dist;
      }
      return this.COLORS[dist - 1];
    };

    return Interval;

  })();

}).call(this);
}, "master_key": function(exports, require, module) {(function() {
  var Interval, MasterKey, Node;

  Node = require('./node');

  Interval = require('./interval');

  module.exports = MasterKey = (function() {

    MasterKey.prototype.RADIUS = 150;

    MasterKey.prototype.WIDTH = 600;

    MasterKey.prototype.HEIGHT = 400;

    MasterKey.prototype.NODE_COLOR = "#1090B3";

    function MasterKey(opts) {
      var _this = this;
      this.nodes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function(i) {
        return new Node({
          x: _this.RADIUS * Math.sin(2 * Math.PI * (i / 12)) + _this.WIDTH / 2,
          y: -_this.RADIUS * Math.cos(2 * Math.PI * (i / 12)) + _this.HEIGHT / 2,
          position: i
        });
      });
      this.intervals = this.makeIntervals();
    }

    MasterKey.prototype.init = function() {
      var g, interval, node, _i, _j, _len, _len1, _ref, _ref1, _results;
      g = Raphael(50, 50, this.WIDTH, this.HEIGHT);
      _ref = this.intervals;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        interval = _ref[_i];
        interval.init(g);
      }
      _ref1 = this.nodes;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        node = _ref1[_j];
        _results.push(node.init(g));
      }
      return _results;
    };

    MasterKey.prototype.draw = function() {
      var interval, node, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = this.intervals;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        interval = _ref[_i];
        interval.draw();
      }
      _ref1 = this.nodes;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        node = _ref1[_j];
        _results.push(node.draw());
      }
      return _results;
    };

    MasterKey.prototype.update = function(event) {
      if (event.isNoteUp()) {
        this.nodes[event.note.position()].off();
      } else {
        this.nodes[event.note.position()].on();
      }
      return this.draw();
    };

    MasterKey.prototype.makeIntervals = function() {
      var i, ints, j, _i, _j;
      if (this.nodes == null) {
        throw "Nodes must be constructed first!";
      }
      ints = [];
      for (i = _i = 0; _i < 12; i = ++_i) {
        for (j = _j = 0; 0 <= i ? _j < i : _j > i; j = 0 <= i ? ++_j : --_j) {
          ints.push(new Interval(this.nodes[i], this.nodes[j]));
        }
      }
      return ints;
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
}, "midi_manager": function(exports, require, module) {(function() {
  var MidiEvent, MidiManager;

  MidiEvent = require('./midi_event');

  module.exports = MidiManager = (function() {

    function MidiManager(access) {
      var inputs, outputs;
      this.access = access;
      outputs = this.access.enumerateOutputs();
      if (outputs.length) {
        this.output = this.access.getOutput(outputs[0]);
      }
      inputs = this.access.enumerateInputs();
      if (inputs.length) {
        this.input = this.access.getInput(inputs[0]);
      }
    }

    MidiManager.prototype.onMessage = function(cb) {
      var _this = this;
      return this.input.onmessage = function(_event) {
        _this.output.send(_event.data);
        return cb(new MidiEvent(_event));
      };
    };

    return MidiManager;

  })();

}).call(this);
}, "node": function(exports, require, module) {(function() {
  var Node;

  module.exports = Node = (function() {

    function Node(_arg) {
      this.x = _arg.x, this.y = _arg.y, this.position = _arg.position;
      this.down = 0;
    }

    Node.prototype.init = function(g) {
      return this.circle = g.circle(this.x, this.y, 20).attr({
        fill: "#1090B3",
        stroke: "#ffffff",
        "stroke-width": 6,
        opacity: 0.35
      });
    };

    Node.prototype.draw = function() {
      var _ref, _ref1;
      if (this.down > 0) {
        this.circle.attr('opacity', 1.0);
        return (_ref = this.g) != null ? _ref : this.g = this.circle.glow({
          color: "#FFF"
        });
      } else {
        this.circle.attr('opacity', 0.35);
        return (_ref1 = this.g) != null ? _ref1.remove() : void 0;
      }
    };

    Node.prototype.off = function() {
      return this.down -= 1;
    };

    Node.prototype.on = function() {
      return this.down += 1;
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
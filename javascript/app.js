(function() {
  var HEIGHT, MidiEvent, NODE_COLOR, Note, RADIUS, WIDTH, error, game_setup, i, interval_color, interval_index_mapper, intervals, is_same_note_down_elsewhere, keys_down, m, master_key, node_position, success, update_master_key, _class;

  MidiEvent = (function() {

    function MidiEvent(event) {
      this.type = event.data[0];
      this.note = event.data[1];
      this.velocity = event.data[2];
    }

    MidiEvent.prototype.isNoteUp = function() {
      var _ref;
      return this.velocity === 0 || ((128 <= (_ref = this.type) && _ref <= 143));
    };

    return MidiEvent;

  })();

  Note = (function() {

    function Note() {
      return _class.apply(this, arguments);
    }

    _class = Note.num;

    Note.prototype.position = function() {
      return this.num % 12;
    };

    return Note;

  })();

  m = null;

  i = null;

  WIDTH = 600;

  HEIGHT = 400;

  RADIUS = 150;

  NODE_COLOR = "#1090B3";

  keys_down = new Array(88).join('0').split('').map(parseFloat);

  intervals = new Array(66).join('0').split('').map(parseFloat);

  master_key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  setTimeout(function() {
    return navigator.requestMIDIAccess(success, error);
  }, 200);

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
    var interval_index, j, _results;
    if (!is_same_note_down_elsewhere(event.note)) {
      if (event.isNoteUp()) {
        master_key[event.note.position()].data("note", "up").attr("opacity", 0.35).g.remove();
      } else {
        master_key[event.note.position()].g = master_key[event.note.position()].data("note", "down").attr("opacity", 1.0).glow({
          color: "#FFF"
        });
      }
    }
    interval_index = 0;
    i = 0;
    _results = [];
    while (i < 12) {
      j = 0;
      while (j < i) {
        intervals[interval_index].attr({
          opacity: 0.15,
          stroke: "#ffffff"
        });
        if (master_key[i].data("note") === "down" && master_key[j].data("note") === "down") {
          intervals[interval_index].attr({
            opacity: 1.0,
            stroke: interval_color(i, j)
          });
        }
        interval_index++;
        j++;
      }
      _results.push(i++);
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

  interval_index_mapper = function(note_1, note_2) {
    if (note_1 > note_2) {
      return note_1 * 12 + note_2;
    }
    return note_2 * 12 + note_1;
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

  node_position = function(node_idx) {
    var x, y;
    x = RADIUS * Math.sin(2 * Math.PI * (node_idx / 12)) + WIDTH / 2;
    y = -RADIUS * Math.cos(2 * Math.PI * (node_idx / 12)) + HEIGHT / 2;
    return {
      x: x,
      y: y
    };
  };

  m = null;

  i = null;

  MidiEvent = (function() {
    MidiEvent = function(event) {
      this.type = event.data[0];
      this.note = new Note(event.data[1]);
      return this.velocity = event.data[2];
    };
    MidiEvent.prototype.masterKeyPosition = function() {
      return this.note % 12;
    };
    MidiEvent.prototype.isNoteUp = function() {
      return this.velocity === 0 || (this.type >= 128 && this.type <= 143);
    };
    return MidiEvent;
  })();

  Note = (function() {
    Note = function(num) {
      return this.num = num;
    };
    Note.prototype.position = function() {
      return this.num % 12;
    };
    Note.prototype.name = function() {
      var _name;
      _name = void 0;
      switch (this.position()) {
        case 0:
          _name = "C";
          break;
        case 1:
          _name = "C#";
          break;
        case 2:
          _name = "D";
          break;
        case 3:
          _name = "Eb";
          break;
        case 4:
          _name = "E";
          break;
        case 5:
          _name = "F";
          break;
        case 6:
          _name = "F#";
          break;
        case 7:
          _name = "G";
          break;
        case 8:
          _name = "Ab";
          break;
        case 9:
          _name = "A";
          break;
        case 10:
          _name = "Bb";
          break;
        case 11:
          _name = "B";
      }
      return _name;
    };
    return Note;
  })();

  setTimeout((function() {
    return navigator.requestMIDIAccess(success, error);
  }), 200);

  WIDTH = 600;

  HEIGHT = 400;

  RADIUS = 150;

  NODE_COLOR = "#1090B3";

  keys_down = new Array(88).join("0").split("").map(parseFloat);

  intervals = new Array(66).join("0").split("").map(parseFloat);

  master_key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  setTimeout((game_setup = function() {
    var interval_index, j, mdna;
    mdna = Raphael(50, 50, WIDTH, HEIGHT);
    interval_index = 0;
    i = 0;
    while (i < 12) {
      j = 0;
      while (j < i) {
        intervals[interval_index] = mdna.path("M" + node_position(i).x + "," + node_position(i).y + "L" + node_position(j).x + "," + node_position(j).y);
        intervals[interval_index].attr({
          fill: NODE_COLOR,
          stroke: "#ffffff",
          "stroke-width": 3,
          opacity: 0.15
        });
        interval_index++;
        j++;
      }
      i++;
    }
    return master_key.forEach(function(ele, idx, arr) {
      arr[idx] = mdna.circle(node_position(idx).x, node_position(idx).y, 20);
      return arr[idx].data("note", "up").attr({
        fill: NODE_COLOR,
        stroke: "#ffffff",
        "stroke-width": 6,
        opacity: 0.35
      });
    });
  }), 300);

}).call(this);

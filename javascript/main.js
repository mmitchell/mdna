var m = null;   // m = MIDIAccess object for you to make calls on
var i = null;   // i = MIDIInput

MidiEvent = (function (){
  function MidiEvent(event){
    this.type = event.data[0];
    this.note = event.data[1];
    this.velocity = event.data[2];
  }

  MidiEvent.prototype.masterKeyPosition = function(){
    this.note % 12;
  };

  return MidiEvent;
})();

setTimeout(function(){ navigator.requestMIDIAccess(success, error) }, 200);

//Globals (I know...)
var WIDTH = 600;
var HEIGHT = 400;
var RADIUS = 150;
var NODE_COLOR = "#1090B3";
var keys_down = new Array(88).join('0').split('').map(parseFloat)
var intervals = new Array(66).join('0').split('').map(parseFloat)
var master_key = [0,0,0,0,0,0,0,0,0,0,0,0];

function success(access) {
  m = access;

  var outputs = m.enumerateOutputs();
  if (outputs.length) {
    output = m.getOutput( outputs[0] );
  }

  var inputs = m.enumerateInputs();
  i = m.getInput(inputs[0]);
  i.onmessage = function (_event) {
    output.send( _event.data );

    var event = new MidiEvent(_event);
    // Check for double key downs
    if(keys_down[event.note] !== event.velocity){
      keys_down[event.note] = event.velocity;
      update_master_key(event);
    }
  }
}

function error(access) {
  console.log("MIDIAccess error.");
}

function update_master_key(event){
  if(!is_same_note_down_elsewhere(event.note)){
    if(is_note_up(event)){
      master_key[event.note%12].data("note", "up")
                                  .attr("opacity", 0.35)
                                  .g.remove();

    } else {
      master_key[event.note%12].g = master_key[event.note%12]
                                      .data("note", "down")
                                      .attr("opacity", 1.0)
                                      .glow({color: "#FFF"});
    }
  }

  var interval_index = 0;
  for(var i=0; i<12; i++){
    for(var j=0; j<i; j++){
      intervals[interval_index].attr({opacity: 0.15, stroke: "#ffffff"});
      if(master_key[i].data("note") === "down" && master_key[j].data("note") === "down"){
        intervals[interval_index].attr({opacity: 1.0, stroke: interval_color(i,j)});
      }
      interval_index++;
    }
  }
}

// Not all midi-keyboards adhere to the spec;
// some use the proper keyup command while others
// use a keydown with zero velocity to mean keyup.
function is_note_up(event){
  if(event.velocity === 0) return true;
  if(event.type >= 128 && event.type <= 143) return true; // Note-off/keyup command given
  return false; // Probably a keydown
}

function is_same_note_down_elsewhere(note){
  for(var i=note%12; i<88; i=i+12){
    if(keys_down[i] > 0 && i != note){
      return true;
    }
  }
  return false;
}

function interval_index_mapper(note_1, note_2){
  if(note_1 > note_2){
    return note_1*12 + note_2;
  }
  return note_2*12 + note_1;
}

function interval_color(note_1, note_2){
  var dist = Math.abs(note_1%12 - note_2%12);
  if(dist > 6) dist = 12 - dist;
  var colors = ["#bf001c",
                "#bf5600",
                "#bfac00",
                "#00bf85",
                "#00a2bf",
                "#5f00bf"]
  return colors[dist-1];
}

function node_position(node_idx){
  x = RADIUS*Math.sin(2*Math.PI*(node_idx/12)) + WIDTH/2;
  y = -RADIUS*Math.cos(2*Math.PI*(node_idx/12)) + HEIGHT/2;
  return {x: x, y: y};
}

setTimeout( function game_setup(){
  var mdna = Raphael(50, 50, WIDTH, HEIGHT);

  // Create the array of interval lines
  var interval_index = 0;
  for(var i=0; i<12; i++){
    for(var j=0; j<i; j++){
      intervals[interval_index] = mdna.path("M" + node_position(i).x + "," + node_position(i).y + 
                                            "L" + node_position(j).x + "," + node_position(j).y);
      intervals[interval_index].attr({fill: NODE_COLOR,
                                      stroke: "#ffffff",
                                      "stroke-width": 3,
                                      opacity: 0.15
      });
      interval_index++;
    }
  }

  // Create the array of 12 note nodes
  master_key.forEach(function(ele, idx, arr){
    arr[idx] = mdna.circle(node_position(idx).x, node_position(idx).y, 20);
    arr[idx].data("note", "up")
            .attr({fill: NODE_COLOR,
                   stroke: "#ffffff",
                   "stroke-width": 6,
                   opacity: 0.35
    });
  });

}, 300);
var m = null;   // m = MIDIAccess object for you to make calls on
var i = null;   // i = MIDIInput

setTimeout(function(){ navigator.requestMIDIAccess(success, error) }, 200);

//Globals (I know...)
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
  i.onmessage = function (event) {
    output.send( event.data );
    keys_down[event.data[1]] = event.data[2];
    update_master_key(event);
  }

}

function update_master_key(event){
  if(!is_same_note_down_elsewhere(event.data[1])){
    if(event.data[2] === 0){
      master_key[event.data[1]%12].data("note", "up")
                                  .attr("opacity", 0.5)
                                  .g.remove();

    } else {
      master_key[event.data[1]%12].g = master_key[event.data[1]%12]
                                      .data("note", "down")
                                      .attr("opacity", 1.0)
                                      .glow({color: "#FFF"});
    }
  }

  var interval_index = 0;
  for(var i=0; i<12; i++){
    for(var j=0; j<i; j++){
      intervals[interval_index].attr('opacity', 0.2);
      if(master_key[i].data("note") === "down" && master_key[j].data("note") === "down"){
        intervals[interval_index].attr('opacity', 1.0);
      }
      interval_index++;
    }
  }

}

function interval_index_mapper(note_1, note_2){
  if(note_1 > note_2){
    return note_1*12 + note_2;
  }
  return note_2*12 + note_1;
}

function is_same_note_down_elsewhere(note){
  for(var i=note%12; i<88; i=i+12){
    if(keys_down[i] > 0 && i != note){
      return true;
    }
  }
  return false;
}

function error(access) {
  console.log("MIDIAccess error.");
}

setTimeout( function game(){
  var WIDTH = 600;
  var HEIGHT = 400;
  var RADIUS = 150;
  var NODE_COLOR = "#1090B3";
  var mdna = Raphael(50, 50, WIDTH, HEIGHT);

  // Create the array of interval lines
  var interval_index = 0;
  for(var i=0; i<12; i++){
    for(var j=0; j<i; j++){
      x = RADIUS*Math.sin(2*Math.PI*(i/12)) + WIDTH/2;
      y = -RADIUS*Math.cos(2*Math.PI*(i/12)) + HEIGHT/2;
      x2 = RADIUS*Math.sin(2*Math.PI*(j/12)) + WIDTH/2;
      y2 = -RADIUS*Math.cos(2*Math.PI*(j/12)) + HEIGHT/2;
      intervals[interval_index] = mdna.path("M"+x+","+y+"L"+x2+","+y2);
      intervals[interval_index].attr({fill: NODE_COLOR,
                   stroke: "#ffffff",
                   "stroke-width": 3,
                   opacity: 0.2
      });
      interval_index++;
    }
  }

  // Create the array of 12 note nodes
  master_key.forEach(function(ele, idx, arr){
    x = RADIUS*Math.sin(2*Math.PI*(idx/12));
    y = -RADIUS*Math.cos(2*Math.PI*(idx/12));
    arr[idx] = mdna.circle(x + WIDTH/2, y + HEIGHT/2, 20);
    arr[idx].data("note", "up")
            .attr({fill: NODE_COLOR,
                   stroke: "#ffffff",
                   "stroke-width": 6,
                   opacity: 0.5
    });
  });

}, 300);
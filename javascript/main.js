var m = null;   // m = MIDIAccess object for you to make calls on
var i = null;   // i = MIDIInput

setTimeout(function(){ navigator.requestMIDIAccess(success, error) }, 200);

//Globals (I know...)
var keys_down = new Array(88).join('0').split('').map(parseFloat)
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
    if(event.data[2] === 0){
      master_key[event.data[1]%12].attr("opacity", 0.5);
    } else {
      master_key[event.data[1]%12].attr("opacity", 1.0);
    }
  }

}

function error(access) {
  console.log("MIDIAccess error.");
}

setTimeout( function game(){
  var WIDTH = 900;
  var HEIGHT = 500;
  var RADIUS = 150;
  var mdna = Raphael(50, 50, WIDTH, HEIGHT);
  master_key.forEach(function(ele, idx, arr){
    x = RADIUS*Math.sin(2*Math.PI*(idx/12));
    y = -RADIUS*Math.cos(2*Math.PI*(idx/12));
    arr[idx] = mdna.circle(x + WIDTH/2, y + HEIGHT/2, 20);
    arr[idx].attr({fill: "#1090B3",
                   stroke: "#ffffff",
                   "stroke-width": 6,
                   opacity: .5
    });
  });
}, 300);
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
      master_key[event.data[1]%12].attr("fill", "#f00");
    } else {
      master_key[event.data[1]%12].attr("fill", "#fff");
    }
  }

}

function error(access) {
  console.log("MIDIAccess error.");
}

setTimeout( function game(){
  var mdna = Raphael(50, 50, 800, 800);
  var RADIUS = 100;
  master_key.forEach(function(ele, idx, arr){
    x = RADIUS*Math.sin(2*Math.PI*(idx/12));
    y = -RADIUS*Math.cos(2*Math.PI*(idx/12));
    arr[idx] = mdna.circle(x + 150, y + 150, 10);
    arr[idx].attr("fill", "#f00");
    arr[idx].attr("stroke", "#000");
  });
}, 300);
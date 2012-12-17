var m = null;   // m = MIDIAccess object for you to make calls on
var i = null;   // i = MIDIInput

setTimeout(function(){ navigator.requestMIDIAccess(success, error) }, 200);

//Globals (I know...)
var keys_down = new Array(88).join('0').split('').map(parseFloat)

function success(access) {
  m = access;

  var inputs = m.enumerateInputs();
  var outputs = m.enumerateOutputs();
  i = m.getInput(inputs[0]);

  i.onmessage = function (event) {
    keys_down[event.data[1]] = event.data[2];
  }
}

function error(access) {
  // no-op
}
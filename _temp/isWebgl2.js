var  canvas = document.createElement('canvas');
var  gl = canvas.getContext('webgl2');
var isWebGL2 = true;
if (!gl) { // try to fallback to webgl 1
    gl = canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl');
  isWebGL2 = false;
}
if (!gl) {
    console.log('your browser does not support WebGL');
}
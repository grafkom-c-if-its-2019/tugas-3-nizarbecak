(function(global) {

  var canvas, gl, shaders = [];

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    // Initialize the shaders and program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);   
    var vertex2Shader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
        fragment2Shader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);
    var program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    var program2 = glUtils.createProgram(gl, vertex2Shader, fragment2Shader);
    shaders.push(program);
    shaders.push(program2);

    startDraw();
  }

  function initBuffersLine() {
    var vertices = new Float32Array([ 
      -0.35, +0.5,
      -0.15, +0.5,
      +0.15, -0.1,
      +0.15, +0.5,
      +0.35, +0.5,
      +0.35, -0.5,
      +0.15, -0.5,
      -0.15, +0.1,
      -0.15, -0.5,
      -0.35, -0.5
    ]);
    var n = 10;

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(shaders[0], 'aPosition');
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    return n;
  }

  function initBuffersBlock() {
    var vertices = new Float32Array([
      -0.35, -0.5,    0.83, 0.13, 0.18,
      -0.15, -0.5,    0.89, 0.15, 0.21,
      -0.35, +0.5,    0.89, 0.51, 0.41,

      -0.35, +0.5,    0.89, 0.51, 0.41,
      -0.15, -0.5,    0.89, 0.15, 0.21,
      -0.15, +0.5,    0.83, 0.13, 0.18,

      -0.15, +0.5,    0.83, 0.13, 0.18,
      -0.15, +0.1,    0.89, 0.15, 0.21,
      +0.15, -0.5,    0.89, 0.51, 0.41,

      +0.15, -0.5,    0.89, 0.51, 0.41,
      +0.15, -0.1,    0.89, 0.15, 0.21,
      -0.15, +0.5,    0.83, 0.13, 0.18,

      +0.15, -0.5,    0.89, 0.15, 0.21,
      +0.15, +0.5,    0.89, 0.15, 0.21,
      +0.35, -0.5,    0.89, 0.15, 0.21,

      +0.15, +0.5,    0.89, 0.15, 0.21,
      +0.35, -0.5,    0.89, 0.51, 0.41,
      +0.35, +0.5,    0.83, 0.13, 0.18
    ]);
    var n = 18;

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(shaders[1], 'aPosition');
    var vColor = gl.getAttribLocation(shaders[1], 'vColor');

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(vColor);

    return n;
  }

  function startDraw() {
    var translation = gl.getUniformLocation(shaders[0], 'translation');
    var translationVector = [-0.5, 0.0, 0.0];

    var thetaLocation = gl.getUniformLocation(shaders[0], 'theta');
    var theta = 0.0;

    var scalation = gl.getUniformLocation(shaders[1], 'scaleY');
    var scalePoint = 1.0;
    var corner = 1;

    function render(){
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(shaders[0]);

      theta += Math.PI * 0.0702;
      var nLine = initBuffersLine(gl);
      gl.uniform1f(thetaLocation, theta);
      gl.uniform3fv(translation, translationVector);
      gl.drawArrays(gl.LINE_LOOP, 0, nLine);

      gl.useProgram(shaders[1]);

      if(scalePoint >= 1) corner = -1;
      else if (scalePoint <= -1) corner = 1;
      var nBlock = initBuffersBlock(gl);
      gl.uniform1f(scalation, scalePoint);
      gl.drawArrays(gl.TRIANGLES, 0, nBlock);
      scalePoint += 0.0702 * corner;

      requestAnimationFrame(render);
    }
    render();
  }

})(window || this);
(function(TextureGen) {
  'use strict';

  var vertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_position;
varying vec2 v_texCoord;
void main() {
   v_position = a_position;
   v_texCoord = a_texCoord;
   gl_Position = vec4(a_position, 0, 1);
}
`;

  class CanvasNode extends TextureGen.BaseNode {
    constructor(id, title, inputs, fragmentShaderSource) {
      super(id, title, inputs);
      this.canvas = document.createElement('canvas');
      this.canvas.width = 512;
      this.canvas.height = 512;
      this.imageData = new ImageData(512, 512);
      this.domNode.appendChild(this.canvas);

      this.gl = getWebGLContext(this.canvas, {preserveDrawingBuffer: true}, {title: false});
      this.program = createProgramFromSources(this.gl, [vertexShaderSource, fragmentShaderSource]);
      this.gl.useProgram(this.program);
      var positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
      var buffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1
      ]), this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(positionLocation);
      this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
      var texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
      var texCoordBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
          0.0,  0.0,
          1.0,  0.0,
          0.0,  1.0,
          0.0,  1.0,
          1.0,  0.0,
          1.0,  1.0]), this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(texCoordLocation);
      this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.textures = [];

      var count = 0;
      for(var i = 0; i < this.orderedInputs.length; i++) {
        var input = this.orderedInputs[i];
        if(!(input instanceof TextureGen.GraphInput)) {
          continue;
        }
        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

        this.textures.push(texture);
      }
    }

    updateTextures() {
      var count = 0;
      for(var i = 0; i < this.orderedInputs.length; i++) {
        var input = this.orderedInputs[i];
        if(!(input instanceof TextureGen.GraphInput)) {
          continue;
        }
        var texture = this.textures[count];
        this.gl.activeTexture(this.gl.TEXTURE0 + count);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        var image = input.getOutput();
        if(image) {
          if(image instanceof TextureGen.GradientValue) {
            image = image.getOutput(); 
          }
          this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        }
        var imageLocation = this.gl.getUniformLocation(this.program, 'u_' + input.options.name);
        this.gl.uniform1i(imageLocation, count);
        count++;
      }
    }

    getOutput() {
      return this.canvas;
    }

    render() {
      for(var i = 0; i < this.orderedInputs.length; i++) {
        var input = this.orderedInputs[i];
        if(input instanceof TextureGen.NumberInput) {
          this.gl.uniform1f(this.gl.getUniformLocation(this.program, 'u_' + input.options.name), input.getOutput());
        } else if(input instanceof TextureGen.ChoiceInput) {
          this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'u_' + input.options.name), input.getOutput());
        } else if(input instanceof TextureGen.ColorInput) {
          var color = input.getOutput();
          this.gl.uniform3fv(this.gl.getUniformLocation(this.program, 'u_' + input.options.name), [color.r, color.g, color.b]);
        }
      }
      this.updateTextures();
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
  }

  TextureGen.CanvasNode = CanvasNode;
})(TextureGen);

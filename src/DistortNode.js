(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
uniform sampler2D u_Image;
uniform sampler2D u_Map;
uniform float u_Amount;
varying vec2 v_position;
varying vec2 v_texCoord;

void main() {
  vec4 distortion = texture2D(u_Map, v_texCoord);
  vec4 color = texture2D(u_Image, v_texCoord + (distortion.rg - .5) * u_Amount);
  gl_FragColor = vec4(color.rgb, 1.);
}
`;

  class DistortNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Distort', [
          new TextureGen.GraphInput({name: 'Image'}),
          new TextureGen.GraphInput({name: 'Map'}),
          new TextureGen.NumberInput({
            name: 'Amount',
            min: 0,
            max: 4,
            step: 0.01,
            default: 1
          })
      ], shader);
    }
  }

  TextureGen.DistortNode = DistortNode;
})(TextureGen);

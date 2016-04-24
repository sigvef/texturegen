(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
varying vec2 v_position;
varying vec2 v_texCoord;
uniform sampler2D u_Image;
uniform float u_Threshold;

void main() {
  float threshold = u_Threshold / 255.;
  vec4 color = texture2D(u_Image, v_texCoord);
  float gray = (color.r + color.g + color.b) / 3.;
  float value = gray >= threshold ? 1. : 0.;
  gl_FragColor = vec4(vec3(value), 1.);
}
`;

  class ThresholdNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Threshold', [
        new TextureGen.GraphInput({name: 'Image'}),
        new TextureGen.NumberInput({
          name: 'Threshold',
          min: 0,
          max: 255,
          step: 1,
          default: 127
        })
      ], shader);
    }
  }

  TextureGen.ThresholdNode = ThresholdNode;
})(TextureGen);

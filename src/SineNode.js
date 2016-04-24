(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
varying vec2 v_position;
varying vec2 v_texCoord;
uniform float u_periods;

#define PI 3.1415926535897932384626433832795

void main() {
   gl_FragColor = vec4(vec3((.5 + sin(v_texCoord.x * PI * 2. * u_periods) * .5)), 1.);
}
`;

  class SineNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Sine', [new TextureGen.NumberInput({
        name: 'periods',
        min: 0,
        max: 256,
        step: 0.01,
        default: 5
      })], shader);
    }
  }

  TextureGen.SineNode = SineNode;
})(TextureGen);

(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
varying vec2 v_position;
varying vec2 v_texCoord;
uniform float u_x;
uniform float u_y;
uniform float u_periods;

#define PI 3.1415926535897932384626433832795

void main() {
   vec2 offset = v_position - vec2(u_x / 256. - 1., 1. - u_y / 256.);
   float distance = sqrt(offset.x * offset.x + offset.y * offset.y);
   float amount = (1. + sin(u_periods * distance * PI * 2.)) * .5;
   gl_FragColor = vec4(vec3(amount), 1.);
}
`;

  class CircularSineNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'CircularSine', [
        new TextureGen.NumberInput({
          name: 'x',
          min: 0,
          max: 512,
          step: 1,
          default: 256
        }),
        new TextureGen.NumberInput({
          name: 'y',
          min: 0,
          max: 512,
          step: 1,
          default: 256
        }),
        new TextureGen.NumberInput({
          name: 'periods',
          min: 0,
          max: 512,
          step: 1,
          default: 5
        })
      ], shader);
    }
  }

  TextureGen.CircularSineNode = CircularSineNode;
})(TextureGen);

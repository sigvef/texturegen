(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
uniform float u_x;
uniform float u_y;
uniform float u_radius;
varying vec2 v_position;
varying vec2 v_texCoord;

void main() {
  vec2 position = v_position + 0.5 - vec2(u_x, u_y) / 512.;
  float distance = u_radius / 256. * sqrt(dot(position, position));
  gl_FragColor = vec4(vec3(1. - distance), 1.);
}
`;

  class CircularGradientNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'CircularGradient', [
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
          name: 'radius',
          min: 0,
          max: 512,
          step: 1,
          default: 256
        })
      ], shader);
    }
  }

  TextureGen.CircularGradientNode = CircularGradientNode;
})(TextureGen);

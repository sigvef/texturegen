(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
varying vec2 v_position;
varying vec2 v_texCoord;
uniform float u_x;
uniform float u_y;
uniform float u_w;
uniform float u_h;
uniform vec3 u_fill;

void main() {
  vec3 color = vec3(1.);
  if(v_texCoord.x > u_x / 512. &&
     v_texCoord.x < (u_x + u_w) / 512. &&
     1. - v_texCoord.y > u_y / 512. &&
     1. - v_texCoord.y < (u_y + u_h) / 512.) {
    color = u_fill;
  }
  gl_FragColor = vec4(color, 1.);
}
`;

  class RectNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Rect', [
        new TextureGen.NumberInput({
          name: 'x',
          min: 0,
          max: 512,
          step: 1,
          default: 0
        }),
        new TextureGen.NumberInput({
          name: 'y',
          min: 0,
          max: 512,
          step: 1,
          default: 0
        }),
        new TextureGen.NumberInput({
          name: 'w',
          min: 0,
          max: 512,
          step: 1,
          default: 512
        }),
        new TextureGen.NumberInput({
          name: 'h',
          min: 0,
          max: 512,
          step: 1,
          default: 512
        }),
        new TextureGen.ColorInput({
          name: 'fill',
          default: '000000'
        })
      ], shader);
    }
  }

  TextureGen.RectNode = RectNode;
})(TextureGen);

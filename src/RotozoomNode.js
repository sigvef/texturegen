(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
varying vec2 v_position;
varying vec2 v_texCoord;
uniform sampler2D u_Image;
uniform float u_Angle;
uniform float u_TranslateX;
uniform float u_TranslateY;
uniform float u_RepeatX;
uniform float u_RepeatY;

#define PI 3.1415926535897932384626433832795

void main() {
  vec2 coord = v_position;
  vec2 translate = vec2(u_TranslateX, u_TranslateY) / 512.;
  vec2 repeat = vec2(u_RepeatX, u_RepeatY);
  float angle = u_Angle / 180. * PI;
  coord += repeat * translate;
  vec2 rotozoomed = repeat * vec2(cos(angle) * coord.x - sin(angle) * coord.y,
                                  sin(angle) * coord.x + cos(angle) * coord.y);
  rotozoomed -= repeat * vec2(cos(angle) * translate.x - sin(angle) * translate.y,
                              sin(angle) * translate.x + cos(angle) * translate.y);
  gl_FragColor = texture2D(u_Image, rotozoomed);
}
`;

  class RotozoomNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Rotozoom', [
        new TextureGen.GraphInput({name: 'Image'}),
        new TextureGen.NumberInput({
          name: 'Angle',
          min: 0,
          max: 360,
          step: 1,
          default: 0
        }),
        new TextureGen.NumberInput({
          name: 'TranslateX',
          min: 0,
          max: 512,
          step: 1,
          default: 0
        }),
        new TextureGen.NumberInput({
          name: 'TranslateY',
          min: 0,
          max: 512,
          step: 1,
          default: 0
        }),
        new TextureGen.NumberInput({
          name: 'RepeatX',
          min: 0,
          max: 128,
          step: 0.01,
          default: 1
        }),
        new TextureGen.NumberInput({
          name: 'RepeatY',
          min: 0,
          max: 128,
          step: 0.01,
          default: 1
        })
      ], shader);
    }
  }

  TextureGen.RotozoomNode = RotozoomNode;
})(TextureGen);

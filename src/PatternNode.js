(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
uniform int u_pattern;
uniform float u_linewidth;
varying vec2 v_position;
varying vec2 v_texCoord;

void main() {
  if(u_pattern == 0) {
    float value = 1. - abs(sign(v_position.x) - sign(v_position.y));
    gl_FragColor = vec4(vec3(value), 1.);
  } else if(u_pattern == 1) {
    float lineWidth = u_linewidth / 256.;
    float value = 1.;
    if(v_position.y > 1. - lineWidth) {
      value = 0.;
    }
    if(v_position.y < 0. && v_position.y > -lineWidth) {
      value = 0.;
    }
    if(v_position.y < 0. && v_position.x < -1. + lineWidth) {
      value = 0.;
    }
    if(v_position.y > 0. && v_position.x > 0. && v_position.x < lineWidth) {
      value = 0.;
    }
    gl_FragColor = vec4(vec3(value), 1.);
  }
}
`;


  class PatternNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Pattern', [
        new TextureGen.ChoiceInput({
          name: 'pattern',
          choices: [
            {name: 'Checker', value: 0, selected: true},
            {name: 'Brick', value: 1}
          ]
        }),
        new TextureGen.NumberInput({
          name: 'linewidth',
          min: 1,
          max: 256,
          step: 1,
          default: 8
        })
      ], shader);
    }
  }

  TextureGen.PatternNode = PatternNode;
})(TextureGen);

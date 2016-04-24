(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
varying vec2 v_position;
varying vec2 v_texCoord;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  gl_FragColor = vec4(vec3(rand(v_texCoord)), 1.);
}
`;

  class RandomNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Random', [], shader);
    }
  }

  TextureGen.RandomNode = RandomNode;
})(TextureGen);

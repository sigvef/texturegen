(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
uniform sampler2D u_Image;
varying vec2 v_position;
varying vec2 v_texCoord;

void main() {
  vec4 original = texture2D(u_Image, v_texCoord);
  gl_FragColor = vec4(1. - original.rgb, 1.);
}
`;

  class InvertNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Invert', [new TextureGen.GraphInput({name: 'Image'})], shader);
    }
  }

  TextureGen.InvertNode = InvertNode;
})(TextureGen);

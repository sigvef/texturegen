(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
uniform sampler2D u_A;
uniform sampler2D u_B;
uniform sampler2D u_Mask;
varying vec2 v_position;
varying vec2 v_texCoord;

void main() {
  vec4 A = texture2D(u_A, v_texCoord);
  vec4 B = texture2D(u_B, v_texCoord);
  vec4 Mask = texture2D(u_Mask, v_texCoord);
  gl_FragColor = vec4(mix(A.rgb, B.rgb, Mask.rgb), 1.);
}
`;

  class MaskNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Mask', [new TextureGen.GraphInput({name: 'A'}),
                         new TextureGen.GraphInput({name: 'B'}),
                         new TextureGen.GraphInput({name: 'Mask'})], shader);
    }
  }

  TextureGen.MaskNode = MaskNode;
})(TextureGen);

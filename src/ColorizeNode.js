(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
uniform sampler2D u_Image;
uniform sampler2D u_Gradient;
varying vec2 v_position;
varying vec2 v_texCoord;

void main() {
  vec4 original = texture2D(u_Image, vec2(v_texCoord.x, -v_texCoord.y));
  float r = texture2D(u_Gradient, vec2(original.r, 0.)).r;
  float g = texture2D(u_Gradient, vec2(original.g, 0.)).g;
  float b = texture2D(u_Gradient, vec2(original.b, 0.)).b;
  gl_FragColor = vec4(r, g, b, 1.);
}
`;

  class ColorizeNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Colorize', [new TextureGen.GraphInput({name: 'Image'}),
                             new TextureGen.GraphInput({name: 'Gradient'})], shader);
    }
  }

  TextureGen.ColorizeNode = ColorizeNode;
})(TextureGen);

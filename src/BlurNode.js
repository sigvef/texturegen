(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
uniform sampler2D u_Image;
varying vec2 v_position;
varying vec2 v_texCoord;

void main() {
   float pixelWidth = 1. / 512.;
   vec4 middle = texture2D(u_Image, v_texCoord);
   vec4 right = texture2D(u_Image, v_texCoord + vec2(pixelWidth, 0.));
   vec4 left = texture2D(u_Image, v_texCoord - vec2(pixelWidth, 0.));
   vec4 bottom = texture2D(u_Image, v_texCoord + vec2(0., pixelWidth));
   vec4 top = texture2D(u_Image, v_texCoord - vec2(0., pixelWidth));

   gl_FragColor = (middle + right + left + bottom + top) / 5.;
}
`;

  class BlurNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Blur', [new TextureGen.GraphInput({name: 'Image'})], shader);
    }
  }

  TextureGen.BlurNode = BlurNode;
})(TextureGen);

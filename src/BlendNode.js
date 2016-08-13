(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
uniform sampler2D u_A;
uniform sampler2D u_B;
uniform int u_mode;
varying vec2 v_position;
varying vec2 v_texCoord;

void main() {
   vec4 A = texture2D(u_A, v_texCoord);
   vec4 B = texture2D(u_B, v_texCoord);
   
   if(u_mode == 0) {
     gl_FragColor = vec4(A.rgb + B.rgb, max(A.a, B.a));
   } else if(u_mode == 1) {
     gl_FragColor = vec4(A.rgb * B.rgb, max(A.a, B.a));
   } else if(u_mode == 2) {
     gl_FragColor = vec4(A.rgb - B.rgb, max(A.a, B.a));
   } else if(u_mode == 3) {
     gl_FragColor = vec4(mix(A.rgb, B.rgb, A.a), max(A.a, B.a));
   }
}
`;

  class BlendNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Blend', [
        new TextureGen.GraphInput({name: 'A'}),
        new TextureGen.GraphInput({name: 'B'}),
        new TextureGen.ChoiceInput({
          name: 'mode',
          choices: [
            {name: 'Add', value: 0, selected: true},
            {name: 'Multiply', value: 1},
            {name: 'Subtract', value: 2},
            {name: 'Normal', value: 3}
          ]
        })
      ], shader);
    }
  }

  TextureGen.BlendNode = BlendNode;
})(TextureGen);

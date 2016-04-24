(function(TextureGen) {
  'use strict';

var shader = `
precision mediump float;
varying vec2 v_position;
varying vec2 v_texCoord;
uniform sampler2D u_Image;
uniform float u_Angle;

#define PI 3.1415926535897932384626433832795

void main() {
  float swirlDegree = clamp(u_Angle, 0., 360.);
  float K = swirlDegree / 36.;
  float radian = atan(v_position.y, v_position.x);
  float radius = sqrt(dot(v_position, v_position));
  vec2 position = vec2(radius * cos(radian + K * radius) + 512. / 2.,
                       radius * sin(radian + K * radius) + 512. / 2.);
  gl_FragColor = texture2D(u_Image, position);
}
`;

  class SwirlNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Swirl', [
        new TextureGen.GraphInput({name: 'Image'}),
        new TextureGen.NumberInput({
          name: 'Angle',
          min: 0,
          max: 360,
          stop: 1,
          default: 45
        })
      ], shader);
    }
  }

  TextureGen.SwirlNode = SwirlNode;
})(TextureGen);

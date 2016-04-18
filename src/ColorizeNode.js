(function(TextureGen) {
  'use strict';

  class ColorizeNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Colorize', ['Image', 'Gradient']);
      this.type = 'ColorizeNode';
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var image = this.getInput('Image') || new ImageData(512, 512);
      var gradient = this.getInput('Gradient') || new TextureGen.GradientValue(0, 0, 256, 0, [
          {offset: 0, color: 'black'},
          {offset: 1, color:'white'}
      ]);
      var canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 1;
      var ctx = canvas.getContext('2d');
      gradient.x0 = 0;
      gradient.y0 = 0;
      gradient.x1 = 256;
      gradient.y1 = 0;
      ctx.fillStyle = gradient.toCanvasStyle();
      ctx.fillRect(0, 0, 256, 1);
      this.imageData = texturegen.colorize(image, ctx.getImageData(0, 0, 256, 1));
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.ColorizeNode = ColorizeNode;
})(TextureGen);

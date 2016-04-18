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
      var gradient = JSON.parse(this.getInput('Gradient') ||
                                JSON.stringify([{offset: 0, color: 'black'}, {offset:1, color:'white'}]));
      var canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 1;
      var ctx = canvas.getContext('2d');
      var canvasGradient = ctx.createLinearGradient(0, 0, 256, 0);
      for(var i = 0; i < gradient.length; i++) {
        var colorStop = gradient[i];
        canvasGradient.addColorStop(colorStop.offset, colorStop.color);
      }
      ctx.fillStyle = canvasGradient;
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

(function(TextureGen) {
  'use strict';

  class RotozoomNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Rotozoom', ['Image', 'Angle', 'TranslateX', 'TranslateY', 'ScaleX', 'ScaleY']);
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var input = this.getInput('Image') || new ImageData(512, 512);
      var angle = +this.getInput('Angle') || 0;
      var translateX = +this.getInput('TranslateX') || 0;
      var translateY = +this.getInput('TranslateY') || 0;
      var scaleX = +this.getInput('ScaleX') || 1;
      var scaleY = +this.getInput('ScaleY') || 1;
      this.imageData = texturegen.rotozoom(input, angle, translateX, translateY, scaleX, scaleY);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.RotozoomNode = RotozoomNode;
})(TextureGen);

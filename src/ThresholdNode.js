(function(TextureGen) {
  'use strict';

  class ThresholdNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Threshold', [
        new TextureGen.GraphInput({name: 'Image'}),
        new TextureGen.NumberInput({
          name: 'Threshold',
          min: 0,
          max: 255,
          step: 1,
          default: 127
        })
      ]);
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var image = this.getInput('Image') || new ImageData(512, 512);
      var amount = this.getInput('Threshold') || 127;
      this.imageData = texturegen.threshold(image, amount);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.ThresholdNode = ThresholdNode;
})(TextureGen);

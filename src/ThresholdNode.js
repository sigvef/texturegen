(function(TextureGen) {
  'use strict';

  function ThresholdNode(id) {
    TextureGen.CanvasNode.call(this, id, 'Threshold', ['Image', 'Threshold']);
    this.type = 'ThresholdNode';
  }

  ThresholdNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
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
  });

  TextureGen.ThresholdNode = ThresholdNode;
})(TextureGen);

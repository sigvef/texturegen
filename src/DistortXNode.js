(function(TextureGen) {
  'use strict';

  function DistortXNode(id) {
    TextureGen.CanvasNode.call(this, id, 'DistortX', ['Image', 'Map', 'Amount']);
    this.type = 'DistortXNode';
  }

  DistortXNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
        if(!this.dirty) {
          return;
        }
        var image = this.getInput('Image') || new ImageData(512, 512);
        var distortionMap = this.getInput('Map') || new ImageData(512, 512);
        var amount = this.getInput('Amount');
        this.imageData = texturegen.distortX(image, distortionMap, amount);
        this.ctx.putImageData(this.imageData, 0, 0);
        this.dirty = false;

        for(var key in this.outputs) {
          this.outputs[key].dirty = true;
          this.outputs[key].render();
        }
      }
    }
  });

  TextureGen.DistortXNode = DistortXNode;
})(TextureGen);

(function(TextureGen) {
  'use strict';

  function PolarNode(id) {
    TextureGen.CanvasNode.call(this, id, 'Polar', ['Image']);
    this.type = 'PolarNode';
  }

  PolarNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
        if(!this.dirty) {
          return;
        }
        var imageData = this.getInput('Image') || new ImageData(512, 512);
        this.imageData = texturegen.polar(imageData);
        this.ctx.putImageData(this.imageData, 0, 0);
        this.dirty = false;

        for(var key in this.outputs) {
          this.outputs[key].dirty = true;
          this.outputs[key].render();
        }
      }
    }
  });

  TextureGen.PolarNode = PolarNode;
})(TextureGen);

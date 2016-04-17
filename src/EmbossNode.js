(function(TextureGen) {
  'use strict';

  function EmbossNode(id) {
    TextureGen.CanvasNode.call(this, id, 'Emboss', ['Image']);
    this.type = 'EmbossNode';
  }

  EmbossNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
        if(!this.dirty) {
          return;
        }
        var imageData = this.getInput('Image') || new ImageData(512, 512);
        this.imageData = texturegen.emboss(imageData);
        this.ctx.putImageData(this.imageData, 0, 0);
        this.dirty = false;

        for(var key in this.outputs) {
          this.outputs[key].dirty = true;
          this.outputs[key].render();
        }
      }
    }
  });

  TextureGen.EmbossNode = EmbossNode;
})(TextureGen);

(function(TextureGen) {
  'use strict';

  function FillNode() {
    TextureGen.CanvasNode.call(this, 'Fill');
  }

  FillNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
        if(!this.dirty) {
          return;
        }
        this.imageData = texturegen.fill(this.inputs['color'].getOutput());
        this.ctx.putImageData(this.imageData, 0, 0);
        this.dirty = false;
      }
    }
  });

  TextureGen.FillNode = FillNode;
})(TextureGen);

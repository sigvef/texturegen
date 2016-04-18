(function(TextureGen) {
  'use strict';

  function CheckerNode(id) {
    TextureGen.CanvasNode.call(this, id, 'Checker', []);
    this.type = 'CheckerNode';
  }

  CheckerNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
        if(!this.dirty) {
          return;
        }

        this.imageData = texturegen.checker(this.imageData);
        this.ctx.putImageData(this.imageData, 0, 0);
        this.dirty = false;

        for(var key in this.outputs) {
          this.outputs[key].dirty = true;
          this.outputs[key].render();
        }
      }
    }
  });

  TextureGen.CheckerNode = CheckerNode;
})(TextureGen);

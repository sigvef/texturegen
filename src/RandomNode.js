(function(TextureGen) {
  'use strict';

  function RandomNode(id) {
    TextureGen.CanvasNode.call(this, id, 'Random', []);
    this.type = 'RandomNode';
  }

  RandomNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
        if(!this.dirty) {
          return;
        }

        this.imageData = texturegen.random(this.imageData);
        this.ctx.putImageData(this.imageData, 0, 0);
        this.dirty = false;

        for(var key in this.outputs) {
          this.outputs[key].dirty = true;
          this.outputs[key].render();
        }
      }
    }
  });

  TextureGen.RandomNode = RandomNode;
})(TextureGen);

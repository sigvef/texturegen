(function(TextureGen) {
  'use strict';

  function FillNode(id) {
    TextureGen.CanvasNode.call(this, id, 'Fill', ['color']);
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

        for(var key in this.outputs) {
          this.outputs[key].dirty = true;
          this.outputs[key].render();
        }
      }
    }
  });

  TextureGen.FillNode = FillNode;
})(TextureGen);

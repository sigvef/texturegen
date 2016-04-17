(function(TextureGen) {
  'use strict';

  function SubtractNode(id) {
    TextureGen.CanvasNode.call(this, id, 'Subtract', ['A', 'B']);
    this.type = 'SubtractNode';
  }

  SubtractNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
        if(!this.dirty) {
          return;
        }
        var A = this.getInput('A') || new ImageData(512, 512);
        var B = this.getInput('B') || new ImageData(512, 512);
        this.imageData = texturegen.subtract(A, B);
        this.ctx.putImageData(this.imageData, 0, 0);
        this.dirty = false;

        for(var key in this.outputs) {
          this.outputs[key].dirty = true;
          this.outputs[key].render();
        }
      }
    }
  });

  TextureGen.SubtractNode = SubtractNode;
})(TextureGen);

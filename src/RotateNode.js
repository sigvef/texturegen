(function(TextureGen) {
  'use strict';

  function RotateNode(id) {
    TextureGen.CanvasNode.call(this, id, 'Rotate', ['Image', 'Repeat']);
    this.type = 'RotateNode';
  }

  RotateNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
        if(!this.dirty) {
          return;
        }
        var input = this.getInput('Image') || new ImageData(512, 512);
        var rotateRepeat = this.getInput('Repeat') || 1;
        this.imageData = texturegen.rotate(input, rotateRepeat);
        this.ctx.putImageData(this.imageData, 0, 0);
        this.dirty = false;

        for(var key in this.outputs) {
          this.outputs[key].dirty = true;
          this.outputs[key].render();
        }
      }
    }
  });

  TextureGen.RotateNode = RotateNode;
})(TextureGen);

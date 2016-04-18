(function(TextureGen) {
  'use strict';

  class AddNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Add', ['A', 'B']);
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var A = this.getInput('A') || new ImageData(512, 512);
      var B = this.getInput('B') || new ImageData(512, 512);
      this.imageData = texturegen.add(A, B);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.AddNode = AddNode;
})(TextureGen);

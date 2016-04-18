(function(TextureGen) {
  'use strict';

  class CheckerNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Checker', []);
      this.type = 'CheckerNode';
    }

    render() {
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

  TextureGen.CheckerNode = CheckerNode;
})(TextureGen);

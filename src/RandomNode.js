(function(TextureGen) {
  'use strict';

  class RandomNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Random', []);
      this.type = 'RandomNode';
    }

    render() {
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

  TextureGen.RandomNode = RandomNode;
})(TextureGen);

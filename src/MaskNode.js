(function(TextureGen) {
  'use strict';

  class MaskNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Mask', ['A', 'B', 'Mask']);
      this.type = 'MaskNode';
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var A = this.getInput('A') || new ImageData(512, 512);
      var B = this.getInput('B') || new ImageData(512, 512);
      var mask = this.getInput('Mask') || new ImageData(512, 512);
      this.imageData = texturegen.mask(A, B, mask);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.MaskNode = MaskNode;
})(TextureGen);

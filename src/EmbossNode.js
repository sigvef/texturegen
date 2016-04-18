(function(TextureGen) {
  'use strict';

  class EmbossNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Emboss', ['Image']);
      this.type = 'EmbossNode';
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var imageData = this.getInput('Image') || new ImageData(512, 512);
      this.imageData = texturegen.emboss(imageData);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.EmbossNode = EmbossNode;
})(TextureGen);

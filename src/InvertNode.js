(function(TextureGen) {
  'use strict';

  class InvertNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Invert', ['Image']);
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var image = this.getInput('Image') || new ImageData(512, 512);
      this.imageData = texturegen.invert(image);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.InvertNode = InvertNode;
})(TextureGen);

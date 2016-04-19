(function(TextureGen) {
  'use strict';

  class SobelNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Sobel', [new TextureGen.GraphInput({name: 'Image'})]);
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var input = this.getInput('Image') || new ImageData(512, 512);

      this.imageData = texturegen.sobel(input);

      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.SobelNode = SobelNode;
})(TextureGen);

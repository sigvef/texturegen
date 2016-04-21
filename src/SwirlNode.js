(function(TextureGen) {
  'use strict';

  class SwirlNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Swirl', [
        new TextureGen.GraphInput({name: 'Image'}),
        new TextureGen.NumberInput({
          name: 'Angle',
          min: 0,
          max: 360,
          stop: 1,
          default: 45
        })
      ]);
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var imageData = this.getInput('Image') || new ImageData(512, 512);
      var angle = +this.getInput('Angle') || 0;
      this.imageData = texturegen.swirl(imageData, angle);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.SwirlNode = SwirlNode;
})(TextureGen);

(function(TextureGen) {
  'use strict';

  class PerlinNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Perlin', ['freq.', 'octaves']);
      this.type = 'PerlinNode';
    }

    render() {
      if(!this.dirty) {
        return;
      }

      var frequency = 1 / Math.pow(2, this.getInput('freq.')) || 1 / 128;
      var octaves = this.getInput('octaves');

      this.imageData = texturegen.perlin(this.imageData, frequency, octaves);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.PerlinNode = PerlinNode;
})(TextureGen);

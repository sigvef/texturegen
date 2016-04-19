(function(TextureGen) {
  'use strict';

  class PerlinNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Perlin', [
        new TextureGen.NumberInput({
          name: 'freq.',
          min: 5,
          max: 8,
          step: 1,
          default: 7
        }),
        new TextureGen.NumberInput({
          name: 'octaves',
          min: 1,
          max: 5,
          step: 1,
          default: 5
        })]);
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

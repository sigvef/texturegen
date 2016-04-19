(function(TextureGen) {
  'use strict';

  class SineNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Sine', [new TextureGen.NumberInput({
        name: 'periods',
        min: 0,
        max: 256,
        step: 0.01,
        default: 5
      })]);
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var periods = this.getInput('periods') || 5;
      this.imageData = texturegen.sine(this.imageData, periods);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.SineNode = SineNode;
})(TextureGen);

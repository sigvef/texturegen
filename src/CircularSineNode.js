(function(TextureGen) {
  'use strict';

  class CircularSineNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'CircularSine', ['x', 'y', 'periods']);
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var x = this.getInput('x') || 256;
      var y = this.getInput('y') || 256;
      var periods = this.getInput('periods') || 5;
      this.imageData = texturegen.circularSine(this.imageData, x, y, periods);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.CircularSineNode = CircularSineNode;
})(TextureGen);

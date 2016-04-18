(function(TextureGen) {
  'use strict';

  class CircularGradientNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'CircularGradient', ['x', 'y', 'radius']);
      this.type = 'CircularGradientNode';
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var x = this.getInput('x') || 256;
      var y = this.getInput('y') || 256;
      var radius = this.getInput('radius') || 256;
      this.imageData = texturegen.circularGradient(this.imageData, x, y, radius);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.CircularGradientNode = CircularGradientNode;
})(TextureGen);

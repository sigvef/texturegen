(function(TextureGen) {
  'use strict';

  function CircularSineNode(id) {
    TextureGen.CanvasNode.call(this, id, 'CircularSine', ['x', 'y', 'periods']);
    this.type = 'CircularSineNode';
  }

  CircularSineNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
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
  });

  TextureGen.CircularSineNode = CircularSineNode;
})(TextureGen);

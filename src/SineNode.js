(function(TextureGen) {
  'use strict';

  function SineNode(id) {
    TextureGen.CanvasNode.call(this, id, 'Sine', ['periods']);
    this.type = 'SineNode';
  }

  SineNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
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
  });

  TextureGen.SineNode = SineNode;
})(TextureGen);

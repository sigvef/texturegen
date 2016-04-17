(function(TextureGen) {
  'use strict';

  function PerlinNode(id) {
    TextureGen.CanvasNode.call(this, id, 'Perlin', ['freq.', 'octaves']);
    this.type = 'PerlinNode';
  }

  PerlinNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
        if(!this.dirty) {
          return;
        }

        var frequency = 1 / Math.pow(2, this.getInput('freq.')) || 1 / 128;
        var octaves = this.getInput('octaves');

        this.imageData = texturegen.perlin(new ImageData(512, 512), frequency, octaves);
        this.ctx.putImageData(this.imageData, 0, 0);
        this.dirty = false;

        for(var key in this.outputs) {
          this.outputs[key].dirty = true;
          this.outputs[key].render();
        }
      }
    }
  });

  TextureGen.PerlinNode = PerlinNode;
})(TextureGen);

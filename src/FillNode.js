(function(TextureGen) {
  'use strict';

  function FillNode(id) {
    TextureGen.CanvasNode.call(this, id, 'Fill', ['color']);
    this.type = 'FillNode';
  }

  FillNode.prototype = Object.create(TextureGen.CanvasNode.prototype, {
    render: {
      value: function() {
        if(!this.dirty) {
          return;
        }
        var color = this.inputs['color'] ? this.inputs['color'].getOutput()
                                         : {r: 0, g: 0, b: 0, a: 255};
        this.imageData = texturegen.fill(color);
        this.ctx.putImageData(this.imageData, 0, 0);
        this.dirty = false;

        for(var key in this.outputs) {
          this.outputs[key].dirty = true;
          this.outputs[key].render();
        }
      }
    }
  });

  TextureGen.FillNode = FillNode;
})(TextureGen);

(function(TextureGen) {
  'use strict';

  class RectNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Rect', [
        new TextureGen.NumberInput({
          name: 'x',
          min: 0,
          max: 512,
          step: 1,
          default: 0
        }),
        new TextureGen.NumberInput({
          name: 'y',
          min: 0,
          max: 512,
          step: 1,
          default: 0
        }),
        new TextureGen.NumberInput({
          name: 'w',
          min: 0,
          max: 512,
          step: 1,
          default: 512
        }),
        new TextureGen.NumberInput({
          name: 'h',
          min: 0,
          max: 512,
          step: 1,
          default: 512
        }),
        new TextureGen.GraphInput({name: 'fill'}),
        new TextureGen.GraphInput({name: 'stroke'})
      ]);
    }

    render() {
      if(!this.dirty) {
        return;
      }

      var x = this.getInput('x') || 0;
      var y = this.getInput('y') || 0;
      var w = this.getInput('w') || 512;
      var h = this.getInput('h') || 512;
      var fill = (this.getInput('fill') || new TextureGen.ColorValue(0, 0, 0, 255)).toCanvasStyle();
      var stroke = (this.getInput('stroke') || new TextureGen.ColorValue(0, 0, 0, 255)).toCanvasStyle();

      this.imageData = texturegen.rect(this.imageData, x, y, w, h, fill, stroke);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.RectNode = RectNode;
})(TextureGen);

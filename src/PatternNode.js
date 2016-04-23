(function(TextureGen) {
  'use strict';

  class PatternNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Pattern', [
        new TextureGen.ChoiceInput({
          name: 'Pattern',
          choices: [
            {name: 'Checker', value: 'checker', selected: true},
            {name: 'Brick', value: 'brick'}
          ]
        })
      ]);
    }

    render() {
      if(!this.dirty) {
        return;
      }

      this.imageData = texturegen[this.getInput('Pattern')](this.imageData);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.PatternNode = PatternNode;
})(TextureGen);

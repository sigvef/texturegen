(function(TextureGen) {
  'use strict';

  class BlendNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'Blend', [
        new TextureGen.GraphInput({name: 'A'}),
        new TextureGen.GraphInput({name: 'B'}),
        new TextureGen.ChoiceInput({
          name: 'Blendmode',
          choices: [
            {name: 'Add', value: 'add', selected: true},
            {name: 'Multiply', value: 'multiply'},
            {name: 'Subtract', value: 'subtract'},
            {name: 'Normal', value: 'normal'}
          ]
        })
      ]);
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var A = this.getInput('A') || new ImageData(512, 512);
      var B = this.getInput('B') || new ImageData(512, 512);
      var blendmode = this.getInput('Blendmode');
      switch (blendmode) {
        case 'subtract':
          this.imageData = texturegen.subtract(A, B);
          break;
        case 'multiply':
          this.imageData = texturegen.multiply(A, B);
          break;
        case 'normal':
          this.imageData = texturegen.blendNormal(A, B);
          break;
        case 'add':
        default:
          this.imageData = texturegen.add(A, B);
      }
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.BlendNode = BlendNode;
})(TextureGen);

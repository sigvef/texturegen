(function(TextureGen) {
  'use strict';

  class NumberNode extends TextureGen.BaseNode {
    constructor(id) {
      super(id, 'Number', []);
      this.value = {r: 255, g: 255, b: 255, a: 255};

      var input = document.createElement('input');
      input.type = 'number';
      this.input = input;
      var that = this;
      input.addEventListener('change', function() {
        that.setValue(input.value);
      });
      this.domNode.appendChild(input);
    }

    setValue(value) {
      this.value = value;
      this.input.value = value;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }

    getOutput() {
      return this.value;
    }
  }

  TextureGen.NumberNode = NumberNode;
})(TextureGen);

(function(TextureGen) {
  'use strict';

  class NumberNode extends TextureGen.BaseNode {
    constructor(id) {
      super(id, 'Number', []);

      var input = document.createElement('input');
      input.type = 'number';
      this.input = input;
      var that = this;
      input.addEventListener('input', function() {
        that.setValue(input.value);
      });
      this.domNode.appendChild(input);

      this.value = this.input.value = 1;
    }

    setValue(value) {
      this.value = value;

      if (this.input.value != value) {
        this.input.value = value;
      }

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

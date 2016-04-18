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

      var start = this.input.selectionStart,
          end = this.input.selectionEnd;

      this.input.value = value;

      this.input.setSelectionRange(start, end);

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

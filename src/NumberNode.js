(function(TextureGen) {
  'use strict';

  function NumberNode(id) {
    TextureGen.BaseNode.call(this, id, 'Number', []);
    this.value = {r: 255, g: 255, b: 255, a: 255};

    var input = document.createElement('input');
    input.type = 'number';
    var that = this;
    input.addEventListener('change', function() {
      that.setValue(input.value);
    });
    this.domNode.appendChild(input);
  }

  NumberNode.prototype = Object.create(TextureGen.BaseNode.prototype, {
    setValue: {
      value: function(value) {
        this.value = value;

        for(var key in this.outputs) {
          this.outputs[key].dirty = true;
          this.outputs[key].render();
        }
      }
    },

    getOutput: {
      value: function() {
        return this.value;
      }
    }
  });

  TextureGen.NumberNode = NumberNode;
})(TextureGen);

(function(TextureGen) {
  'use strict';

  function ColorNode(id) {
    TextureGen.BaseNode.call(this, id, 'Color', []);
    this.value = {r: 0, g: 0, b: 0, a: 255};
    this.domNode.innerHTML += JSON.stringify(this.getOutput());
  }

  ColorNode.prototype = Object.create(TextureGen.BaseNode.prototype, {
    setValue: {
      value: function(r, g, b, a) {
        this.value.r = r; 
        this.value.g = g; 
        this.value.b = b; 
        this.value.a = a; 

        for(var i = 0; i < this.outputs.length; i++) {
          this.outputs[i].dirty = true;
          this.outputs[i].render();
        }
      }
    },

    getOutput: {
      value: function() {
        return {
          r: this.value.r,
          g: this.value.g,
          b: this.value.b,
          a: this.value.a
        };
      }
    }
  });

  TextureGen.ColorNode = ColorNode;
})(TextureGen);

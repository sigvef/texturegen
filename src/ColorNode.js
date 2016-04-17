(function(TextureGen) {
  'use strict';

  function hexColorToRGB(hex) {
    var r = Number.parseInt(hex.slice(0, 2), 16);
    var g = Number.parseInt(hex.slice(2, 4), 16);
    var b = Number.parseInt(hex.slice(4, 6), 16);
    return {r: r, g: g, b: b};
  }

  function ColorNode(id) {
    TextureGen.BaseNode.call(this, id, 'Color', []);
    this.value = {r: 0, g: 0, b: 0, a: 255};

    var jscolor = document.createElement('input');
    jscolor.classList.add('jscolor');
    var that = this;
    jscolor.addEventListener('change', function() {
      var rgb = hexColorToRGB(jscolor.value);
      that.setValue(rgb.r, rgb.g, rgb.b, that.getOutput().a);
    });
    this.domNode.appendChild(jscolor);
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

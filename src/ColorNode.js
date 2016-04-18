(function(TextureGen, jscolor) {
  'use strict';

  function hexColorToRGB(hex) {
    var r = Number.parseInt(hex.slice(0, 2), 16);
    var g = Number.parseInt(hex.slice(2, 4), 16);
    var b = Number.parseInt(hex.slice(4, 6), 16);
    return {r: r, g: g, b: b, a: 255};
  }

  function leftpad(hex) {
    return hex.length == 1 ? '0' + hex : hex;
  }

  function RGBColorToHex(rgb) {
    var r = leftpad(rgb.r.toString(16));
    var g = leftpad(rgb.g.toString(16));
    var b = leftpad(rgb.b.toString(16));
    return (r + g + b).toUpperCase();
  }

  class ColorNode extends TextureGen.BaseNode {
    constructor(id) {
      super(id, 'Color', []);
      this.type = 'ColorNode';
      this.value = {r: 255, g: 255, b: 255, a: 255};

      var input = document.createElement('input');
      input.classList.add('jscolor');
      var that = this;
      this.input = input;
      input.addEventListener('change', function() {
        that.setValue(input.value);
      });
      new jscolor(this.input);
      this.domNode.appendChild(input);
    }

    setValue(color) {
      if(typeof(color) == 'string') {
        color = hexColorToRGB(color);
      }
      this.value.r = color.r;
      this.value.g = color.g;
      this.value.b = color.b;
      this.value.a = color.a;
      this.input.value = RGBColorToHex(this.value);

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }

    getOutput() {
      return {
        r: this.value.r,
        g: this.value.g,
        b: this.value.b,
        a: this.value.a
      };
    }
  }

  TextureGen.ColorNode = ColorNode;
})(TextureGen, jscolor);

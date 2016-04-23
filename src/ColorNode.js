(function(TextureGen, $) {
  'use strict';

  function hexColorToRGB(hex) {
    var r = Number.parseInt(hex.slice(0, 2), 16);
    var g = Number.parseInt(hex.slice(2, 4), 16);
    var b = Number.parseInt(hex.slice(4, 6), 16);
    return new TextureGen.ColorValue(r, g, b, 255);
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

  class ColorNode extends TextureGen.ValueNode {
    constructor(id) {
      super(id, 'Color', []);

      var colorPickerNode = document.createElement('div');
      var that = this;
      this.domNode.appendChild(colorPickerNode);
      this.colorPicker = $(colorPickerNode).ColorPicker({
        flat: true,
        onChange: function(hsb, hex, rgb) {
          that.setValue(hex);
        }
      });
      this.domNode.style.minWidth = '407px';
      this.value = new TextureGen.ColorValue(255, 0, 0, 255);
    }

    setValue(color) {
      if (color.constructor.name == 'ColorValue') {
        this.value = color.clone();
      } else if(typeof(color) == 'string') {
        this.value = hexColorToRGB(color);
      } else {
        this.value = new TextureGen.ColorValue(color.r, color.g, color.b, color.a);
      }
      this.colorPicker.ColorPickerSetColor(RGBColorToHex(this.value));

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.ColorNode = ColorNode;
})(TextureGen, jQuery);

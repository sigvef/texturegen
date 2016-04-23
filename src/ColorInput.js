(function(TextureGen, $) {
  'use strict';

  class ColorInput extends TextureGen.BaseInput {
    constructor(options) {
      super(options);

      this.widget = document.createElement('div');
      this.widget.classList.add('widget');
      var colorPickerNode = document.createElement('div');
      this.widget.appendChild(colorPickerNode);
      var that = this;
      this.colorPicker = $(colorPickerNode).ColorPicker({
        flat: true,
        onChange: function(hsb, hex, rgb) {
          that.setValue(hex);
        }
      });
      this.widget.style.width = '355px';
      this.domNode.appendChild(this.widget);
      setTimeout(function() {
        if(that.value === undefined) {
          that.setValue(options.default);
        }
      });
    }

    setValue(value) {
      this.value = value;
      this.colorPicker.ColorPickerSetColor(this.value);
      this.node.dirty = true;
      this.node.render();
    }

    getOutput() {
      return this.value;
    }
  }

  TextureGen.ColorInput = ColorInput;
})(TextureGen, jQuery);

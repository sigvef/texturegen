(function(TextureGen) {
  'use strict';

  class NumberInput extends TextureGen.BaseInput {
    constructor(options) {
      super(options);
      this.widget = document.createElement('div');
      this.widget.classList.add('widget');
      this.numberInput = document.createElement('input');
      this.numberInput.type = 'number';
      this.numberInput.value = this.options.default;
      this.rangeInput = document.createElement('input');
      this.rangeInput.type = 'range';
      this.rangeInput.min = this.options.min;
      this.rangeInput.max = this.options.max;
      this.rangeInput.step = this.options.step;
      this.rangeInput.value = this.options.default;
      this.widget.appendChild(this.numberInput);
      this.widget.appendChild(this.rangeInput);

      var that = this;
      this.rangeInput.addEventListener('input', function() {
        that.setValue(that.rangeInput.value);
      });

      this.numberInput.addEventListener('input', function() {
        that.setValue(that.numberInput.value);
      });

      this.domNode.appendChild(this.widget);
    }

    getOutput() {
      return this.numberInput.value;
    }

    setValue(value) {
      if (this.numberInput.value != value) {
        this.numberInput.value = value;
      }
      if (this.rangeInput.value != value) {
        this.rangeInput.value = value;
      }
      this.node.dirty = true;
    }
  }

  TextureGen.NumberInput = NumberInput;
})(TextureGen);

(function(TextureGen) {
  'use strict';

  class ChoiceInput extends TextureGen.BaseInput {
    constructor(options) {
      super(options);
      this.widget = document.createElement('div');
      this.widget.classList.add('widget');

      this.select = document.createElement('select');
      for (var i=0; i < options.choices.length; i++) {
        var el = document.createElement('option');
        el.value = options.choices[i].value;
        el.textContent = options.choices[i].name;
        if (options.choices[i].selected) {
          el.selected = true;
        }
        this.select.appendChild(el);
      }
      this.widget.appendChild(this.select);

      this.select.addEventListener('change', function() {
        this.setValue(this.select.value);
      }.bind(this));

      this.domNode.appendChild(this.widget);
    }

    getOutput() {
      return this.select.value;
    }

    setValue(value) {
      this.select.value = value;
      this.node.dirty = true;
      this.node.render();
    }
  }

  TextureGen.ChoiceInput = ChoiceInput;
})(TextureGen);

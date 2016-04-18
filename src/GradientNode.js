(function(TextureGen, jscolor) {
  'use strict';

  class GradientNode extends TextureGen.BaseNode {
    constructor(id) {
      super(id, 'Gradient', []);
      this.type = 'GradientNode';

      var input = document.createElement('input');
      var that = this;
      this.input = input;
      input.addEventListener('change', function() {
        that.setValue(new TextureGen.GradientValue(0, 0, 512, 0, JSON.parse(input.value)));
      });
      this.setValue(new TextureGen.GradientValue(0, 0, 512, 0, [
        {offset: 0, color: 'red'},
        {offset: 0.7, color: 'orange'},      
        {offset: 1, color: 'white'}
      ]));
      this.domNode.appendChild(input);
    }

    setValue(gradient) {
      this.value = gradient;
      this.input.value = JSON.stringify(gradient.stops);

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }

    getOutput() {
      return this.value.clone();
    }
  }

  TextureGen.GradientNode = GradientNode;
})(TextureGen, jscolor);

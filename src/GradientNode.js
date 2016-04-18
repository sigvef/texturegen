(function(TextureGen, jscolor, $) {
  'use strict';

  class GradientNode extends TextureGen.BaseNode {
    constructor(id) {
      super(id, 'Gradient', []);
      this.type = 'GradientNode';

      var that = this;

      this.widget = document.createElement('div');
      this.widget.classList.add('gradient-widget-wrapper');
      this.domNode.appendChild(this.widget);
      this.domNode.style.minWidth = '551px';
      var that = this;
      setTimeout(function() {
        $(that.widget).gradientPicker({
          controlPoints: that.value.stops.map(function(stop) {
            return `${stop.color} ${stop.offset * 100}%`;
          }),
          change: function(points, styles) {
            that.setValue(new TextureGen.GradientValue(0, 0, 512, 0, points.map(function(el) {
              return {offset: el.position, color: el.color};
            })), true);
          }
        });
      });
      this.setValue(new TextureGen.GradientValue(0, 0, 512, 0, [
        {offset: 0, color: 'red'},
        {offset: 0.7, color: 'orange'},      
        {offset: 1, color: 'white'}
      ]));
    }

    setValue(gradient) {
      if (gradient.constructor.name == 'GradientValue') {
        this.value = gradient;
      } else {
        this.value = new TextureGen.GradientValue(
          gradient.x0,
          gradient.y0,
          gradient.x1,
          gradient.y1,
          gradient.stops
        );
      }

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
})(TextureGen, jscolor, jQuery);

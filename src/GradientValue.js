(function(TextureGen) {
  'use strict';

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  class GradientValue extends TextureGen.BaseValue {
    constructor(x0, y0, x1, y1, stops) {
      super();
      this.x0 = x0;
      this.y0 = y0;
      this.x1 = x1;
      this.y1 = y1;
      this.stops = JSON.parse(JSON.stringify(stops));
    }

    clone() {
      return new GradientValue(this.x0, this.y0,
                               this.x1, this.y1,
                               this.stops);
    }

    toCanvasStyle() {
      var gradient = ctx.createLinearGradient(this.x0, this.y0, this.x1, this.y1);
      for(var i = 0; i < this.stops.length; i++) {
        var stop = this.stops[i];
        gradient.addColorStop(stop.offset, stop.color);
      }
      return gradient;
    }
  }


  TextureGen.GradientValue = GradientValue;
})(TextureGen);

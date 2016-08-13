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
      this.canvas = document.createElement('canvas');
      this.canvas.width = 256;
      this.canvas.height = 1;
      this.ctx = this.canvas.getContext('2d');
    }

    clone() {
      return new GradientValue(this.x0, this.y0,
                               this.x1, this.y1,
                               this.stops);
    }

    getOutput() {
      this.x0 = 0;
      this.y0 = 0;
      this.x1 = 256;
      this.y1 = 0;
      var gradient = this.toCanvasStyle();
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, 256, 1);
      return this.canvas;
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

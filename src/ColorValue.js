(function(TextureGen) {
  'use strict';

  class ColorValue extends TextureGen.BaseValue {
    constructor(r, g, b, a) {
      super();
      if(typeof r == 'string') {
        var hex = r;
        this.r = Number.parseInt(hex.slice(0, 2), 16);
        this.g = Number.parseInt(hex.slice(2, 4), 16);
        this.b = Number.parseInt(hex.slice(4, 6), 16);
        this.a = 255;
      } else {
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 0;
      }
    }

    clone() {
      return new ColorValue(this.r, this.g, this.b, this.a);
    }

    toCanvasStyle() {
      return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 255})`;
    }
  }


  TextureGen.ColorValue = ColorValue;
})(TextureGen);

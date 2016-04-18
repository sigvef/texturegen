(function(TextureGen) {
  'use strict';

  class ColorValue extends TextureGen.BaseValue {
    constructor(r, g, b, a) {
      super();
      this.r = r || 0;
      this.g = g || 0;
      this.b = b || 0;
      this.a = a || 0;
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

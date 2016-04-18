(function(TextureGen) {
  'use strict';

  class CanvasNode extends TextureGen.BaseNode {
    constructor(id, title, inputNames) {
      super(id, title, inputNames);
      this.type = 'CanvasNode';
      this.canvas = document.createElement('canvas');
      this.canvas.width = 512;
      this.canvas.height = 512;
      this.ctx = this.canvas.getContext('2d');
      this.imageData = new ImageData(512, 512);
      this.domNode.appendChild(this.canvas);
    }

    getOutput() {
      return this.imageData;
    }
  }

  TextureGen.CanvasNode = CanvasNode;
})(TextureGen);

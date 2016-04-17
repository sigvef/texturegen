(function(TextureGen) {
  'use strict';

  function CanvasNode(id, title, inputNames) {
    TextureGen.BaseNode.call(this, id, title, inputNames);
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.ctx = this.canvas.getContext('2d');
    this.imageData = new ImageData(512, 512);
    this.domNode.appendChild(this.canvas);
  }

  CanvasNode.prototype = Object.create(TextureGen.BaseNode.prototype, {
    getOutput: {
      value: function() {
        return this.imageData;
      }
    },
  });

  TextureGen.CanvasNode = CanvasNode;
})(TextureGen);

(function(TextureGen) {
  'use strict';

  function CanvasNode(title) {
    TextureGen.BaseNode.call(this);
    this.dirty = true;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.ctx = this.canvas.getContext('2d');
    this.imageData = new ImageData(512, 512);

    this.domNode = document.createElement('div');
    this.domNode.classList.add('node');
    var titleNode = document.createElement('h1');
    this.domNode.appendChild(titleNode);
    titleNode.innerText = title;
    this.domNode.appendChild(this.canvas);
  }

  CanvasNode.prototype = Object.create(TextureGen.BaseNode.prototype, {
    getOutput: {
      value: function() {
        return this.imageData;
      }
    },

    render: {
      value: function() {
        throw 'Not implemented';
      }
    }
  });

  TextureGen.CanvasNode = CanvasNode;
})(TextureGen);

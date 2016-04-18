(function(TextureGen) {
  'use strict';

  class MotionBlurNode extends TextureGen.CanvasNode {
    constructor(id) {
      super(id, 'MotionBlur', ['Image', 'Intensity']);
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var imageData = this.getInput('Image') || new ImageData(512, 512);
      var intensity = this.getInput('Intensity');
      this.imageData = texturegen.motionBlur(imageData, intensity);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.dirty = false;

      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
        this.outputs[key].render();
      }
    }
  }

  TextureGen.MotionBlurNode = MotionBlurNode;
})(TextureGen);

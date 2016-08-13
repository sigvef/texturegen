(function(TextureGen) {
  'use strict';

  class GraphInput extends TextureGen.BaseInput {
    constructor(options) {
      super(options);
    }

    getOutput() {
      if(this.value) {
        return this.value.getOutput();
      }
    }

    setValue(value) {
      this.value = value;
      this.node.dirty = true;
    }
  }

  TextureGen.GraphInput = GraphInput;
})(TextureGen);

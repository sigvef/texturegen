(function(TextureGen) {
  'use strict';

  class ValueNode extends TextureGen.BaseNode {
    getOutput() {
      return this.value.clone();
    }
  }

  TextureGen.ValueNode = ValueNode;
})(TextureGen);

(function(global) {
  'use strict';

  function BaseNode() {
    this.inputs = {};
    this.outputs = [];
  }

  BaseNode.prototype.getOutput = function() {
    throw 'Not implemented.';
  };

  BaseNode.prototype.setInput = function(key, value) {
    this.inputs[key] = value; 
    this.dirty = true;
    var that = this;
    that.render();
  };

  BaseNode.prototype.addOutput = function(output) {
    this.outputs[this.outputs.length] = output;
  }

  global.TextureGen.BaseNode = BaseNode;
})(this);

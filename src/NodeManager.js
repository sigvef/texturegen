(function(global) {
  'use strict';

  function NodeManager(editorDom) {
    this.nodes = [];
    this.index = 0;
    this.editorDom = editorDom;
  }

  NodeManager.prototype.createNode = function(Node) {
    var node = new Node(this.index++);
    this.nodes[node.id] = node;
    this.editorDom.appendChild(node.domNode);
    return node;
  };

  NodeManager.prototype.disconnect = function(id, inputName) {
    var node = this.nodes[id];
    var outputNode = node.inputs[inputName];
    if(outputNode) {
      delete outputNode.outputs[id + '-' + inputName];
    }
    delete node.inputs[inputName];
  };

  NodeManager.prototype.connect = function(fromId, toId, inputName) {
    var fromNode = this.nodes[fromId];
    var toNode = this.nodes[toId];
    this.disconnect(toId, inputName);
    toNode.inputs[inputName] = fromNode;
    fromNode.outputs[toId + '-' + inputName] = toNode;
    toNode.dirty = true;
    toNode.render();
  };

  global.TextureGen.NodeManager = NodeManager;
})(this);

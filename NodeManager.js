(function(global) {
  'use strict';

  function NodeManager(editorDom) {
    this.nodes = [];
    this.index = 0;
    this.editorDom = editorDom;
  }

  NodeManager.prototype.createNode = function(Node) {
    var node = new Node();
    node.id = this.index++;
    this.nodes[node.id] = node;
    this.editorDom.appendChild(node.domNode);
    return node;
  };

  global.TextureGen.NodeManager = NodeManager;
})(this);

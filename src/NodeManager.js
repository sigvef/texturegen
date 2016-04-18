(function(global) {
  'use strict';

  class NodeManager {
    constructor(editorDom) {
      this.nodes = {};
      this.index = 0;
      this.editorDom = editorDom;
      this.nodeZStack = [];
    }

    createNode(Node, optionalId) {
      var id = typeof(optionalId) != 'undefined'
                                  ? optionalId
                                  : this.index++;
      var node = new Node(id);
      this.nodes[node.id] = node;
      this.editorDom.appendChild(node.domNode);
      this.nodeZStack.push(node);
      return node;
    }

    moveNodeToFront(id, shouldUpdateCss) {
      var node = this.nodes[id];
      for(var i = 0; i < this.nodeZStack.length; i++) {
        if(this.nodeZStack[i] == node) {
          break;
        }
      }
      this.nodeZStack.splice(i, 1);
      this.nodeZStack.push(node);
      if(shouldUpdateCss) {
        for(var i = 0; i < this.nodeZStack.length; i++) {
          var domNode = this.nodeZStack[i].domNode;
          domNode.style.zIndex = i;
        }
      }
    }

    selectNode(id) {
      for(var key in this.nodes) {
        this.nodes[key].domNode.classList.remove('selected');
      }
      this.nodes[id].domNode.classList.add('selected');
      for(var key in this.nodes[id].inputs) {
        if(!this.nodes[id].inputs[key]) {
          continue;
        }
        this.moveNodeToFront(this.nodes[id].inputs[key].id);
      }
      for(var key in this.nodes[id].outputs) {
        if(!this.nodes[id].outputs[key]) {
          continue;
        }
        this.moveNodeToFront(this.nodes[id].outputs[key].id);
      }
      this.moveNodeToFront(id, true);
    }

    disconnect(id, inputName) {
      var node = this.nodes[id];
      var outputNode = node.inputs[inputName];
      if(outputNode) {
        delete outputNode.outputs[id + '-' + inputName];
      }
      delete node.inputs[inputName];
    }

    connect(fromId, toId, inputName) {
      var fromNode = this.nodes[fromId];
      var toNode = this.nodes[toId];
      this.disconnect(toId, inputName);
      toNode.inputs[inputName] = fromNode;
      fromNode.outputs[toId + '-' + inputName] = toNode;
      toNode.dirty = true;
      toNode.render();
    }

    exportData() {
      var jsonNodes = [];
      for(var key in this.nodes) {
        var node = this.nodes[key];
        var serializable = {};
        serializable.type = node.constructor.name;
        serializable.id = node.id;
        serializable.inputs = {};
        var hasNoInputs = true;
        for(var key in node.inputs) {
          hasNoInputs = false;
          serializable.inputs[key] = node.inputs[key] ? node.inputs[key].id
                                                      : undefined;
        }
        if(hasNoInputs) {
          serializable.value = node.getOutput();
        }
        jsonNodes.push(serializable);
      }
      return JSON.stringify(jsonNodes);
    }

    importData(json) {
      this.nodes = [];
      this.editorDom.innerHTML = '';
      var serializedNodes = JSON.parse(json);
      var highestId = 0;
      for(var i = 0; i < serializedNodes.length; i++) {
        var serializedNode = serializedNodes[i];
        var node = this.createNode(global.TextureGen[serializedNode.type], serializedNode.id);
        if(node.id > highestId) {
          highestId = node.id;
        }
      }
      this.index = highestId + 1;
      for(var i = 0; i < serializedNodes.length; i++) {
        var serializedNode = serializedNodes[i];
        var node = this.nodes[serializedNode.id];
        if(serializedNode.value) {
          node.setValue(serializedNode.value);
        }
        for(var key in serializedNode.inputs) {
          this.connect(serializedNode.inputs[key], node.id, key);
        }
        node.dirty = true;
        node.render();
      }
    }
  }

  global.TextureGen.NodeManager = NodeManager;
})(this);

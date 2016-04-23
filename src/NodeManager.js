(function(global) {
  'use strict';

  class NodeManager {
    constructor(editorDom) {
      this.nodes = {};
      this.index = 0;
      this.editorDom = editorDom;
      this.nodeZStack = [];
      this.selectedNode = -1;

      var that = this;
      function loadStoreDirtyCheckerLoop() {
        for(var key in that.nodes) {
          var node = that.nodes[key];
          if(node.constructor.name != 'LoadStoreNode') {
            continue;
          }
          if(node.input &&
             TextureGen.LoadStore[node.input.value] &&
             TextureGen.LoadStore[node.input.value].updated) {
            TextureGen.LoadStore[node.input.value].updated = false;
            node.dirty = true;
            node.render();
            /* break after first found dirty load node to give
             * control back to the browser as soon as possible. */
            break;
          }
        }
        requestAnimationFrame(loadStoreDirtyCheckerLoop);
      }
      requestAnimationFrame(loadStoreDirtyCheckerLoop);
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

    deleteNode(id) {
      var node = this.nodes[id];
      for (var key in node.inputs) {
        if (this.nodes[id].inputs[key] instanceof TextureGen.GraphInput) {
          this.disconnect(node.id, key);
        }
      }
      for (var key in node.outputs) {
        var inputName = key.split('-')[1];
        this.disconnect(node.outputs[key].id, inputName);
      }
      if(node.id == this.selectedNode) {
        this.selectedNode = -1;
      }
      this.editorDom.removeChild(node.domNode);
      for (var i = 0; i < this.nodeZStack.length; i++) {
        if (this.nodeZStack[i] == node) {
          this.nodeZStack.splice(i, 1);
          break;
        }
      }
      delete this.nodes[node.id];
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
        if(this.nodes[id].inputs[key] instanceof TextureGen.GraphInput) {
          continue;
        }
        if(this.nodes[id].inputs[key].value) {
          this.moveNodeToFront(this.nodes[id].inputs[key].value.id);
        }
      }
      for(var key in this.nodes[id].outputs) {
        if(!this.nodes[id].outputs[key]) {
          continue;
        }
        this.moveNodeToFront(this.nodes[id].outputs[key].id);
      }
      this.moveNodeToFront(id, true);
      this.selectedNode = id;
    }

    disconnect(id, inputName) {
      var node = this.nodes[id];
      var outputNode = node.inputs[inputName].value;
      if(outputNode) {
        delete outputNode.outputs[id + '-' + inputName];
      }
      node.inputs[inputName].setValue(undefined);
    }

    connect(fromId, toId, inputName) {
      var fromNode = this.nodes[fromId];
      var toNode = this.nodes[toId];
      this.disconnect(toId, inputName);
      toNode.inputs[inputName].setValue(fromNode);
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
        serializable.left = node.domNode.style.left;
        serializable.top = node.domNode.style.top;
        serializable.width = node.domNode.style.width;
        for(var key in node.inputs) {
          if(node.inputs[key] instanceof TextureGen.GraphInput) {
            serializable.inputs[key] = node.inputs[key].value ? node.inputs[key].value.id
                                                              : undefined;
          } else {
            serializable.inputs[key] = node.inputs[key].getOutput();
          }
        }
        jsonNodes.push(serializable);
      }
      return JSON.stringify({
        nodes: jsonNodes,
        selectedNode: this.selectedNode,
        zStack: this.nodeZStack.map(function(node) {
          return node.id;
        })
      });
    }

    importData(json) {
      this.nodes = [];
      this.editorDom.innerHTML = '';
      var data = JSON.parse(json);
      var highestId = 0;
      for(var i = 0; i < data.nodes.length; i++) {
        var serializedNode = data.nodes[i];
        var node = this.createNode(global.TextureGen[serializedNode.type], serializedNode.id);
        if(node.id > highestId) {
          highestId = node.id;
        }
      }
      this.index = highestId + 1;
      for(var i = 0; i < data.nodes.length; i++) {
        var serializedNode = data.nodes[i];
        var node = this.nodes[serializedNode.id];
        for(var key in serializedNode.inputs) {
          if(node.inputs[key] instanceof TextureGen.GraphInput) {
            this.connect(serializedNode.inputs[key], node.id, key);
          } else {
            node.inputs[key].setValue(serializedNode.inputs[key]);
          }
        }
        node.domNode.style.left = serializedNode.left;
        node.domNode.style.top = serializedNode.top;
        node.domNode.style.width = serializedNode.width;
        node.dirty = true;
        node.render();
      }
      if(data.selectedNode != -1) {
        this.selectNode(data.selectedNode);
      }
      var that = this;
      this.nodeZStack = data.zStack.map(function(id) {
        return that.nodes[id];
      });
    }
  }

  global.TextureGen.NodeManager = NodeManager;
})(this);

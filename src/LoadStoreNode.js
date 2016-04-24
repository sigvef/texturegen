(function(TextureGen) {
  'use strict';

  TextureGen.LoadStore = TextureGen.LoadStore || {};

  class LoadStoreNode extends TextureGen.BaseNode {
    constructor(id) {
      super(id, 'LoadStore', [new TextureGen.GraphInput({name: 'Value'})]);
      this.input = document.createElement('input');
      this.domNode.appendChild(this.input);
      this.input.classList.add('short');
      var that = this;
      this.input.addEventListener('change', function() {
        that.dirty = true; 
      });
    }

    getOutput() {
      return (TextureGen.LoadStore[this.input.value] || {}).value;
    }

    render() {
      if(!this.dirty) {
        return;
      }
      var value = this.getInput('Value');
      if(typeof(value) != undefined &&
         (!TextureGen.LoadStore[this.input.value] ||
          value !== TextureGen.LoadStore[this.input.value].value)) {
        TextureGen.LoadStore[this.input.value] = {value: value, updated: true};
      }

      this.dirty = false;
      for(var key in this.outputs) {
        this.outputs[key].dirty = true;
      }
    }
  }

  TextureGen.LoadStoreNode = LoadStoreNode;
})(TextureGen);

(function(global) {
  'use strict';

  function render(html) {
    var element = document.createElement('div');
    element.innerHTML = html;
    return element.firstChild;
  }

  class BaseNode {
    constructor(id, title, inputs) {
      this.id = id;
      this.dirty = true;
      this.inputs = {};
      for(var i = 0; i < inputs.length; i++) {
        this.inputs[inputs[i].options.name] = inputs[i];
        inputs[i].node = this;
      }
      this.outputs = {};
      this.domNode = render([
        '<div class=node>',
        '<div class=delete>X</div>',
        '<div class=id></div>',
        '<h1 class=title></h1>',
        '<div class=inputs></div>',
        '<div class=output><div class=icon>▷</div><p class=name>Output</p></div>',
        '</div>'
      ].join(''));

      this.domNode.dataset.id = this.id;

      this.domNode.querySelector('.id').innerText = '#' + this.id;
      this.domNode.querySelector('.title').innerText = title;
      this.domOutput = this.domNode.querySelector('.output');

      var domInputs = this.domNode.querySelector('.inputs');
      this.domInputs = {};
      for(var key in this.inputs) {
        domInputs.appendChild(this.inputs[key].domNode);
        this.domInputs[key] = this.inputs[key].domNode;
      }

      var that = this;
      setTimeout(function() {
        that.render();
      });
    }

    getInput(inputName) {
      if(this.inputs[inputName]) {
        return this.inputs[inputName].getOutput();
      }
    }

    getOutput() {
      throw 'Not implemented.';
    }

    render() {
      this.dirty = false;
    }
  }

  global.TextureGen.BaseNode = BaseNode;
})(this);

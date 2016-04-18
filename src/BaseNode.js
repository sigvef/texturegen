(function(global) {
  'use strict';

  function render(html) {
    var element = document.createElement('div');
    element.innerHTML = html;
    return element.firstChild;
  }

  class BaseNode {
    constructor(id, title, inputNames) {
      this.type = 'BaseNode';
      this.id = id;
      this.dirty = true;
      if(!inputNames) {
        throw 'Need input names!';
      }
      this.inputs = {};
      for(var i = 0; i < inputNames.length; i++) {
        this.inputs[inputNames[i]] = undefined;
      }
      this.outputs = {};
      this.domNode = render([
        '<div class=node>',
        '<div class=id></div>',
        '<h1 class=title></h1>',
        '<ul class=inputs></ul>',
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
        var domInput = render('<li class=input><div class=icon>⎆</div><p class=name></p></li>');
        domInput.querySelector('.name').innerText = key;
        domInput.dataset.name = key;
        domInputs.appendChild(domInput);
        this.domInputs[key] = domInput;
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

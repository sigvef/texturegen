(function(global) {
  'use strict';

  function render(html) {
    var element = document.createElement('div');
    element.innerHTML = html;
    return element.firstChild;
  }

  function BaseNode(id, title, inputNames) {
    this.id = id;
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

    var domInputs = this.domNode.querySelector('.inputs');
    for(var key in this.inputs) {
      var domInput = render('<li class=input><div class=icon>⎆</div><p class=name></p></li>');
      domInput.querySelector('.name').innerText = key;
      domInput.dataset.name = key;
      domInputs.appendChild(domInput);
    }
  }

  BaseNode.prototype.getOutput = function() {
    throw 'Not implemented.';
  };

  BaseNode.prototype.render = function() {
    throw 'Not implemented.';
  };

  global.TextureGen.BaseNode = BaseNode;
})(this);

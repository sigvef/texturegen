(function(TextureGen) {
  'use strict';

  class BaseInput {
    constructor(options) {
      this.options = options;
      this.domNode = document.createElement('div');
      this.domNode.classList.add('input');
      this.domNode.innerHTML = '<div class=icon>⎆</div><p class=name></p>';
      this.domNode.querySelector('.name').innerText = options.name;
      this.domNode.dataset.name = options.name;
      var that = this;
      this.domNode.querySelector('.icon').addEventListener('click', function() {
        that.widget.style.display = that.widget.style.display == 'block' ? 'none' : 'block';
      });
    }

    getOutput() {
    }
  }

  TextureGen.BaseInput = BaseInput;
})(TextureGen);

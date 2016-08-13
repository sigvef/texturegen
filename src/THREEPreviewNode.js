(function(TextureGen, THREE) {
  'use strict';

  function makeMapBundle() {
    var bundle = {};
    bundle.canvas = document.createElement('canvas');
    bundle.canvas.width = 512;
    bundle.canvas.height = 512;
    bundle.ctx = bundle.canvas.getContext('2d');
    bundle.texture = new THREE.Texture(bundle.canvas);
    bundle.texture.wrapS = THREE.RepeatWrapping;
    bundle.texture.wrapT = THREE.RepeatWrapping;
    bundle.texture.repeat.set(1, 1);
    bundle.texture.needsUpdate = true;
    return bundle;
  }

  function updateMapBundle(bundle, input, repeat) {
    if(!input) {
      return;
    }
    bundle.ctx.drawImage(input, 0, 0);
    bundle.texture.repeat.set(repeat, repeat);
    bundle.texture.needsUpdate = true;
    return bundle.texture;
  }

  class THREEPreviewNode extends TextureGen.BaseNode {
    constructor(id) {
      super(id, 'THREEPreview', [
        new TextureGen.ChoiceInput({
          name: 'Rotate',
          choices: [
            {name: 'Yes', value: 'yes', selected: true},
            {name: 'No', value: 'no'}
          ]
        }),
        new TextureGen.ChoiceInput({
          name: 'geometry',
          choices: [
            {name: 'Box', value: 'BoxGeometry', selected: true},
            {name: 'Sphere', value: 'SphereGeometry'},
            {name: 'Cylinder', value: 'CylinderGeometry'},
            {name: 'Torus', value: 'TorusGeometry'},
            {name: 'TorusKnot', value: 'TorusKnotGeometry'},
            {name: 'Plane', value: 'PlaneGeometry'}
          ]
        }),
        new TextureGen.GraphInput({name: 'map'}),
        new TextureGen.GraphInput({name: 'lightmap'}),
        new TextureGen.GraphInput({name: 'aomap'}),
        new TextureGen.GraphInput({name: 'emissivemap'}),
        new TextureGen.GraphInput({name: 'bumpmap'}),
        new TextureGen.GraphInput({name: 'displacementmap'}),
        new TextureGen.GraphInput({name: 'roughnessmap'}),
        new TextureGen.GraphInput({name: 'metalnessmap'}),
        new TextureGen.GraphInput({name: 'alphamap'}),
        new TextureGen.NumberInput({
          name: 'repeat',
          min: 1,
          max: 16,
          step: 1,
          default: 1
        })
      ]);

      this.map = makeMapBundle();
      this.lightMap = makeMapBundle();
      this.aoMap = makeMapBundle();
      this.emissiveMap = makeMapBundle();
      this.bumpMap = makeMapBundle();
      this.displacementMap = makeMapBundle();
      this.roughnessMap = makeMapBundle();
      this.metalnessMap = makeMapBundle();
      this.alphaMap = makeMapBundle();
      this.renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true  
      });
      this.renderer.setSize(512, 512);
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
      this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
      this.controls.rotateSpeed = 5;
      this.camera.position.z = 5;
      this.model = new THREE.Mesh(
          new THREE.BoxGeometry(200, 200, 200),
          new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide
          }));
      this.scene.add(this.model);
      var light = new THREE.SpotLight(0xFFFFFF, 1);
      light.position.set(500, 500, 500);
      light.lookAt(new THREE.Vector3(0, 0, 0));
      this.scene.add(light);
      var sun = new THREE.DirectionalLight(0xFFFFFF, 0.5);
      sun.position.set(0, 1, 1);
      this.scene.add(sun);
      this.scene.add(new THREE.AmbientLight(0x222222));
      this.model.rotation.set(1, 1, 1);
      this.domNode.appendChild(this.renderer.domElement);

      var that = this;
      function internalRenderLoop() {
          requestAnimationFrame(internalRenderLoop);
          if(that.getInput('Rotate') == 'yes') {
            that.model.rotation.x += 0.01;
            that.model.rotation.y += 0.02;
          }
          that.controls.handleResize();
          that.controls.update();
          that.renderer.render(that.scene, that.camera);
      }
      internalRenderLoop();
    }

    render() {
      if(!this.dirty) {
        return;
      }
      this.dirty = false;
      var material = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
      var repeat = this.getInput('repeat') || 1;
      material.map = updateMapBundle(
          this.map, this.getInput('map'), repeat);
      material.lightMap = updateMapBundle(
          this.lightMap, this.getInput('lightmap'), repeat);
      material.aoMap = updateMapBundle(
          this.aoMap, this.getInput('aomap'), repeat);
      material.emissiveMap = updateMapBundle(
          this.emissiveMap, this.getInput('emissivemap'), repeat);
      material.bumpMap = updateMapBundle(
          this.bumpMap, this.getInput('bumpmap'), repeat);
      material.displacementMap = updateMapBundle(
          this.displacementMap, this.getInput('displacementmap'), repeat);
      material.roughnessMap = updateMapBundle(
          this.roughnessMap, this.getInput('roughnessmap'), repeat);
      material.metalnessMap = updateMapBundle(
          this.metalnessMap, this.getInput('metalnessmap'), repeat);
      material.alphaMap = updateMapBundle(
          this.alphaMap, this.getInput('alphamap'), repeat);

      this.model.material = material;

      var geometryName = this.getInput('geometry');
      switch (geometryName) {
        case 'BoxGeometry':
          var geometry = new THREE.BoxGeometry(2, 2, 2);
          break;
        case 'SphereGeometry':
          var geometry = new THREE.SphereGeometry(1.5, 32, 32);
          break;
        case 'CylinderGeometry':
          var geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
          break;
        case 'TorusGeometry':
          var geometry = new THREE.TorusGeometry(1, 0.5, 16, 32);
          break;
        case 'TorusKnotGeometry':
          var geometry = new THREE.TorusKnotGeometry(1, 0.5);
          break;
        case 'PlaneGeometry':
          var geometry = new THREE.PlaneGeometry(2, 2);
          break;
        default:
          var geometry = new THREE.BoxGeometry(2, 2, 2);
      }

      this.model.geometry = geometry;
    }
  }

  TextureGen.THREEPreviewNode = THREEPreviewNode;
})(TextureGen, THREE);

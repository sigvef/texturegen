

function wood() {
  var imageData = new ImageData(512, 512);
  var sine = texturegen.circularSine(imageData, 256, 256, 20);
  var thresholdedSine = texturegen.blur(texturegen.threshold(sine, 1));
  var noise = texturegen.perlin(imageData, 1 / 128);
  var distorted = texturegen.distortX(thresholdedSine, noise, 0.2);
  var woodColor = texturegen.fill(imageData, 255, 165, 79);
  var composited = texturegen.multiply(woodColor, distorted);
  var fineNoise = texturegen.perlin(imageData);
  var motionBlur = texturegen.motionBlur(fineNoise, 0.4);
  var polar = texturegen.polar(motionBlur);
  var dark = texturegen.distortX(polar, noise, 0.2);
  composited = texturegen.multiply(composited, dark);
  return composited;
}

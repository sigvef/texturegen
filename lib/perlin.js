/* from http://gamedev.stackexchange.com/a/23705 */

var perlin2;

(function() {
  var perm = [];
  for(var i = 0; i < 256; i++) {
    perm[i] = i;
  }
  for (var i = 255; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0;
      var temp = perm[i];
      perm[i] = perm[j];
      perm[j] = temp;
  }
  for(var i = 256; i < 512; i++) {
    perm[i] = perm[i - 256];
  }
  var dirs = [];
  for(var i = 0; i < 256; i++) {
    dirs[i] = [Math.cos(i * 2 * Math.PI / 256),
               Math.sin(i * 2 * Math.PI / 256)];
  }

  function noise(x, y, per) {
      function surflet(gridX, gridY) {
          distX = Math.abs(x - gridX);
          distY = Math.abs(y - gridY);
          polyX = 1 - 6 * Math.pow(distX, 5) + 15 * Math.pow(distX, 4) - 10 * Math.pow(distX, 3);
          polyY = 1 - 6 * Math.pow(distY, 5) + 15 * Math.pow(distY, 4) - 10 * Math.pow(distY, 3);
          hashed = perm[perm[(gridX | 0) % per] + (gridY | 0) % per];
          grad = (x - gridX) * dirs[hashed][0] + (y - gridY) * dirs[hashed][1];
          return polyX * polyY * grad;
      }
      intX = x | 0;
      intY = y | 0;
      return (surflet(intX, intY) + surflet(intX + 1, intY) +
              surflet(intX, intY + 1) + surflet(intX + 1, intY + 1));
  }



  function fBm(x, y, per, octs) {
      var val = 0;
      for(var i = 0; i < octs; i++) {
          val += Math.pow(0.5, i) * noise(x * Math.pow(2, i), y * Math.pow(2, i), per * Math.pow(2, i));
      }
      return val;
  }

  perlin2 = function(x, y, size, freq, octs) {
    return fBm(x * freq, y * freq, (size * freq) | 0, octs);
  }
})();


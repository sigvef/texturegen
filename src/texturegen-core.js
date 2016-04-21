var texturegen = {};

(function() {

  function lerp(a, b, t) {
    return a + t * (b - a);
  }

  function getPixelNearestNeighbor(imageData, x, y) {
    x = Math.round(x + 0.5);
    y = Math.round(y + 0.5);
    x -= Math.floor(x / imageData.width) * imageData.width;
    y -= Math.floor(y / imageData.height) * imageData.height;
    var i = (y * imageData.width + x) * 4;
    return {
      r: imageData.data[i],
      g: imageData.data[i + 1],
      b: imageData.data[i + 2],
      a: imageData.data[i + 3]};
  }
  
  function getPixelLinear(imageData, x, y) {
    x -= Math.floor(x / imageData.width) * imageData.width;
    y -= Math.floor(y / imageData.height) * imageData.height;
    var xMix = x - (x | 0);
    var yMix = y - (y | 0);
    var leftTopPixel = getPixelNearestNeighbor(imageData, x | 0, y | 0);
    var rightTopPixel = getPixelNearestNeighbor(imageData, (x + 1) | 0, y | 0);
    var leftBottomPixel = getPixelNearestNeighbor(imageData, x | 0, (y + 1) | 0);
    var rightBottomPixel = getPixelNearestNeighbor(imageData, (x + 1) | 0, (y + 1) | 0);

    var blendedTopPixel = {
      r: lerp(leftTopPixel.r, rightTopPixel.r, xMix),
      g: lerp(leftTopPixel.g, rightTopPixel.g, xMix),
      b: lerp(leftTopPixel.b, rightTopPixel.b, xMix),
      a: lerp(leftTopPixel.a, rightTopPixel.a, xMix)
    };
    var blendedBottomPixel = {
      r: lerp(leftBottomPixel.r, rightBottomPixel.r, xMix),
      g: lerp(leftBottomPixel.g, rightBottomPixel.g, xMix),
      b: lerp(leftBottomPixel.b, rightBottomPixel.b, xMix),
      a: lerp(leftBottomPixel.a, rightBottomPixel.a, xMix)
    };

    var blendedPixel = {
      r: lerp(blendedTopPixel.r, blendedBottomPixel.r, yMix),
      g: lerp(blendedTopPixel.g, blendedBottomPixel.g, yMix),
      b: lerp(blendedTopPixel.b, blendedBottomPixel.b, yMix),
      a: lerp(blendedTopPixel.a, blendedBottomPixel.a, yMix)
    };

    return blendedPixel;
  }

  function forEachPixel(imageData, func) {
    var data = imageData.data;
    for (var x = 0; x < imageData.width; x++) {
      for (var y = 0; y < imageData.height; y++) {
        var i = (y * imageData.width + x) * 4;
        var color = func(x, y, data[i], data[i + 1], data[i + 2], data[i + 3]);
        data[i + 0] = color.r;
        data[i + 1] = color.g;
        data[i + 2] = color.b;
        data[i + 3] = color.a;
      }
    }
  }

  function clone(imageData) {
    var clonedData = new Uint8ClampedArray(imageData.data);
    imageData.data.set(clonedData);
    return new ImageData(clonedData, imageData.width, imageData.height);
  }

  texturegen.random = function(imageData, seed, randomAlpha) {
    /* ignore seed for now */
    imageData = clone(imageData);
    forEachPixel(imageData, function(x, y) {
      return {
        r: Math.random() * 255 | 0,
        g: Math.random() * 255 | 0,
        b: Math.random() * 255 | 0,
        a: randomAlpha ? Math.random() * 255 | 0 : 255
      };
    });
    return imageData;
  }

  texturegen.rotozoom = function(imageData, angle, translateX, translateY, scaleX, scaleY) {
    var resultImageData = clone(imageData);
    angle = angle / 180 * Math.PI;
    forEachPixel(resultImageData, function(x, y) {
      x -= imageData.width / 2;
      y -= imageData.height / 2;
      x += scaleX * translateX;
      x += scaleY * translateY;
      var rotozoomedX = scaleX * (Math.cos(angle) * x - Math.sin(angle) * y);
      var rotozoomedY = scaleY * (Math.sin(angle) * x + Math.cos(angle) * y);
      rotozoomedX -= scaleX * (Math.cos(angle) * translateX - Math.sin(angle) * translateY);
      rotozoomedY -= scaleY * (Math.sin(angle) * translateX + Math.cos(angle) * translateY);
      rotozoomedX += imageData.width / 2;
      rotozoomedY += imageData.height / 2;
      return getPixelLinear(imageData, rotozoomedX, rotozoomedY);
    });
    return resultImageData;
  }


  texturegen.colorize = function(imageData, gradientImageData) {
    var resultImageData = clone(imageData);
    for (var i = 0; i < imageData.data.length; i += 4) {
      resultImageData.data[i] = gradientImageData.data[imageData.data[i] * 4];
      resultImageData.data[i + 1] = gradientImageData.data[imageData.data[i] * 4 + 1];
      resultImageData.data[i + 2] = gradientImageData.data[imageData.data[i] * 4 + 2];
      resultImageData.data[i + 3] = gradientImageData.data[imageData.data[i] * 4 + 3];
    }
    return resultImageData;
  }

  texturegen.add = function(imageDataA, imageDataB) {
    var imageData = clone(imageDataA);
    for (var i = 0; i < imageData.data.length; i++) {
      imageData.data[i] = Math.min(255, imageDataA.data[i] + imageDataB.data[i]);
    }
    return imageData;
  }

  texturegen.mask = function(imageDataA, imageDataB, imageDataMask) {
    var imageData = clone(imageDataA);
    for (var i = 0; i < imageData.data.length; i++) {
      imageData.data[i] = lerp(imageDataA.data[i],
                               imageDataB.data[i],
                               imageDataMask.data[i] / 255) | 0;
    }
    return imageData;
  }

  texturegen.subtract = function(imageDataA, imageDataB) {
    var imageData = clone(imageDataA);
    for (var i = 0; i < imageData.data.length; i++) {
      imageData.data[i] = Math.max(0, imageDataA.data[i] - imageDataB.data[i]);
    }
    return imageData;
  }

  texturegen.multiply = function(imageDataA, imageDataB) {
    var imageData = clone(imageDataA);
    for (var i = 0; i < imageData.data.length; i++) {
      imageData.data[i] = Math.min(255, imageDataA.data[i] * imageDataB.data[i] / 255);
    }
    return imageData;
  }

  texturegen.perlin = function(imageData, freq, octs) {
    imageData = clone(imageData);
    var size = imageData.width;
    freq = freq || 1 / 32;
    octs = octs || 5;
    forEachPixel(imageData, function(x, y) {
      var value = (1 + perlin2(
          x,
          y,
          size,
          freq,
          octs)) / 2;
      return {
        r: value * 255 | 0,
        g: value * 255 | 0,
        b: value * 255 | 0,
        a: 255
      };
    });
    return imageData;
  }

  texturegen.convolution = function(imageData, filter, factor, bias) {
    resultImageData = clone(imageData);
    filter = filter || [
       [0, 0, 0],
       [0, 1, 0],
       [0, 0, 0]
    ];
    factor = factor || 1;
    bias = bias || 0;

    for(var x = 0; x < imageData.width; x++) {
      for(var y = 0; y < imageData.height; y++) {
        var r = 0;
        var g = 0;
        var b = 0;
        for(var filterY = 0; filterY < filter.length; filterY++) {
          for(var filterX = 0; filterX < filter[0].length; filterX++) {
            var imageX = (x - (filter[0].length / 2 | 0) + filterX + imageData.width) % imageData.width;
            var imageY = (y - (filter.length / 2 | 0) + filterY + imageData.height) % imageData.height;
            var i = (imageY * imageData.width + imageX) * 4;
            r += imageData.data[i] * filter[filterY][filterX];
            g += imageData.data[i + 1] * filter[filterY][filterX];
            b += imageData.data[i + 2] * filter[filterY][filterX];
          }
        }

        var i = (y * imageData.width + x) * 4;
        resultImageData.data[i] = Math.min(Math.max((factor * r + bias) | 0, 0), 255);
        resultImageData.data[i + 1] = Math.min(Math.max((factor * g + bias) | 0, 0), 255);
        resultImageData.data[i + 2] = Math.min(Math.max((factor * b + bias) | 0, 0), 255);
      }
    }
    return resultImageData;
  }

  texturegen.blur = function(imageData) {
    return texturegen.convolution(imageData, [
      [0.0, 0.2, 0.0], 
      [0.2, 0.2, 0.2], 
      [0.0, 0.2, 0.0], 
    ], 1, 0);
  };

  texturegen.emboss = function(imageData) {
    return texturegen.convolution(imageData, [
      [-1, -1, 0],
      [-1,  0, 1],
      [ 0,  1, 1]
    ], 1, 128);
  };

  texturegen.motionBlur = function(imageData, intensity) {
    var resultImageData = clone(imageData);
    intensity = intensity || 0.1;
    var blurWidth = intensity * imageData.width | 0;
    blurWidth += (blurWidth + 1) % 2;
    if(blurWidth == 1) {
      return resultImageData; 
    }
    var runningBlurSum = {r: 0, g: 0, b: 0, a: 0};
    for (var y = 0; y < imageData.height; y++) {
      runningBlurSum.r = 0;
      runningBlurSum.g = 0;
      runningBlurSum.b = 0;
      runningBlurSum.a = 0;
      for (var x = -blurWidth / 2 | 0; x < imageData.width + blurWidth / 2 | 0; x++) {
        var frontI = (y * imageData.width + ((x + blurWidth + imageData.width) % imageData.width)) * 4;
        var backI = (y * imageData.width + ((x + imageData.width) % imageData.width)) * 4;
        runningBlurSum.r += imageData.data[frontI];
        runningBlurSum.g += imageData.data[frontI + 1];
        runningBlurSum.b += imageData.data[frontI + 2];
        runningBlurSum.a += imageData.data[frontI + 3];
        if(x >= (blurWidth / 2 | 0)) {
          runningBlurSum.r -= imageData.data[backI];
          runningBlurSum.g -= imageData.data[backI + 1];
          runningBlurSum.b -= imageData.data[backI + 2];
          runningBlurSum.a -= imageData.data[backI + 3];
        }
        if(x >= (blurWidth / 2 | 0)) {
          var outputI = (y * imageData.width + x + (blurWidth / 2 | 0)) * 4;
          resultImageData.data[outputI] = runningBlurSum.r / blurWidth;
          resultImageData.data[outputI + 1] = runningBlurSum.g / blurWidth;
          resultImageData.data[outputI + 2] = runningBlurSum.b / blurWidth;
          resultImageData.data[outputI + 3] = runningBlurSum.a / blurWidth;
        }
      }
    }
    return resultImageData;
  };

  texturegen.distortX = function(imageDataA, imageDataB, amount) {
    var imageData = clone(imageDataA);
    amount = amount || 1;
    forEachPixel(imageData, function(x, y) {
        var i = (y * imageData.width + x) * 4;
        var xDisplacement = (imageDataB.data[i] - 128) * amount | 0;
        var displacedX = (x + xDisplacement + imageData.width) % imageData.width;
        var displacedI = (y * imageData.width + displacedX) * 4;
        var r = imageDataA.data[displacedI];
        var g = imageDataA.data[displacedI + 1];
        var b = imageDataA.data[displacedI + 2];
        var a = imageDataA.data[displacedI + 3];
      return {r: r, g: g, b: b, a: a};
    });
    return imageData;
  };

  texturegen.threshold = function(imageData, threshold) {
    imageData = clone(imageData);
    forEachPixel(imageData, function(x, y, r, g, b, a) {
      return {
        r: r > threshold ? 255 : 0,
        g: g > threshold ? 255 : 0,
        b: b > threshold ? 255 : 0,
        a: a > threshold ? 255 : 0
      };
    });
    return imageData;
  }

  texturegen.circularGradient = function(imageData, x, y, radius) {
    imageData = clone(imageData);
    forEachPixel(imageData, function(imageX, imageY) {
      var xDistance = imageX - x;
      var yDistance = imageY - y;
      var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
      var value = Math.max(0, Math.min(255, lerp(255, 0, distance / radius)));
      return {
        r: value,
        g: value,
        b: value,
        a: 255
      };
    });
    return imageData;
  }

  texturegen.sine = function(imageData, periods) {
    imageData = clone(imageData);
    forEachPixel(imageData, function(x, y) {
      var value = ((Math.sin(x * Math.PI * 2 / imageData.width * periods) + 1) / 2 * 255) | 0;
      return {
        r: value,
        g: value,
        b: value,
        a: 255
      };
    });
    return imageData;
  };

  texturegen.circularSine = function(imageData, x, y, periods) {
    x = typeof(x) == 'undefined' ? imageData.width / 2 | 0 : x;
    y = typeof(y) == 'undefined' ? imageData.height / 2 | 0 : y;
    periods = periods || 5;
    imageData = clone(imageData);
    forEachPixel(imageData, function(imageX, imageY) {
      var distance = Math.sqrt((imageX - x) * (imageX - x) + (imageY - y) * (imageY - y));
      var value = ((Math.sin(distance * Math.PI * 2 / imageData.width * periods) + 1) / 2 * 255) | 0;
      return {
        r: value,
        g: value,
        b: value,
        a: 255
      };
    });
    return imageData;
  };

  texturegen.polar = function(imageData) {
    resultImageData = clone(imageData);
    forEachPixel(resultImageData, function(x, y) {
      var adjustedX = x - imageData.width / 2 | 0;
      var adjustedY = y - imageData.height / 2 | 0;
      var newX = Math.atan2(adjustedY, adjustedX) | 0;
      var newY = Math.sqrt(adjustedX * adjustedX + adjustedY * adjustedY) | 0;
      var i = (newY * imageData.width + newX) * 4;

      return {
        r: imageData.data[i + 0],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
        a: imageData.data[i + 3]
      };
    });
    return resultImageData;
  };

  texturegen.checker = function(imageData) {
    imageData = clone(imageData);
    forEachPixel(imageData, function(x, y) {
      var adjustedX = x - imageData.width / 2 | 0;
      var adjustedY = y - imageData.height / 2 | 0;
      var value = ((adjustedX > 0 && adjustedY <= 0) ||
                   (adjustedX <= 0 && adjustedY > 0)) * 255 | 0;
      return {
        r: value,
        g: value,
        b: value,
        a: 255
      };
    });
    return imageData;
  }

  texturegen.rect = function(imageData, x, y, w, h, fillStyle, strokeStyle) {
    imageData = clone(imageData);
    var tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = imageData.width;
    tmpCanvas.height = imageData.height;
    var tmpCtx = tmpCanvas.getContext('2d');
    tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
    tmpCtx.fillStyle = fillStyle;
    tmpCtx.strokeStyle = strokeStyle;
    tmpCtx.fillRect(x, y, w, h);
    tmpCtx.strokeRect(x, y, w, h);
    return tmpCtx.getImageData(0, 0, imageData.width, imageData.height);
  }

  texturegen.invert = function(imageData) {
    imageData = clone(imageData);
    forEachPixel(imageData, function(x, y, r, g, b, a) {
      return {
        r: 255 - r,
        g: 255 - g,
        b: 255 - b,
        a: a
      };
    });
    return imageData;
  }

  texturegen.swirl = function(imageData, angle) {
    var W = imageData.width;
    var H = imageData.height;
    var swirlDegree = Math.max(0, Math.min(360, angle));
    var K = swirlDegree / 3600;

    resultImageData = clone(imageData);
    forEachPixel(resultImageData, function(x, y) {
      var adjustedX = x - W / 2 | 0;
      var adjustedY = y - H / 2 | 0;

      var radian = Math.atan2(adjustedY, adjustedX);
      var radius = Math.sqrt(adjustedX * adjustedX + adjustedY * adjustedY);
      var newX = radius * Math.cos(radian + K * radius) + W / 2;
      var newY = radius * Math.sin(radian + K * radius) + H / 2;
      newX = Math.min(W - 1, Math.max(0, newX)) | 0;
      newY = Math.min(H - 1, Math.max(0, newY)) | 0;
      var i = (newY * imageData.width + newX) * 4;

      return {
        r: imageData.data[i + 0],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
        a: imageData.data[i + 3]
      };
    });
    return resultImageData;
  };

})();

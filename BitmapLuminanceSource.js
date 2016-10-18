//
// Ported to JavaScript by Patrizio Bruno 2015
//  
// desertconsulting@gmail.com, https://github.com/PeculiarVentures/validatewallet.com
//


//
// Copyright 2007 ZXing authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///

ZXing.BitmapLuminanceSource = function (bitmap, w, h) {

  var debug = typeof window != 'undefined' && window.__debug === true;
  var width, height;
  if (typeof bitmap == 'number') {
    width = bitmap;
    height = w;
    ZXing.BaseLuminanceSource.call(this, width, height);
  } else {
    var canvas, data;
    if (bitmap instanceof Uint8ClampedArray) {
      width = w;
      height = h;
      data = bitmap;
    } else if (bitmap instanceof ImageData) {
      width = w || bitmap.width;
      height = h || bitmap.height;
      data = bitmap.data;
    } else {
      canvas = w;
      width = canvas.naturalWidth;
      height = canvas.naturalHeight;
      var imageData = bitmap.getImageData(0, 0, width, height);
      data = imageData.data;
    }
    ZXing.BaseLuminanceSource.call(this, width, height);

    var stride = Math.abs(data.length / height);

    if (debug) this.debugBitmap = [];
    //console.time("luminances")
    for(var y = 0; y < height; y++) {
      var strideOffset = y * stride;

      var maxIndex = (4 * width) + strideOffset;
      for(var x = strideOffset; x < maxIndex; x += 4) {
        var luminance = ((7424 * data[x] + 38550 * data[x + 1] + 19562 * data[x + 2]) >> 16);
        //var alpha = data[x + 3];
        //luminance = (((luminance * alpha) >> 8) + (255 * (255 - alpha) >> 8) + 1);

        //luminance = luminance < 50 ? 1 : (luminance > 90 ? 255 : luminance)

        this.luminances.push(luminance);
        if (debug) {
          this.debugBitmap.push(luminance);
          this.debugBitmap.push(luminance);
          this.debugBitmap.push(luminance);
          this.debugBitmap.push(255);
        }
      }
    }
    //console.timeEnd("luminances")
  }
};

ZXing.BitmapLuminanceSource.prototype.CreateLuminanceSource = function (newLuminances, width, height) {
  return (function () {
    var $v1 = new ZXing.BitmapLuminanceSource(width, height);
    $v1.luminances = newLuminances;
    return $v1;
  }).call(this);
};

$Inherit(ZXing.BitmapLuminanceSource, ZXing.BaseLuminanceSource);

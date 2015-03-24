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

ZXing.BitmapLuminanceSource = function (bitmap, h) {

    if (typeof bitmap == 'number') {
        var width = bitmap;
        ZXing.BaseLuminanceSource.call(this, width, h);

    } else {
        var canvas = h;
        ZXing.BaseLuminanceSource.call(this, canvas.width, canvas.height);
        var height = canvas.height;
        var width = canvas.width;
        var imageData = bitmap.getImageData(0, 0, width, height);
        var data = imageData.data;

        var stride = Math.abs(data.length / height);

        var buffer = new Uint8ClampedArray(stride);

        for (var y = 0; y < height; y++) {
            var strideOffset = y * stride;

            var buffer = new Array(stride);
            ArrayCopy(data, strideOffset, buffer, 0);

            var offset = y * width;
            var maxIndex = 4 * width;
            for (var x = 0; x < maxIndex; x += 4) {
                var luminance = ((7424 * buffer[x] + 38550 * buffer[x + 1] + 19562 * buffer[x + 2]) >> 16);
                var alpha = buffer[x + 3];
                luminance = (((luminance * alpha) >> 8) + (255 * (255 - alpha) >> 8) + 1);
                this.luminances[offset] = luminance;
                offset++;
            }
        }
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


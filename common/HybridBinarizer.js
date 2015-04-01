//
// Ported to JavaScript by Patrizio Bruno 2015
//  
// desertconsulting@gmail.com, https://github.com/PeculiarVentures/idscanjs
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

ZXing.Common.HybridBinarizer = function (source) {
    this.matrix = null;
    ZXing.Common.GlobalHistogramBinarizer.call(this, source);
};
ZXing.Common.HybridBinarizer.BLOCK_SIZE_POWER = 3;
ZXing.Common.HybridBinarizer.BLOCK_SIZE = 8;
ZXing.Common.HybridBinarizer.BLOCK_SIZE_MASK = 7;
ZXing.Common.HybridBinarizer.MINIMUM_DIMENSION = 40;
ZXing.Common.HybridBinarizer.MIN_DYNAMIC_RANGE = 24;
ZXing.Common.HybridBinarizer.prototype.get_BlackMatrix = function () {
    this.binarizeEntireImage();
    return this.matrix;
};
ZXing.Common.HybridBinarizer.prototype.createBinarizer = function (source) {
    return new ZXing.Common.HybridBinarizer(source);
};
ZXing.Common.HybridBinarizer.prototype.binarizeEntireImage = function () {
    if (this.matrix == null) {
        var source = this.get_LuminanceSource();
        var width = source.get_Width();
        var height = source.get_Height();
        if (width >= 40 && height >= 40) {
            var luminances = source.get_Matrix();
            var subWidth = width >> 3;
            if ((width & 7) != 0) {
                subWidth++;
            }
            var subHeight = height >> 3;
            if ((height & 7) != 0) {
                subHeight++;
            }
            var blackPoints = ZXing.Common.HybridBinarizer.calculateBlackPoints(luminances, subWidth, subHeight, width, height);
            var newMatrix = new ZXing.Common.BitMatrix(width, height);
            ZXing.Common.HybridBinarizer.calculateThresholdForBlock(luminances, subWidth, subHeight, width, height, blackPoints, newMatrix);
            this.matrix = newMatrix;
        }
        else {
            this.matrix = ZXing.Common.GlobalHistogramBinarizer.prototype.get_BlackMatrix.call(this);
        }
    }
};
ZXing.Common.HybridBinarizer.calculateThresholdForBlock = function (luminances, subWidth, subHeight, width, height, blackPoints, matrix) {
    for (var y = 0; y < subHeight; y++) {
        var yoffset = y << 3;
        var maxYOffset = height - 8;
        if (yoffset > maxYOffset) {
            yoffset = maxYOffset;
        }
        for (var x = 0; x < subWidth; x++) {
            var xoffset = x << 3;
            var maxXOffset = width - 8;
            if (xoffset > maxXOffset) {
                xoffset = maxXOffset;
            }
            var left = ZXing.Common.HybridBinarizer.cap(x, 2, subWidth - 3);
            var top = ZXing.Common.HybridBinarizer.cap(y, 2, subHeight - 3);
            var sum = 0;
            for (var z = -2; z <= 2; z++) {
                var blackRow = blackPoints[top + z];
                sum += blackRow[left - 2];
                sum += blackRow[left - 1];
                sum += blackRow[left];
                sum += blackRow[left + 1];
                sum += blackRow[left + 2];
            }
            var average = Math.floor(sum / 25);
            ZXing.Common.HybridBinarizer.thresholdBlock(luminances, xoffset, yoffset, average, width, matrix);
        }
    }
};
ZXing.Common.HybridBinarizer.cap = function (value, min, max) {
    return value < min ? min : value > max ? max : value;
};
ZXing.Common.HybridBinarizer.thresholdBlock = function (luminances, xoffset, yoffset, threshold, stride, matrix) {
    var offset = (yoffset * stride) + xoffset;
    for (var y = 0; y < 8; y++, offset += stride) {
        for (var x = 0; x < 8; x++) {
            var pixel = luminances[offset + x] & 255;
            matrix.set_Item(xoffset + x, yoffset + y, (pixel <= threshold));
        }
    }
};
ZXing.Common.HybridBinarizer.calculateBlackPoints = function (luminances, subWidth, subHeight, width, height) {
    var blackPoints = new Array(subHeight);
    for (var i = 0; i < subHeight; i++) {
        blackPoints[i] = new Int32Array(subWidth);
    }
    for (var y = 0; y < subHeight; y++) {
        var yoffset = y << 3;
        var maxYOffset = height - 8;
        if (yoffset > maxYOffset) {
            yoffset = maxYOffset;
        }
        for (var x = 0; x < subWidth; x++) {
            var xoffset = x << 3;
            var maxXOffset = width - 8;
            if (xoffset > maxXOffset) {
                xoffset = maxXOffset;
            }
            var sum = 0;
            var min = 255;
            var max = 0;
            for (var yy = 0, offset = yoffset * width + xoffset; yy < 8; yy++, offset += width) {
                for (var xx = 0; xx < 8; xx++) {
                    var pixel = luminances[offset + xx] & 255;
                    sum += pixel;
                    if (pixel < min) {
                        min = pixel;
                    }
                    if (pixel > max) {
                        max = pixel;
                    }
                }
                if (max - min > 24) {
                    for (yy++, offset += width; yy < 8; yy++, offset += width) {
                        for (var xx = 0; xx < 8; xx++) {
                            sum += luminances[offset + xx] & 255;
                        }
                    }
                }
            }
            var average = sum >> (6);
            if (max - min <= 24) {
                average = min >> 1;
                if (y > 0 && x > 0) {
                    var averageNeighborBlackPoint = (blackPoints[y - 1][x] + (2 * blackPoints[y][x - 1]) + blackPoints[y - 1][x - 1]) >> 2;
                    if (min < averageNeighborBlackPoint) {
                        average = averageNeighborBlackPoint;
                    }
                }
            }
            blackPoints[y][x] = average;
        }
    }
    return blackPoints;
};
$Inherit(ZXing.Common.HybridBinarizer, ZXing.Common.GlobalHistogramBinarizer);


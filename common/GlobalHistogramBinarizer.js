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

ZXing.Common.GlobalHistogramBinarizer = function (source) {
    this.luminances = null;
    this.buckets = null;
    ZXing.Binarizer.call(this, source);
    this.luminances = ZXing.Common.GlobalHistogramBinarizer.EMPTY;
    this.buckets = new Int32Array(32);
};
ZXing.Common.GlobalHistogramBinarizer.LUMINANCE_BITS = 5;
ZXing.Common.GlobalHistogramBinarizer.LUMINANCE_SHIFT = 3;
ZXing.Common.GlobalHistogramBinarizer.LUMINANCE_BUCKETS = 32;
ZXing.Common.GlobalHistogramBinarizer.EMPTY = new Uint8Array(0);
ZXing.Common.GlobalHistogramBinarizer.prototype.getBlackRow = function (y, row) {
    var source = this.get_LuminanceSource();
    var width = source.get_Width();
    if (row == null || row.get_Size() < width) {
        row = new ZXing.Common.BitArray(width);
    }
    else {
        row.clear();
    }
    this.initArrays(width);
    var localLuminances = source.getRow(y, this.luminances);
    var localBuckets = this.buckets;
    for (var x = 0; x < width; x++) {
        var pixel = localLuminances[x] & 255;
        localBuckets[pixel >> 3]++;
    }
    var blackPoint;
    if (!(function () {
        var $1 = {
        Value: blackPoint
    };
        var $res = ZXing.Common.GlobalHistogramBinarizer.estimateBlackPoint(localBuckets, $1);
        blackPoint = $1.Value;
        return $res;
    }).call(this))
        return null;
    var left = localLuminances[0] & 255;
    var center = localLuminances[1] & 255;
    for (var x = 1; x < width - 1; x++) {
        var right = localLuminances[x + 1] & 255;
        var luminance = ((center << 2) - left - right) >> 1;
        row.set_Item(x, (luminance < blackPoint));
        left = center;
        center = right;
    }
    return row;
};
ZXing.Common.GlobalHistogramBinarizer.prototype.get_BlackMatrix = function () {
    var source = this.get_LuminanceSource();
    var localLuminances;
    var width = source.get_Width();
    var height = source.get_Height();
    var matrix = new ZXing.Common.BitMatrix(width, height);
    this.initArrays(width);
    var localBuckets = this.buckets;
    for (var y = 1; y < 5; y++) {
        var row = height * Math.floor(y / 5);
        localLuminances = source.getRow(row, this.luminances);
        var right = Math.floor((width << 2) / 5);
        for (var x = width / 5; x < right; x++) {
            var pixel = localLuminances[x] & 255;
            localBuckets[pixel >> 3]++;
        }
    }
    var blackPoint;
    if (!(function () {
        var $1 = {
        Value: blackPoint
    };
        var $res = ZXing.Common.GlobalHistogramBinarizer.estimateBlackPoint(localBuckets, $1);
        blackPoint = $1.Value;
        return $res;
    }).call(this))
        return null;
    localLuminances = source.get_Matrix();
    for (var y = 0; y < height; y++) {
        var offset = y * width;
        for (var x = 0; x < width; x++) {
            var pixel = localLuminances[offset + x] & 255;
            matrix.set_Item(x, y, (pixel < blackPoint));
        }
    }
    return matrix;
};
ZXing.Common.GlobalHistogramBinarizer.prototype.createBinarizer = function (source) {
    return new ZXing.Common.GlobalHistogramBinarizer(source);
};
ZXing.Common.GlobalHistogramBinarizer.prototype.initArrays = function (luminanceSize) {
    if (this.luminances.length < luminanceSize) {
        this.luminances = new Uint8Array(luminanceSize);
    }
    for (var x = 0; x < 32; x++) {
        this.buckets[x] = 0;
    }
};
ZXing.Common.GlobalHistogramBinarizer.estimateBlackPoint = function (buckets, blackPoint) {
    blackPoint.Value = 0;
    var numBuckets = buckets.length;
    var maxBucketCount = 0;
    var firstPeak = 0;
    var firstPeakSize = 0;
    for (var x = 0; x < numBuckets; x++) {
        if (buckets[x] > firstPeakSize) {
            firstPeak = x;
            firstPeakSize = buckets[x];
        }
        if (buckets[x] > maxBucketCount) {
            maxBucketCount = buckets[x];
        }
    }
    var secondPeak = 0;
    var secondPeakScore = 0;
    for (var x = 0; x < numBuckets; x++) {
        var distanceToBiggest = x - firstPeak;
        var score = buckets[x] * distanceToBiggest * distanceToBiggest;
        if (score > secondPeakScore) {
            secondPeak = x;
            secondPeakScore = score;
        }
    }
    if (firstPeak > secondPeak) {
        var temp = firstPeak;
        firstPeak = secondPeak;
        secondPeak = temp;
    }
    if (secondPeak - firstPeak <= numBuckets >> 4) {
        return false;
    }
    var bestValley = secondPeak - 1;
    var bestValleyScore = -1;
    for (var x = secondPeak - 1; x > firstPeak; x--) {
        var fromFirst = x - firstPeak;
        var score = fromFirst * fromFirst * (secondPeak - x) * (maxBucketCount - buckets[x]);
        if (score > bestValleyScore) {
            bestValley = x;
            bestValleyScore = score;
        }
    }
    blackPoint.Value = bestValley << 3;
    return true;
};
$Inherit(ZXing.Common.GlobalHistogramBinarizer, ZXing.Binarizer);


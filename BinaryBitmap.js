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

ZXing.BinaryBitmap = function (binarizer) {
    this.binarizer = null;
    this.matrix = null;
    if (binarizer instanceof ZXing.Binarizer ||
        binarizer instanceof ZXing.Common.HybridBinarizer ||
        binarizer instanceof ZXing.Common.GlobalHistogramBinarizer) {
        if (!binarizer) {
            throw new Error("Binarizer must be non-null.");
        }
        this.binarizer = binarizer;
    } else {
        var matrix = binarizer;
        if (matrix) {
            throw new Error("parameter must be non-null.");
        }
        this.matrix = matrix;
    }
};
ZXing.BinaryBitmap.prototype.get_Width = function () {
    return this.binarizer.get_Width();
};
ZXing.BinaryBitmap.prototype.get_Height = function () {
    return this.binarizer.get_Height();
};
ZXing.BinaryBitmap.prototype.getBlackRow = function (y, row) {
    return this.binarizer.getBlackRow(y, row);
};
ZXing.BinaryBitmap.prototype.get_BlackMatrix = function () {
    return (this.matrix ? this.matrix : (this.matrix = this.binarizer.get_BlackMatrix()));
};
ZXing.BinaryBitmap.prototype.get_CropSupported = function () {
    return this.binarizer.get_LuminanceSource().get_CropSupported();
};
ZXing.BinaryBitmap.prototype.crop = function (left, top, width, height) {
    var newSource = this.binarizer.get_LuminanceSource().crop(left, top, width, height);
    return new ZXing.BinaryBitmap(this.binarizer.createBinarizer(newSource));
};
ZXing.BinaryBitmap.prototype.get_RotateSupported = function () {
    return this.binarizer.get_LuminanceSource().get_RotateSupported();
};
ZXing.BinaryBitmap.prototype.rotateCounterClockwise = function () {
    var newSource = this.binarizer.get_LuminanceSource().rotateCounterClockwise();
    return new ZXing.BinaryBitmap(this.binarizer.createBinarizer(newSource));
};
ZXing.BinaryBitmap.prototype.rotateCounterClockwise45 = function () {
    var newSource = this.binarizer.get_LuminanceSource().rotateCounterClockwise45();
    return new ZXing.BinaryBitmap(this.binarizer.createBinarizer(newSource));
};
ZXing.BinaryBitmap.prototype.toString = function () {
    var blackMatrix = this.get_BlackMatrix();
    return blackMatrix ? blackMatrix.toString() : "";
};


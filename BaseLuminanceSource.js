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

ZXing.BaseLuminanceSource = function (width, height) {
    this.luminances = null;
    this.luminances = new Uint8Array(width * height);
};

ZXing.BaseLuminanceSource.RChannelWeight = 19562;
ZXing.BaseLuminanceSource.GChannelWeight = 38550;
ZXing.BaseLuminanceSource.BChannelWeight = 7424;
ZXing.BaseLuminanceSource.ChannelWeight = 16;

ZXing.BaseLuminanceSource = function (luminanceArray, width, height) {
    this.luminances = [];
    if (luminanceArray instanceof Array) {
        this.luminances = luminanceArray.slice(0);
    } else {
        var w = luminanceArray;
        height = width;
        width = w;
    }
    ZXing.LuminanceSource.call(this, width, height);
};
ZXing.BaseLuminanceSource.prototype.getRow = function (y, row) {
    var width = this.get_Width();
    if (!row || row.length < width) {
        row = new Uint8Array(width);
    }
    for (var i = 0; i < width; i++)
        row[i] = this.luminances[y * width + i];
    return row;
};
ZXing.BaseLuminanceSource.prototype.get_Matrix = function () {
    return this.luminances;
};
ZXing.BaseLuminanceSource.prototype.rotateCounterClockwise = function () {
    var rotatedLuminances = new Uint8Array(this.get_Width() * this.get_Height());
    var newWidth = this.get_Height();
    var newHeight = this.get_Width();
    var localLuminances = this.get_Matrix();
    for (var yold = 0; yold < this.get_Height() ; yold++) {
        for (var xold = 0; xold < this.get_Width() ; xold++) {
            var ynew = newHeight - xold - 1;
            rotatedLuminances[ynew * newWidth + yold] = localLuminances[yold * this.get_Width() + xold];
        }
    }
    return this.CreateLuminanceSource(rotatedLuminances, newWidth, newHeight);
};
ZXing.BaseLuminanceSource.prototype.rotateCounterClockwise45 = function () {
    return ZXing.LuminanceSource.commonPrototype.rotateCounterClockwise45.call(this);
};
ZXing.BaseLuminanceSource.prototype.get_RotateSupported = function () {
    return true;
};
ZXing.BaseLuminanceSource.prototype.crop = function (left, top, width, height) {
    if (left + width > this.get_Width() || top + height > this.get_Height()) {
        throw new Error("Crop rectangle does not fit within image data.");
    }
    var croppedLuminances = new Uint8Array(width * height);
    var oldLuminances = this.get_Matrix();
    var oldWidth = this.get_Width();
    var oldRightBound = left + width;
    var oldBottomBound = top + height;
    for (var yold = top, ynew = 0; yold < oldBottomBound; yold++, ynew++) {
        for (var xold = left, xnew = 0; xold < oldRightBound; xold++, xnew++) {
            croppedLuminances[ynew * width + xnew] = oldLuminances[yold * oldWidth + xold];
        }
    }
    return this.CreateLuminanceSource(croppedLuminances, width, height);
};
ZXing.BaseLuminanceSource.prototype.get_CropSupported = function () {
    return true;
};
ZXing.BaseLuminanceSource.prototype.get_InversionSupported = function () {
    return true;
};
ZXing.BaseLuminanceSource.prototype.invert = function () {
    return new ZXing.InvertedLuminanceSource(this);
};
$Inherit(ZXing.BaseLuminanceSource, ZXing.LuminanceSource);

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

ZXing.LuminanceSource = function (width, height) {
    this.width = 0;
    this.height = 0;
    this.width = width;
    this.height = height;
};
ZXing.LuminanceSource.prototype.get_Width = function () {
    return this.width;
};
ZXing.LuminanceSource.prototype.set_Width = function (value) {
    this.width = value;
};
ZXing.LuminanceSource.prototype.get_Height = function () {
    return this.height;
};
ZXing.LuminanceSource.prototype.set_Height = function (value) {
    this.height = value;
};
ZXing.LuminanceSource.prototype.get_CropSupported = function () {
    return false;
};
ZXing.LuminanceSource.prototype.crop = function (left, top, width, height) {
    throw new Error("This luminance source does not support cropping.");
};
ZXing.LuminanceSource.prototype.get_RotateSupported = function () {
    return false;
};
ZXing.LuminanceSource.prototype.rotateCounterClockwise = function () {
    throw  new Error("This luminance source does not support rotation.");
};
ZXing.LuminanceSource.prototype.rotateCounterClockwise45 = function () {
    throw new Error("This luminance source does not support rotation by 45 degrees.");
};
ZXing.LuminanceSource.prototype.get_InversionSupported = function () {
    return false;
};
ZXing.LuminanceSource.prototype.invert = function () {
    throw new Error("This luminance source does not support inversion.");
};
ZXing.LuminanceSource.prototype.toString = function () {
    var row = new Uint8Array(this.width);
    var result = "";
    for (var y = 0; y < this.height; y++) {
        row = this.getRow(y, row);
        for (var x = 0; x < this.width; x++) {
            var luminance = row[x] & 255;
            var c;
            if (luminance < 64) {
                c = "#";
            }
            else if (luminance < 128) {
                c = "+";
            }
            else if (luminance < 192) {
                c = ".";
            }
            else {
                c = " ";
            }
            result += c;
        }
        result += "\n";
    }
    return result;
};


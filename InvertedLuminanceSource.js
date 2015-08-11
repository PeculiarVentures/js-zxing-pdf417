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

ZXing.InvertedLuminanceSource = function (delegate) {
    this.delegate = null;
    this.invertedMatrix = null;
    this.delegate = delegate;
};
ZXing.InvertedLuminanceSource.prototype.getRow = function (y, row){
    row = this.delegate.getRow(y, row);
    var width = this.get_Width();
    for (var i = 0; i < width; i++){
        row[i] = (255 - (row[i] & 255));
    }
    return row;
};
ZXing.InvertedLuminanceSource.prototype.get_Matrix = function (){
    if (!this.invertedMatrix){
        var matrix = this.delegate.get_Matrix();
        var length = this.get_Width() * this.get_Height();
        this.invertedMatrix = new Uint8Array(length);
        for (var i = 0; i < length; i++){
            this.invertedMatrix[i] = (255 - (matrix[i] & 255));
        }
    }
    return this.invertedMatrix;
};
ZXing.InvertedLuminanceSource.prototype.get_CropSupported = function (){
    return this.delegate.get_CropSupported();
};
ZXing.InvertedLuminanceSource.prototype.crop = function (left, top, width, height){
    return new ZXing.InvertedLuminanceSource(this.delegate.crop(left, top, width, height));
};
ZXing.InvertedLuminanceSource.prototype.get_RotateSupported = function (){
    return this.delegate.get_RotateSupported();
};
ZXing.InvertedLuminanceSource.prototype.invert = function (){
    return this.delegate;
};
ZXing.InvertedLuminanceSource.prototype.rotateCounterClockwise = function (){
    return new ZXing.InvertedLuminanceSource(this.delegate.rotateCounterClockwise());
};
ZXing.InvertedLuminanceSource.prototype.rotateCounterClockwise45 = function (){
    return new ZXing.InvertedLuminanceSource(this.delegate.rotateCounterClockwise45());
};


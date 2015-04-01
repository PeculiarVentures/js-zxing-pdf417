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

ZXing.PDF417.Internal.BarcodeValue = function () {
    this.values = {};
};

ZXing.PDF417.Internal.BarcodeValue.prototype.setValue = function (value) {
    value = Math.floor(value);
    var confidence = this.values.hasOwnProperty(value) ? this.values[value] : 0;
    confidence++;
    this.values[value] = confidence;
};

ZXing.PDF417.Internal.BarcodeValue.prototype.getValue = function () {
    var maxConfidence = -1;
    var result = [];
    for (var key in this.values) {
        if (this.values.hasOwnProperty(key)) {
            var entry = this.values[key];
            if (entry > maxConfidence) {
                maxConfidence = entry;
                result.splice(0);
                result.push(parseInt(key));
            }
            else if (entry == maxConfidence) {
                result.push(parseInt(key));
            }
        }
    }
    return result;
};
ZXing.PDF417.Internal.BarcodeValue.prototype.getConfidence = function (barcodeValue) {
    return typeof this.values[barcodeValue] != 'undefined' ? this.values[barcodeValue] : 0;
};


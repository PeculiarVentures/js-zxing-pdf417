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

ZXing.Binarizer = function (source) {
    this.source = null;
    if (!source) {
        throw new Error("Source must be non-null.");
    }
    this.source = source;
};
ZXing.Binarizer.prototype.get_LuminanceSource = function () {
    return this.source;
};
ZXing.Binarizer.prototype.get_Width = function () {
    return this.source.get_Width();
};
ZXing.Binarizer.prototype.get_Height = function () {
    return this.source.get_Height();
};


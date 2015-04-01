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

ZXing.PDF417.Internal.Codeword = function (startX, endX, bucket, value) {
    this.StartX = 0;
    this.EndX = 0;
    this.Bucket = 0;
    this.Value = 0;
    this.RowNumber = 0;
    this.StartX = startX;
    this.EndX = endX;
    this.Bucket = bucket;
    this.Value = value;
    this.RowNumber = ZXing.PDF417.Internal.Codeword.BARCODE_ROW_UNKNOWN;
};
ZXing.PDF417.Internal.Codeword.BARCODE_ROW_UNKNOWN = -1;
ZXing.PDF417.Internal.Codeword.prototype.get_Width = function () {
    return this.EndX - this.StartX;
};
ZXing.PDF417.Internal.Codeword.prototype.get_HasValidRowNumber = function () {
    return this.IsValidRowNumber(this.RowNumber);
};
ZXing.PDF417.Internal.Codeword.prototype.IsValidRowNumber = function (rowNumber) {
    rowNumber = parseInt(rowNumber);
    return rowNumber != ZXing.PDF417.Internal.Codeword.BARCODE_ROW_UNKNOWN && this.Bucket == (rowNumber % 3) * 3;
};
ZXing.PDF417.Internal.Codeword.prototype.setRowNumberAsRowIndicatorColumn = function () {
    this.RowNumber = Math.floor(this.Value / 30) * 3 + Math.floor(this.Bucket / 3);
};
ZXing.PDF417.Internal.Codeword.prototype.toString = function () {
    return this.RowNumber + "|" + this.Value;
};


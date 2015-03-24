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

ZXing.PDF417.Internal.DetectionResultColumn = function (box) {
    this.Box = null;
    this.Codewords = null;
    this.Box = ZXing.PDF417.Internal.BoundingBox.Create(box);
    this.Codewords = new Array(this.Box.MaxY - this.Box.MinY + 1);
};
ZXing.PDF417.Internal.DetectionResultColumn.MAX_NEARBY_DISTANCE = 5;
ZXing.PDF417.Internal.DetectionResultColumn.prototype.IndexForRow = function (imageRow) {
    return imageRow - this.Box.MinY;
};
ZXing.PDF417.Internal.DetectionResultColumn.prototype.RowForIndex = function (codewordIndex) {
    return this.Box.MinY + codewordIndex;
};
ZXing.PDF417.Internal.DetectionResultColumn.prototype.getCodeword = function (imageRow) {
    return this.Codewords[this.imageRowToCodewordIndex(imageRow)];
};
ZXing.PDF417.Internal.DetectionResultColumn.prototype.getCodewordNearby = function (imageRow) {
    var codeword = this.getCodeword(imageRow);
    if (codeword != null) {
        return codeword;
    }
    for (var i = 1; i < 5; i++) {
        var nearImageRow = this.imageRowToCodewordIndex(imageRow) - i;
        if (nearImageRow >= 0) {
            codeword = this.Codewords[nearImageRow];
            if (codeword != null) {
                return codeword;
            }
        }
        nearImageRow = this.imageRowToCodewordIndex(imageRow) + i;
        if (nearImageRow < this.Codewords.length) {
            codeword = this.Codewords[nearImageRow];
            if (codeword != null) {
                return codeword;
            }
        }
    }
    return null;
};
ZXing.PDF417.Internal.DetectionResultColumn.prototype.imageRowToCodewordIndex = function (imageRow) {
    return imageRow - this.Box.MinY;
};
ZXing.PDF417.Internal.DetectionResultColumn.prototype.setCodeword = function (imageRow, codeword) {
    this.Codewords[this.IndexForRow(imageRow)] = codeword;
};
ZXing.PDF417.Internal.DetectionResultColumn.prototype.toString = function () {
    var builder = "";
    var row = 0;
    for (var $i6 = 0, $t6 = this.Codewords, $l6 = $t6.length, cw = $t6[$i6]; $i6 < $l6; $i6++, cw = $t6[$i6]) {
        if (cw == null) {
            builder += "{0}:    |   \n".format(FormatInteger(row++, 3));
        }
        else {
            builder += "{0}: {1}|{2}\n".format(FormatInteger(row++, 3), FormatInteger(cw.RowNumber, 3), FormatInteger(cw.Value, 3));
        }
    }
    return builder;
};


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

ZXing.PDF417.Internal.DetectionResult = function (metadata, box) {
    this.Metadata = null;
    this.DetectionResultColumns = null;
    this.Box = null;
    this.ColumnCount = 0;
    this.Metadata = metadata;
    this.Box = box;
    this.ColumnCount = metadata.ColumnCount;
    this.DetectionResultColumns = new Array(this.ColumnCount + 2);
};
ZXing.PDF417.Internal.DetectionResult.ADJUST_ROW_NUMBER_SKIP = 2;
ZXing.PDF417.Internal.DetectionResult.prototype.get_RowCount = function () {
    return this.Metadata.RowCount;
};
ZXing.PDF417.Internal.DetectionResult.prototype.get_ErrorCorrectionLevel = function () {
    return this.Metadata.ErrorCorrectionLevel;
};
ZXing.PDF417.Internal.DetectionResult.prototype.getDetectionResultColumns = function () {
    this.adjustIndicatorColumnRowNumbers(this.DetectionResultColumns[0]);
    this.adjustIndicatorColumnRowNumbers(this.DetectionResultColumns[this.ColumnCount + 1]);
    var unadjustedCodewordCount = ZXing.PDF417.PDF417Common.MAX_CODEWORDS_IN_BARCODE;
    var previousUnadjustedCount;
    do {
        previousUnadjustedCount = unadjustedCodewordCount;
        unadjustedCodewordCount = this.adjustRowNumbers();
    }
    while (unadjustedCodewordCount > 0 && unadjustedCodewordCount < previousUnadjustedCount)
    return this.DetectionResultColumns;
};
ZXing.PDF417.Internal.DetectionResult.prototype.adjustIndicatorColumnRowNumbers = function (detectionResultColumn) {
    if (detectionResultColumn != null) {
        (detectionResultColumn instanceof ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn || detectionResultColumn == null ? detectionResultColumn : (function () {
            throw new Error("InvalidCastException");
        }
        ())).adjustCompleteIndicatorColumnRowNumbers(this.Metadata);
    }
};
ZXing.PDF417.Internal.DetectionResult.prototype.adjustRowNumbersMy = function () {
    var unadjustedCount = this.adjustRowNumbersByRow();
    if (unadjustedCount == 0) {
        return 0;
    }
    for (var barcodeColumn = 1; barcodeColumn < this.ColumnCount + 1; barcodeColumn++) {
        var codewords = this.DetectionResultColumns[barcodeColumn].Codewords;
        for (var codewordsRow = 0; codewordsRow < codewords.length; codewordsRow++) {
            if (codewords[codewordsRow] == null) {
                continue;
            }
            if (!codewords[codewordsRow].get_HasValidRowNumber()) {
                this.adjustRowNumbers(barcodeColumn, codewordsRow, codewords);
            }
        }
    }
    return unadjustedCount;
};
ZXing.PDF417.Internal.DetectionResult.prototype.adjustRowNumbers = function (barcodeColumn, codewordsRow, codewords) {
    if (!arguments.length) return this.adjustRowNumbersMy();
    var codeword = codewords[codewordsRow];
    var previousColumnCodewords = this.DetectionResultColumns[barcodeColumn - 1].Codewords;
    var nextColumnCodewords = previousColumnCodewords;
    if (this.DetectionResultColumns[barcodeColumn + 1] != null) {
        nextColumnCodewords = this.DetectionResultColumns[barcodeColumn + 1].Codewords;
    }
    var otherCodewords = new Array(14);
    otherCodewords[2] = previousColumnCodewords[codewordsRow];
    otherCodewords[3] = nextColumnCodewords[codewordsRow];
    if (codewordsRow > 0) {
        otherCodewords[0] = codewords[codewordsRow - 1];
        otherCodewords[4] = previousColumnCodewords[codewordsRow - 1];
        otherCodewords[5] = nextColumnCodewords[codewordsRow - 1];
    }
    if (codewordsRow > 1) {
        otherCodewords[8] = codewords[codewordsRow - 2];
        otherCodewords[10] = previousColumnCodewords[codewordsRow - 2];
        otherCodewords[11] = nextColumnCodewords[codewordsRow - 2];
    }
    if (codewordsRow < codewords.length - 1) {
        otherCodewords[1] = codewords[codewordsRow + 1];
        otherCodewords[6] = previousColumnCodewords[codewordsRow + 1];
        otherCodewords[7] = nextColumnCodewords[codewordsRow + 1];
    }
    if (codewordsRow < codewords.length - 2) {
        otherCodewords[9] = codewords[codewordsRow + 2];
        otherCodewords[12] = previousColumnCodewords[codewordsRow + 2];
        otherCodewords[13] = nextColumnCodewords[codewordsRow + 2];
    }
    for (var $i5 = 0, $l5 = otherCodewords.length, otherCodeword = otherCodewords[$i5]; $i5 < $l5; $i5++, otherCodeword = otherCodewords[$i5]) {
        if (ZXing.PDF417.Internal.DetectionResult.adjustRowNumber(codeword, otherCodeword)) {
            return;
        }
    }
};

ZXing.PDF417.Internal.DetectionResult.prototype.adjustRowNumbersByRow = function () {
    this.adjustRowNumbersFromBothRI();
    var unadjustedCount = this.adjustRowNumbersFromLRI();
    return unadjustedCount + this.adjustRowNumbersFromRRI();
};
ZXing.PDF417.Internal.DetectionResult.prototype.adjustRowNumbersFromBothRI = function () {
    if (this.DetectionResultColumns[0] == null || this.DetectionResultColumns[this.ColumnCount + 1] == null) {
        return;
    }
    var LRIcodewords = this.DetectionResultColumns[0].Codewords;
    var RRIcodewords = this.DetectionResultColumns[this.ColumnCount + 1].Codewords;
    for (var codewordsRow = 0; codewordsRow < LRIcodewords.length; codewordsRow++) {
        if (LRIcodewords[codewordsRow] != null && RRIcodewords[codewordsRow] != null && LRIcodewords[codewordsRow].RowNumber == RRIcodewords[codewordsRow].RowNumber) {
            for (var barcodeColumn = 1; barcodeColumn <= this.ColumnCount; barcodeColumn++) {
                var codeword = this.DetectionResultColumns[barcodeColumn].Codewords[codewordsRow];
                if (codeword == null) {
                    continue;
                }
                codeword.RowNumber = LRIcodewords[codewordsRow].RowNumber;
                if (!codeword.get_HasValidRowNumber()) {
                    this.DetectionResultColumns[barcodeColumn].Codewords[codewordsRow] = null;
                }
            }
        }
    }
};
ZXing.PDF417.Internal.DetectionResult.prototype.adjustRowNumbersFromRRI = function () {
    if (this.DetectionResultColumns[this.ColumnCount + 1] == null) {
        return 0;
    }
    var unadjustedCount = 0;
    var codewords = this.DetectionResultColumns[this.ColumnCount + 1].Codewords;
    for (var codewordsRow = 0; codewordsRow < codewords.length; codewordsRow++) {
        if (codewords[codewordsRow] == null) {
            continue;
        }
        var rowIndicatorRowNumber = codewords[codewordsRow].RowNumber;
        var invalidRowCounts = 0;
        for (var barcodeColumn = this.ColumnCount + 1; barcodeColumn > 0 && invalidRowCounts < 2; barcodeColumn--) {
            var codeword = this.DetectionResultColumns[barcodeColumn].Codewords[codewordsRow];
            if (codeword != null) {
                invalidRowCounts = ZXing.PDF417.Internal.DetectionResult.adjustRowNumberIfValid(rowIndicatorRowNumber, invalidRowCounts, codeword);
                if (!codeword.get_HasValidRowNumber()) {
                    unadjustedCount++;
                }
            }
        }
    }
    return unadjustedCount;
};
ZXing.PDF417.Internal.DetectionResult.prototype.adjustRowNumbersFromLRI = function () {
    if (this.DetectionResultColumns[0] == null) {
        return 0;
    }
    var unadjustedCount = 0;
    var codewords = this.DetectionResultColumns[0].Codewords;
    for (var codewordsRow = 0; codewordsRow < codewords.length; codewordsRow++) {
        if (codewords[codewordsRow] == null) {
            continue;
        }
        var rowIndicatorRowNumber = codewords[codewordsRow].RowNumber;
        var invalidRowCounts = 0;
        for (var barcodeColumn = 1; barcodeColumn < this.ColumnCount + 1 && invalidRowCounts < 2; barcodeColumn++) {
            var codeword = this.DetectionResultColumns[barcodeColumn].Codewords[codewordsRow];
            if (codeword != null) {
                invalidRowCounts = ZXing.PDF417.Internal.DetectionResult.adjustRowNumberIfValid(rowIndicatorRowNumber, invalidRowCounts, codeword);
                if (!codeword.get_HasValidRowNumber()) {
                    unadjustedCount++;
                }
            }
        }
    }
    return unadjustedCount;
};
ZXing.PDF417.Internal.DetectionResult.adjustRowNumberIfValid = function (rowIndicatorRowNumber, invalidRowCounts, codeword) {
    if (codeword == null) {
        return invalidRowCounts;
    }
    if (!codeword.get_HasValidRowNumber()) {
        if (codeword.IsValidRowNumber(rowIndicatorRowNumber)) {
            codeword.RowNumber = rowIndicatorRowNumber;
            invalidRowCounts = 0;
        }
        else {
            ++invalidRowCounts;
        }
    }
    return invalidRowCounts;
};
ZXing.PDF417.Internal.DetectionResult.adjustRowNumber = function (codeword, otherCodeword) {
    if (otherCodeword == null) {
        return false;
    }
    if (otherCodeword.get_HasValidRowNumber() && otherCodeword.Bucket == codeword.Bucket) {
        codeword.RowNumber = otherCodeword.RowNumber;
        return true;
    }
    return false;
};
ZXing.PDF417.Internal.DetectionResult.prototype.toString = function () {
    var formatter = "";
    var rowIndicatorColumn = this.DetectionResultColumns[0];
    if (rowIndicatorColumn == null) {
        rowIndicatorColumn = this.DetectionResultColumns[this.ColumnCount + 1];
    }
    for (var codewordsRow = 0; codewordsRow < rowIndicatorColumn.Codewords.length; codewordsRow++) {
        formatter += "CW {0}:".format(FormatInteger(codewordsRow, 3));
        for (var barcodeColumn = 0; barcodeColumn < this.ColumnCount + 2; barcodeColumn++) {
            if (this.DetectionResultColumns[barcodeColumn] == null) {
                formatter += "    |   ";
                continue;
            }
            var codeword = this.DetectionResultColumns[barcodeColumn].Codewords[codewordsRow];
            if (codeword == null) {
                formatter += "    |   ";
                continue;
            }
            formatter += " {0}|{1}".format(FormatInteger(codeword.RowNumber, 3), FormatInteger(codeword.Value, 3));
        }
        formatter += "\n";
    }
    return formatter;
};


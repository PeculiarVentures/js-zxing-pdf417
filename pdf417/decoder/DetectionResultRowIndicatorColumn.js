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

ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn = function (box, isLeft) {
    this.IsLeft = false;
    ZXing.PDF417.Internal.DetectionResultColumn.call(this, box);
    this.IsLeft = isLeft;
};
ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn.prototype.setRowNumbers = function (){
    for (var $i7 = 0,$t7 = this.Codewords,$l7 = $t7.length,cw = $t7[$i7]; $i7 < $l7; $i7++, cw = $t7[$i7]){
        if (cw != null){
            cw.setRowNumberAsRowIndicatorColumn();
        }
    }
};
ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn.prototype.adjustCompleteIndicatorColumnRowNumbers = function (metadata){
    var codewords = this.Codewords;
    this.setRowNumbers();
    this.removeIncorrectCodewords(codewords, metadata);
    var top = this.IsLeft ? this.Box.TopLeft : this.Box.TopRight;
    var bottom = this.IsLeft ? this.Box.BottomLeft : this.Box.BottomRight;
    var firstRow = this.imageRowToCodewordIndex(top.y);
    var lastRow = this.imageRowToCodewordIndex(bottom.y);
    var averageRowHeight = Math.floor(lastRow - firstRow) / metadata.RowCount;
    var barcodeRow = -1;
    var maxRowHeight = 1;
    var currentRowHeight = 0;
    for (var codewordRow = firstRow; codewordRow < lastRow; codewordRow++){
        var codeword = codewords[codewordRow];
        if (codeword == null){
            continue;
        }
        var rowDifference = codeword.RowNumber - barcodeRow;
        if (rowDifference == 0){
            currentRowHeight++;
        }
        else if (rowDifference == 1){
            maxRowHeight = Math.max(maxRowHeight, currentRowHeight);
            currentRowHeight = 1;
            barcodeRow = codeword.RowNumber;
        }
        else if (rowDifference < 0 || codeword.RowNumber >= metadata.RowCount || rowDifference > codewordRow){
            codewords[codewordRow] = null;
        }
        else {
            var checkedRows;
            if (maxRowHeight > 2){
                checkedRows = (maxRowHeight - 2) * rowDifference;
            }
            else {
                checkedRows = rowDifference;
            }
            var closePreviousCodewordFound = checkedRows > codewordRow;
            for (var i = 1; i <= checkedRows && !closePreviousCodewordFound; i++){
                closePreviousCodewordFound = codewords[codewordRow - i] != null;
            }
            if (closePreviousCodewordFound){
                codewords[codewordRow] = null;
            }
            else {
                barcodeRow = codeword.RowNumber;
                currentRowHeight = 1;
            }
        }
    }
    return (averageRowHeight + 0.5);
};
ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn.prototype.getRowHeights = function (){
    var barcodeMetadata = this.getBarcodeMetadata();
    if (barcodeMetadata == null){
        return null;
    }
    this.adjustIncompleteIndicatorColumnRowNumbers(barcodeMetadata);
    var result = new Int32Array(barcodeMetadata.RowCount);
    for (var $i8 = 0,$t8 = this.Codewords,$l8 = $t8.length,codeword = $t8[$i8]; $i8 < $l8; $i8++, codeword = $t8[$i8]){
        if (codeword != null){
            var rowNumber = codeword.RowNumber;
            if (rowNumber >= result.length){
                return null;
            }
            result[rowNumber]++;
        }
    }
    return result;
};
ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn.prototype.adjustIncompleteIndicatorColumnRowNumbers = function (metadata){
    var top = this.IsLeft ? this.Box.TopLeft : this.Box.TopRight;
    var bottom = this.IsLeft ? this.Box.BottomLeft : this.Box.BottomRight;
    var firstRow = this.imageRowToCodewordIndex(top.y);
    var lastRow = this.imageRowToCodewordIndex(bottom.y);
    var averageRowHeight = Math.floor((lastRow - firstRow) / metadata.RowCount);
    var codewords = this.Codewords;
    var barcodeRow = -1;
    var maxRowHeight = 1;
    var currentRowHeight = 0;
    for (var codewordRow = firstRow; codewordRow < lastRow; codewordRow++){
        var codeword = codewords[codewordRow];
        if (codeword == null){
            continue;
        }
        codeword.setRowNumberAsRowIndicatorColumn();
        var rowDifference = codeword.RowNumber - barcodeRow;
        if (rowDifference == 0){
            currentRowHeight++;
        }
        else if (rowDifference == 1){
            maxRowHeight = Math.max(maxRowHeight, currentRowHeight);
            currentRowHeight = 1;
            barcodeRow = codeword.RowNumber;
        }
        else if (codeword.RowNumber > metadata.RowCount){
            this.Codewords[codewordRow] = null;
        }
        else {
            barcodeRow = codeword.RowNumber;
            currentRowHeight = 1;
        }
    }
    return (averageRowHeight + 0.5);
};
ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn.prototype.getBarcodeMetadata = function () {
    if (!this.barcodeMetaData) {
        var codewords = this.Codewords;
        var barcodeColumnCount = new ZXing.PDF417.Internal.BarcodeValue();
        var barcodeRowCountUpperPart = new ZXing.PDF417.Internal.BarcodeValue();
        var barcodeRowCountLowerPart = new ZXing.PDF417.Internal.BarcodeValue();
        var barcodeECLevel = new ZXing.PDF417.Internal.BarcodeValue();
        for (var $i9 = 0, $l9 = codewords.length, codeword = codewords[$i9]; $i9 < $l9; $i9++, codeword = codewords[$i9]) {
            if (codeword == null) {
                continue;
            }
            codeword.setRowNumberAsRowIndicatorColumn();
            var rowIndicatorValue = codeword.Value % 30;
            var codewordRowNumber = codeword.RowNumber;
            if (!this.IsLeft) {
                codewordRowNumber += 2;
            }
            switch (codewordRowNumber % 3) {
                case 0:
                    barcodeRowCountUpperPart.setValue(rowIndicatorValue * 3 + 1);
                    break;
                case 1:
                    barcodeECLevel.setValue(rowIndicatorValue / 3);
                    barcodeRowCountLowerPart.setValue(rowIndicatorValue % 3);
                    break;
                case 2:
                    barcodeColumnCount.setValue(rowIndicatorValue + 1);
                    break;
            }
        }
        var barcodeColumnCountValues = barcodeColumnCount.getValue();
        var barcodeRowCountUpperPartValues = barcodeRowCountUpperPart.getValue();
        var barcodeRowCountLowerPartValues = barcodeRowCountLowerPart.getValue();
        var barcodeECLevelValues = barcodeECLevel.getValue();
        if ((barcodeColumnCountValues.length == 0) || (barcodeRowCountUpperPartValues.length == 0) || (barcodeRowCountLowerPartValues.length == 0) || (barcodeECLevelValues.length == 0) || barcodeColumnCountValues[0] < 1 || barcodeRowCountUpperPartValues[0] + barcodeRowCountLowerPartValues[0] < ZXing.PDF417.PDF417Common.MIN_ROWS_IN_BARCODE || barcodeRowCountUpperPartValues[0] + barcodeRowCountLowerPartValues[0] > ZXing.PDF417.PDF417Common.MAX_ROWS_IN_BARCODE) {
            return null;
        }
        var barcodeMetadata = new ZXing.PDF417.Internal.BarcodeMetadata(barcodeColumnCountValues[0], barcodeRowCountUpperPartValues[0], barcodeRowCountLowerPartValues[0], barcodeECLevelValues[0]);
        this.removeIncorrectCodewords(codewords, barcodeMetadata);
        return this.barcodeMetaData = barcodeMetadata;
    } else {
        return this.barcodeMetaData;
    }
};
ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn.prototype.removeIncorrectCodewords = function (codewords, metadata){
    for (var row = 0; row < codewords.length; row++){
        var codeword = codewords[row];
        if (codeword == null)
            continue;
        var indicatorValue = codeword.Value % 30;
        var rowNumber = codeword.RowNumber;
        if (rowNumber >= metadata.RowCount){
            codewords[row] = null;
            continue;
        }
        if (!this.IsLeft){
            rowNumber += 2;
        }
        switch (rowNumber % 3){
            default:
            case 0:
                if (indicatorValue * 3 + 1 != metadata.RowCountUpper){
                codewords[row] = null;
            }
                break;
            case 1:
                if (indicatorValue % 3 != metadata.RowCountLower || indicatorValue / 3 != metadata.ErrorCorrectionLevel){
                codewords[row] = null;
            }
                break;
            case 2:
                if (indicatorValue + 1 != metadata.ColumnCount){
                codewords[row] = null;
            }
                break;
        }
    }
};
ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn.prototype.toString = function (){
    return "Is Left: " + this.IsLeft + " \n" + ZXing.PDF417.Internal.DetectionResultColumn.prototype.toString.call(this);
};
$Inherit(ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn, ZXing.PDF417.Internal.DetectionResultColumn);


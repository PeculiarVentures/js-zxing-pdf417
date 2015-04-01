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

ZXing.PDF417.Internal.PDF417ScanningDecoder = function () {
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.CODEWORD_SKEW_SIZE = 2;
ZXing.PDF417.Internal.PDF417ScanningDecoder.MAX_ERRORS = 3;
ZXing.PDF417.Internal.PDF417ScanningDecoder.MAX_EC_CODEWORDS = 512;
ZXing.PDF417.Internal.PDF417ScanningDecoder.errorCorrection = new ZXing.PDF417.Internal.EC.ErrorCorrection();
ZXing.PDF417.Internal.PDF417ScanningDecoder.decode = function (image, imageTopLeft, imageBottomLeft, imageTopRight, imageBottomRight, minCodewordWidth, maxCodewordWidth) {
    var boundingBox = ZXing.PDF417.Internal.BoundingBox.Create(image, imageTopLeft, imageBottomLeft, imageTopRight, imageBottomRight);
    if (boundingBox == null)
        return null;
    var leftRowIndicatorColumn = null;
    var rightRowIndicatorColumn = null;
    var detectionResult = null;
    for (var i = 0; i < 2; i++) {
        if (imageTopLeft != null) {
            leftRowIndicatorColumn = ZXing.PDF417.Internal.PDF417ScanningDecoder.getRowIndicatorColumn(image, boundingBox, imageTopLeft, true, minCodewordWidth, maxCodewordWidth);
        }
        if (imageTopRight != null) {
            rightRowIndicatorColumn = ZXing.PDF417.Internal.PDF417ScanningDecoder.getRowIndicatorColumn(image, boundingBox, imageTopRight, false, minCodewordWidth, maxCodewordWidth);
        }
        detectionResult = ZXing.PDF417.Internal.PDF417ScanningDecoder.merge(leftRowIndicatorColumn, rightRowIndicatorColumn);
        if (detectionResult == null) {
            return null;
        }
        if (i == 0 && detectionResult.Box != null && (detectionResult.Box.MinY < boundingBox.MinY || detectionResult.Box.MaxY > boundingBox.MaxY)) {
            boundingBox = detectionResult.Box;
        }
        else {
            detectionResult.Box = boundingBox;
            break;
        }
    }
    var maxBarcodeColumn = detectionResult.ColumnCount + 1;
    detectionResult.DetectionResultColumns[0] = leftRowIndicatorColumn;
    detectionResult.DetectionResultColumns[maxBarcodeColumn] = rightRowIndicatorColumn;
    var leftToRight = leftRowIndicatorColumn != null;
    for (var barcodeColumnCount = 1; barcodeColumnCount <= maxBarcodeColumn; barcodeColumnCount++) {
        var barcodeColumn = leftToRight ? barcodeColumnCount : maxBarcodeColumn - barcodeColumnCount;
        if (detectionResult.DetectionResultColumns[barcodeColumn] != null) {
            continue;
        }
        var detectionResultColumn;
        if (barcodeColumn == 0 || barcodeColumn == maxBarcodeColumn) {
            detectionResultColumn = new ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn(boundingBox, barcodeColumn == 0);
        }
        else {
            detectionResultColumn = new ZXing.PDF417.Internal.DetectionResultColumn(boundingBox);
        }
        detectionResult.DetectionResultColumns[barcodeColumn] = detectionResultColumn;
        var startColumn = -1;
        var previousStartColumn = startColumn;
        for (var imageRow = boundingBox.MinY; imageRow <= boundingBox.MaxY; imageRow++) {
            startColumn = ZXing.PDF417.Internal.PDF417ScanningDecoder.getStartColumn(detectionResult, barcodeColumn, imageRow, leftToRight);
            if (startColumn < 0 || startColumn > boundingBox.MaxX) {
                if (previousStartColumn == -1) {
                    continue;
                }
                startColumn = previousStartColumn;
            }
            var codeword = ZXing.PDF417.Internal.PDF417ScanningDecoder.detectCodeword(image, boundingBox.MinX, boundingBox.MaxX, leftToRight, startColumn, imageRow, minCodewordWidth, maxCodewordWidth);
            if (codeword != null) {
                detectionResultColumn.setCodeword(imageRow, codeword);
                previousStartColumn = startColumn;
                minCodewordWidth = Math.min(minCodewordWidth, codeword.get_Width());
                maxCodewordWidth = Math.max(maxCodewordWidth, codeword.get_Width());
            }
        }
    }
    return ZXing.PDF417.Internal.PDF417ScanningDecoder.createDecoderResult(detectionResult);
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.merge = function (leftRowIndicatorColumn, rightRowIndicatorColumn) {
    if (leftRowIndicatorColumn == null && rightRowIndicatorColumn == null) {
        return null;
    }
    var barcodeMetadata = ZXing.PDF417.Internal.PDF417ScanningDecoder.getBarcodeMetadata(leftRowIndicatorColumn, rightRowIndicatorColumn);
    if (barcodeMetadata == null) {
        return null;
    }
    var boundingBox = ZXing.PDF417.Internal.BoundingBox.merge(ZXing.PDF417.Internal.PDF417ScanningDecoder.adjustBoundingBox(leftRowIndicatorColumn), ZXing.PDF417.Internal.PDF417ScanningDecoder.adjustBoundingBox(rightRowIndicatorColumn));
    return new ZXing.PDF417.Internal.DetectionResult(barcodeMetadata, boundingBox);
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.adjustBoundingBox = function (rowIndicatorColumn) {
    if (rowIndicatorColumn == null) {
        return null;
    }
    var rowHeights = rowIndicatorColumn.getRowHeights();
    if (rowHeights == null) {
        return null;
    }
    var maxRowHeight = ZXing.PDF417.Internal.PDF417ScanningDecoder.getMax(rowHeights);
    var missingStartRows = 0;
    for (var $i12 = 0, $l12 = rowHeights.length, rowHeight = rowHeights[$i12]; $i12 < $l12; $i12++, rowHeight = rowHeights[$i12]) {
        missingStartRows += maxRowHeight - rowHeight;
        if (rowHeight > 0) {
            break;
        }
    }
    var codewords = rowIndicatorColumn.Codewords;
    for (var row = 0; missingStartRows > 0 && codewords[row] == null; row++) {
        missingStartRows--;
    }
    var missingEndRows = 0;
    for (var row = rowHeights.length - 1; row >= 0; row--) {
        missingEndRows += maxRowHeight - rowHeights[row];
        if (rowHeights[row] > 0) {
            break;
        }
    }
    for (var row = codewords.length - 1; missingEndRows > 0 && codewords[row] == null; row--) {
        missingEndRows--;
    }
    return rowIndicatorColumn.Box.addMissingRows(missingStartRows, missingEndRows, rowIndicatorColumn.IsLeft);
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.getMax = function (values) {
    var maxValue = -1;
    for (var index = values.length - 1; index >= 0; index--) {
        maxValue = Math.max(maxValue, values[index]);
    }
    return maxValue;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.getBarcodeMetadata = function (leftRowIndicatorColumn, rightRowIndicatorColumn) {
    var leftBarcodeMetadata;
    if (leftRowIndicatorColumn == null || (leftBarcodeMetadata = leftRowIndicatorColumn.getBarcodeMetadata()) == null) {
        return rightRowIndicatorColumn == null ? null : rightRowIndicatorColumn.getBarcodeMetadata();
    }
    var rightBarcodeMetadata;
    if (rightRowIndicatorColumn == null || (rightBarcodeMetadata = rightRowIndicatorColumn.getBarcodeMetadata()) == null) {
        return leftBarcodeMetadata;
    }
    if (leftBarcodeMetadata.ColumnCount != rightBarcodeMetadata.ColumnCount && leftBarcodeMetadata.ErrorCorrectionLevel != rightBarcodeMetadata.ErrorCorrectionLevel && leftBarcodeMetadata.RowCount != rightBarcodeMetadata.RowCount) {
        return null;
    }
    return leftBarcodeMetadata;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.getRowIndicatorColumn = function (image, boundingBox, startPoint, leftToRight, minCodewordWidth, maxCodewordWidth) {
    var rowIndicatorColumn = new ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn(boundingBox, leftToRight);
    for (var i = 0; i < 2; i++) {
        var increment = i == 0 ? 1 : -1;
        var startColumn = startPoint.get_X();
        for (var imageRow = startPoint.get_Y() ; imageRow <= boundingBox.MaxY && imageRow >= boundingBox.MinY; imageRow += increment) {
            var codeword = ZXing.PDF417.Internal.PDF417ScanningDecoder.detectCodeword(image, 0, image.get_Width(), leftToRight, startColumn, imageRow, minCodewordWidth, maxCodewordWidth);
            if (codeword != null) {
                rowIndicatorColumn.setCodeword(imageRow, codeword);
                if (leftToRight) {
                    startColumn = codeword.StartX;
                }
                else {
                    startColumn = codeword.EndX;
                }
            }
        }
    }
    return rowIndicatorColumn;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.adjustCodewordCount = function (detectionResult, barcodeMatrix) {
    var numberOfCodewords = barcodeMatrix[0][1].getValue();
    var calculatedNumberOfCodewords = detectionResult.ColumnCount * detectionResult.get_RowCount() - ZXing.PDF417.Internal.PDF417ScanningDecoder.getNumberOfECCodeWords(detectionResult.get_ErrorCorrectionLevel());
    if (numberOfCodewords.length == 0) {
        if (calculatedNumberOfCodewords < 1 || calculatedNumberOfCodewords > ZXing.PDF417.PDF417Common.MAX_CODEWORDS_IN_BARCODE) {
            return false;
        }
        barcodeMatrix[0][1].setValue(calculatedNumberOfCodewords);
    }
    else if (numberOfCodewords[0] != calculatedNumberOfCodewords) {
        barcodeMatrix[0][1].setValue(calculatedNumberOfCodewords);
    }
    return true;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.createDecoderResult = function (detectionResult) {
    var barcodeMatrix = ZXing.PDF417.Internal.PDF417ScanningDecoder.createBarcodeMatrix(detectionResult);
    if (barcodeMatrix == null)
        return null;
    if (!ZXing.PDF417.Internal.PDF417ScanningDecoder.adjustCodewordCount(detectionResult, barcodeMatrix)) {
        return null;
    }
    var erasures = [];
    var codewords = new Int32Array(detectionResult.get_RowCount() * detectionResult.ColumnCount);
    var ambiguousIndexValuesList = [];
    var ambiguousIndexesList = [];
    for (var row = 0; row < detectionResult.get_RowCount() ; row++) {
        for (var column = 0; column < detectionResult.ColumnCount; column++) {
            var values = barcodeMatrix[row][column + 1].getValue();
            var codewordIndex = row * detectionResult.ColumnCount + column;
            if (values.length == 0) {
                erasures.push(codewordIndex);
            }
            else if (values.length == 1) {
                codewords[codewordIndex] = values[0];
            }
            else {
                ambiguousIndexesList.push(codewordIndex);
                ambiguousIndexValuesList.push(values);
            }
        }
    }
    var ambiguousIndexValues = [];
    for (var i = 0; i < ambiguousIndexValuesList.length; i++) {
        ambiguousIndexValues[i] = ambiguousIndexValuesList[i];
    }
    return ZXing.PDF417.Internal.PDF417ScanningDecoder.createDecoderResultFromAmbiguousValues(detectionResult.get_ErrorCorrectionLevel(), codewords, erasures, ambiguousIndexesList, ambiguousIndexValues);
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.createDecoderResultFromAmbiguousValues = function (ecLevel, codewords, erasureArray, ambiguousIndexes, ambiguousIndexValues) {
    var ambiguousIndexCount = new Int32Array(ambiguousIndexes.length);
    var tries = 100;
    while (tries-- > 0) {
        for (var i = 0; i < ambiguousIndexCount.length; i++) {
            codewords[ambiguousIndexes[i]] = ambiguousIndexValues[i][ambiguousIndexCount[i]];
        }
        try {
            var result = ZXing.PDF417.Internal.PDF417ScanningDecoder.decodeCodewords(codewords, ecLevel, erasureArray);
            if (result != null)
                return result;
        }
        catch ($$e1) {
        }
        if (ambiguousIndexCount.length == 0) {
            return null;
        }
        for (var i = 0; i < ambiguousIndexCount.length; i++) {
            if (ambiguousIndexCount[i] < ambiguousIndexValues[i].length - 1) {
                ambiguousIndexCount[i]++;
                break;
            }
            else {
                ambiguousIndexCount[i] = 0;
                if (i == ambiguousIndexCount.length - 1) {
                    return null;
                }
            }
        }
    }
    return null;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.createBarcodeMatrix = function (detectionResult) {
    var barcodeMatrix = new Array(detectionResult.get_RowCount());
    for (var row = 0; row < barcodeMatrix.length; row++) {
        barcodeMatrix[row] = new Array(detectionResult.ColumnCount + 2);
        for (var col = 0; col < barcodeMatrix[row].length; col++) {
            barcodeMatrix[row][col] = new ZXing.PDF417.Internal.BarcodeValue();
        }
    }
    var column = 0;
    for (var $i13 = 0, $t13 = detectionResult.getDetectionResultColumns(), $l13 = $t13.length, detectionResultColumn = $t13[$i13]; $i13 < $l13; $i13++, detectionResultColumn = $t13[$i13]) {
        if (detectionResultColumn != null) {
            for (var $i14 = 0, $t14 = detectionResultColumn.Codewords, $l14 = $t14.length, codeword = $t14[$i14]; $i14 < $l14; $i14++, codeword = $t14[$i14]) {
                if (codeword != null) {
                    var rowNumber = codeword.RowNumber;
                    if (rowNumber >= 0) {
                        if (rowNumber >= barcodeMatrix.length) {
                            return null;
                        }
                        barcodeMatrix[rowNumber][column].setValue(codeword.Value);
                    }
                }
            }
        }
        column++;
    }
    return barcodeMatrix;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.isValidBarcodeColumn = function (detectionResult, barcodeColumn) {
    return (barcodeColumn >= 0) && (barcodeColumn < detectionResult.DetectionResultColumns.length);
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.getStartColumn = function (detectionResult, barcodeColumn, imageRow, leftToRight) {
    var offset = leftToRight ? 1 : -1;
    var codeword = null;
    if (ZXing.PDF417.Internal.PDF417ScanningDecoder.isValidBarcodeColumn(detectionResult, barcodeColumn - offset)) {
        codeword = detectionResult.DetectionResultColumns[barcodeColumn - offset].getCodeword(imageRow);
    }
    if (codeword != null) {
        return leftToRight ? codeword.EndX : codeword.StartX;
    }
    codeword = detectionResult.DetectionResultColumns[barcodeColumn].getCodewordNearby(imageRow);
    if (codeword != null) {
        return leftToRight ? codeword.StartX : codeword.EndX;
    }
    if (ZXing.PDF417.Internal.PDF417ScanningDecoder.isValidBarcodeColumn(detectionResult, barcodeColumn - offset)) {
        codeword = detectionResult.DetectionResultColumns[barcodeColumn - offset].getCodewordNearby(imageRow);
    }
    if (codeword != null) {
        return leftToRight ? codeword.EndX : codeword.StartX;
    }
    var skippedColumns = 0;
    while (ZXing.PDF417.Internal.PDF417ScanningDecoder.isValidBarcodeColumn(detectionResult, barcodeColumn - offset)) {
        barcodeColumn -= offset;
        for (var $i15 = 0, $t15 = detectionResult.DetectionResultColumns[barcodeColumn].Codewords, $l15 = $t15.length, previousRowCodeword = $t15[$i15]; $i15 < $l15; $i15++, previousRowCodeword = $t15[$i15]) {
            if (previousRowCodeword != null) {
                return (leftToRight ? previousRowCodeword.EndX : previousRowCodeword.StartX) + offset * skippedColumns * (previousRowCodeword.EndX - previousRowCodeword.StartX);
            }
        }
        skippedColumns++;
    }
    return leftToRight ? detectionResult.Box.MinX : detectionResult.Box.MaxX;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.detectCodeword = function (image, minColumn, maxColumn, leftToRight, startColumn, imageRow, minCodewordWidth, maxCodewordWidth) {
    startColumn = ZXing.PDF417.Internal.PDF417ScanningDecoder.adjustCodewordStartColumn(image, minColumn, maxColumn, leftToRight, startColumn, imageRow);
    var moduleBitCount = ZXing.PDF417.Internal.PDF417ScanningDecoder.getModuleBitCount(image, minColumn, maxColumn, leftToRight, startColumn, imageRow);
    if (moduleBitCount == null) {
        return null;
    }
    var endColumn;
    var codewordBitCount = ZXing.PDF417.PDF417Common.getBitCountSum(moduleBitCount);
    if (leftToRight) {
        endColumn = startColumn + codewordBitCount;
    }
    else {
        for (var i = 0; i < (moduleBitCount.length >> 1) ; i++) {
            var tmpCount = moduleBitCount[i];
            moduleBitCount[i] = moduleBitCount[moduleBitCount.length - 1 - i];
            moduleBitCount[moduleBitCount.length - 1 - i] = tmpCount;
        }
        endColumn = startColumn;
        startColumn = endColumn - codewordBitCount;
    }
    if (!ZXing.PDF417.Internal.PDF417ScanningDecoder.checkCodewordSkew(codewordBitCount, minCodewordWidth, maxCodewordWidth)) {
        return null;
    }
    var decodedValue = ZXing.PDF417.Internal.PDF417CodewordDecoder.getDecodedValue(moduleBitCount);
    var codeword = ZXing.PDF417.PDF417Common.getCodeword(decodedValue);
    if (codeword == -1) {
        return null;
    }
    return new ZXing.PDF417.Internal.Codeword(startColumn, endColumn, ZXing.PDF417.Internal.PDF417ScanningDecoder.getCodewordBucketNumber(decodedValue), codeword);
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.getModuleBitCount = function (image, minColumn, maxColumn, leftToRight, startColumn, imageRow) {
    var imageColumn = startColumn;
    var moduleBitCount = new Int32Array(8);
    var moduleNumber = 0;
    var increment = leftToRight ? 1 : -1;
    var previousPixelValue = leftToRight;
    while (((leftToRight && imageColumn < maxColumn) || (!leftToRight && imageColumn >= minColumn)) && moduleNumber < moduleBitCount.length) {
        if (image.get_Item(imageColumn, imageRow) == previousPixelValue) {
            moduleBitCount[moduleNumber]++;
            imageColumn += increment;
        }
        else {
            moduleNumber++;
            previousPixelValue = !previousPixelValue;
        }
    }
    if (moduleNumber == moduleBitCount.length || (((leftToRight && imageColumn == maxColumn) || (!leftToRight && imageColumn == minColumn)) && moduleNumber == moduleBitCount.length - 1)) {
        return moduleBitCount;
    }
    return null;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.getNumberOfECCodeWords = function (barcodeECLevel) {
    return 2 << barcodeECLevel;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.adjustCodewordStartColumn = function (image, minColumn, maxColumn, leftToRight, codewordStartColumn, imageRow) {
    var correctedStartColumn = codewordStartColumn;
    var increment = leftToRight ? -1 : 1;
    for (var i = 0; i < 2; i++) {
        while (((leftToRight && correctedStartColumn >= minColumn) || (!leftToRight && correctedStartColumn < maxColumn)) && leftToRight == image.get_Item(correctedStartColumn, imageRow)) {
            if (Math.abs(codewordStartColumn - correctedStartColumn) > 2) {
                return codewordStartColumn;
            }
            correctedStartColumn += increment;
        }
        increment = -increment;
        leftToRight = !leftToRight;
    }
    return correctedStartColumn;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.checkCodewordSkew = function (codewordSize, minCodewordWidth, maxCodewordWidth) {
    return minCodewordWidth - 2 <= codewordSize && codewordSize <= maxCodewordWidth + 2;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.decodeCodewords = function (codewords, ecLevel, erasures) {
    if (codewords.length == 0) {
        return null;
    }
    var numECCodewords = 1 << (ecLevel + 1);
    var correctedErrorsCount = ZXing.PDF417.Internal.PDF417ScanningDecoder.correctErrors(codewords, erasures, numECCodewords);
    if (correctedErrorsCount < 0) {
        return null;
    }
    if (!ZXing.PDF417.Internal.PDF417ScanningDecoder.verifyCodewordCount(codewords, numECCodewords)) {
        return null;
    }
    var decoderResult = ZXing.PDF417.Internal.DecodedBitStreamParser.decode(codewords, ecLevel.toString());
    if (decoderResult != null) {
        decoderResult.ErrorsCorrected = correctedErrorsCount;
        decoderResult.Erasures = erasures.length;
    }
    return decoderResult;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.correctErrors = function (codewords, erasures, numECCodewords) {
    if (erasures != null && erasures.length > Math.floor(numECCodewords / 2) + 3 || numECCodewords < 0 || numECCodewords > 512) {
        return -1;
    }
    var errorCount;
    if (!(function () {
        var $1 = {
        Value: errorCount
    };
        var $res = ZXing.PDF417.Internal.PDF417ScanningDecoder.errorCorrection.decode(codewords, numECCodewords, erasures, $1);
        errorCount = $1.Value;
        return $res;
    })()) {
        return -1;
    }
    return errorCount;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.verifyCodewordCount = function (codewords, numECCodewords) {
    if (codewords.length < 4) {
        return false;
    }
    var numberOfCodewords = codewords[0];
    if (numberOfCodewords > codewords.length) {
        return false;
    }
    if (numberOfCodewords == 0) {
        if (numECCodewords < codewords.length) {
            codewords[0] = codewords.length - numECCodewords;
        }
        else {
            return false;
        }
    }
    return true;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.getBitCountForCodeword = function (codeword) {
    var result = new Int32Array(8);
    var previousValue = 0;
    var i = result.length - 1;
    while (true) {
        if ((codeword & 1) != previousValue) {
            previousValue = codeword & 1;
            i--;
            if (i < 0) {
                break;
            }
        }
        result[i]++;
        codeword >>= 1;
    }
    return result;
};
ZXing.PDF417.Internal.PDF417ScanningDecoder.getCodewordBucketNumber = function (codeword) {
    if (typeof codeword == 'number') {
        return ZXing.PDF417.Internal.PDF417ScanningDecoder.getCodewordBucketNumber(ZXing.PDF417.Internal.PDF417ScanningDecoder.getBitCountForCodeword(codeword));
    } else {
        var moduleBitCount = codeword;
        return (moduleBitCount[0] - moduleBitCount[2] + moduleBitCount[4] - moduleBitCount[6] + 9) % 9;
    }
};

ZXing.PDF417.Internal.PDF417ScanningDecoder.ToString = function (barcodeMatrix) {
    var formatter = "";
    for (var row = 0; row < barcodeMatrix.length; row++) {
        formatter += "Row {0}: ".format(FormatInteger(row, 2));
        for (var column = 0; column < barcodeMatrix[row].length; column++) {
            var barcodeValue = barcodeMatrix[row][column];
            var values = barcodeValue.getValue();
            if (values.length == 0) {
                formatter += "        ";
            }
            else {
                formatter += "{0}({1})".format(FormatInteger(values[0], 4), FormatInteger(barcodeValue.getConfidence(values[0]), 2));
            }
        }
        formatter += "\n";
    }
    return formatter;
};


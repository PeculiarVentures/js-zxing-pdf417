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

ZXing.PDF417.Internal.Detector = function () {
};
ZXing.PDF417.Internal.Detector.INDEXES_START_PATTERN = new Int32Array([0, 4, 1, 5]);
ZXing.PDF417.Internal.Detector.INDEXES_STOP_PATTERN = new Int32Array([6, 2, 7, 3]);
ZXing.PDF417.Internal.Detector.INTEGER_MATH_SHIFT = 8;
ZXing.PDF417.Internal.Detector.PATTERN_MATCH_RESULT_SCALE_FACTOR = 256;
ZXing.PDF417.Internal.Detector.MAX_AVG_VARIANCE = 107;
ZXing.PDF417.Internal.Detector.MAX_INDIVIDUAL_VARIANCE = 204;
ZXing.PDF417.Internal.Detector.START_PATTERN = new Int32Array([8, 1, 1, 1, 1, 1, 1, 3]);
ZXing.PDF417.Internal.Detector.STOP_PATTERN = new Int32Array([7, 1, 1, 3, 1, 1, 1, 2, 1]);
ZXing.PDF417.Internal.Detector.MAX_PIXEL_DRIFT = 3;
ZXing.PDF417.Internal.Detector.MAX_PATTERN_DRIFT = 5;
ZXing.PDF417.Internal.Detector.SKIPPED_ROW_COUNT_MAX = 25;
ZXing.PDF417.Internal.Detector.ROW_STEP = 5;
ZXing.PDF417.Internal.Detector.BARCODE_MIN_HEIGHT = 10;
ZXing.PDF417.Internal.Detector.detectSingle = function (image, hints, multiple) {
    var bitMatrix = image.get_BlackMatrix();
    if (bitMatrix == null)
        return null;
    var barcodeCoordinates = ZXing.PDF417.Internal.Detector.detectMultiple(multiple, bitMatrix);
    if (barcodeCoordinates == null || barcodeCoordinates.length == 0) {
        //bitMatrix = $.extend({}, bitMatrix, true);
        bitMatrix = new ZXing.Common.BitMatrix(bitMatrix.width, bitMatrix.height, bitMatrix.rowSize, JSON.parse(JSON.stringify(bitMatrix.bits)));
        bitMatrix.rotate180();
        barcodeCoordinates = ZXing.PDF417.Internal.Detector.detectMultiple(multiple, bitMatrix);
    }
    return new ZXing.PDF417.Internal.PDF417DetectorResult(bitMatrix, barcodeCoordinates);
};
ZXing.PDF417.Internal.Detector.detectMultiple = function (multiple, bitMatrix) {
    var barcodeCoordinates = [];
    var row = 0;
    var column = 0;
    var foundBarcodeInRow = false;
    while (row < bitMatrix.height) {
        var vertices = ZXing.PDF417.Internal.Detector.findVertices(bitMatrix, row, column);
        if (vertices[0] == null && vertices[3] == null) {
            if (!foundBarcodeInRow) {
                break;
            }
            foundBarcodeInRow = false;
            column = 0;
            var n = barcodeCoordinates.length;
            for (var $i = 0 ; $i < n ; $i++) {
                var barcodeCoordinate = barcodeCoordinates[$i];
                if (barcodeCoordinate[1] != null) {
                    row = Math.max(row, barcodeCoordinate[1].x);
                }
                if (barcodeCoordinate[3] != null) {
                    row = Math.max(row, barcodeCoordinate[3].x);
                }
            }
            row += 5;
            continue;
        }
        foundBarcodeInRow = true;
        barcodeCoordinates.push(vertices);
        if (!multiple) {
            break;
        }
        if (vertices[2] != null) {
            column = vertices[2].x;
            row = vertices[2].x;
        }
        else {
            column = vertices[4].x;
            row = vertices[4].x;
        }
    }
    return barcodeCoordinates;
};
ZXing.PDF417.Internal.Detector.findVertices = function (matrix, startRow, startColumn) {
    var height = matrix.height;
    var width = matrix.width;
    var result = new Array(8);
    ZXing.PDF417.Internal.Detector.copyToResult(result, ZXing.PDF417.Internal.Detector.findRowsWithPattern(matrix, height, width, startRow, startColumn, ZXing.PDF417.Internal.Detector.START_PATTERN), ZXing.PDF417.Internal.Detector.INDEXES_START_PATTERN);
    if (result[4] != null) {
        startColumn = result[4].x;
        startRow = result[4].x;
    }
    ZXing.PDF417.Internal.Detector.copyToResult(result, ZXing.PDF417.Internal.Detector.findRowsWithPattern(matrix, height, width, startRow, startColumn, ZXing.PDF417.Internal.Detector.STOP_PATTERN), ZXing.PDF417.Internal.Detector.INDEXES_STOP_PATTERN);
    return result;
};
ZXing.PDF417.Internal.Detector.copyToResult = function (result, tmpResult, destinationIndexes) {
    for (var i = 0; i < destinationIndexes.length; i++) {
        result[destinationIndexes[i]] = tmpResult[i];
    }
};
ZXing.PDF417.Internal.Detector.findRowsWithPattern = function (matrix, height, width, startRow, startColumn, pattern) {
    var result = new Array(4);
    var found = false;
    var counters = new Array(pattern.length);
    for (; startRow < height; startRow += 5) {
        var loc = ZXing.PDF417.Internal.Detector.findGuardPattern(matrix, startColumn, startRow, width, false, pattern, counters);
        if (loc != null) {
            while (startRow > 0) {
                var previousRowLoc = ZXing.PDF417.Internal.Detector.findGuardPattern(matrix, startColumn, --startRow, width, false, pattern, counters);
                if (previousRowLoc != null) {
                    loc = previousRowLoc;
                }
                else {
                    startRow++;
                    break;
                }
            }
            result[0] = new ZXing.ResultPoint(loc[0], startRow);
            result[1] = new ZXing.ResultPoint(loc[1], startRow);
            found = true;
            break;
        }
    }
    var stopRow = startRow + 1;
    if (found) {
        var skippedRowCount = 0;
        previousRowLoc = new Int32Array([result[0].x, result[1].x]);
        for (; stopRow < height; stopRow++) {
            loc = ZXing.PDF417.Internal.Detector.findGuardPattern(matrix, previousRowLoc[0], stopRow, width, false, pattern, counters);
            if (loc != null && Math.abs(previousRowLoc[0] - loc[0]) < 5 && Math.abs(previousRowLoc[1] - loc[1]) < 5) {
                previousRowLoc = loc;
                skippedRowCount = 0;
            }
            else {
                if (skippedRowCount > 25) {
                    break;
                }
                else {
                    skippedRowCount++;
                }
            }
        }
        stopRow -= skippedRowCount + 1;
        result[2] = new ZXing.ResultPoint(previousRowLoc[0], stopRow);
        result[3] = new ZXing.ResultPoint(previousRowLoc[1], stopRow);
    }
    if (stopRow - startRow < 10) {
        for (var i = 0; i < result.length; i++) {
            result[i] = null;
        }
    }
    return result;
};
ZXing.PDF417.Internal.Detector.findGuardPattern = function (matrix, column, row, width, whiteFirst, pattern, counters) {
    ZXing.SupportClass.Fill(counters, 0);
    var patternLength = pattern.length;
    var isWhite = whiteFirst;
    var patternStart = column;
    var pixelDrift = 0;
    while (matrix.get_Item(patternStart, row) && patternStart > 0 && pixelDrift++ < 3) {
        patternStart--;
    }
    var x = patternStart;
    var counterPosition = 0;
    for (; x < width; x++) {
        var pixel = matrix.get_Item(x, row);
        if (pixel ^ isWhite) {
            counters[counterPosition]++;
        }
        else {
            if (counterPosition == patternLength - 1) {
                if (ZXing.PDF417.Internal.Detector.patternMatchVariance(counters, pattern, 204) < 107) {
                    return new Int32Array([patternStart, x]);
                }
                patternStart += counters[0] + counters[1];
                //                System.Array.Copy(counters, 2, counters, 0, patternLength - 2);
                counters.blockCopy(counters, 2, 0, patternLength - 2);
                counters[patternLength - 2] = 0;
                counters[patternLength - 1] = 0;
                counterPosition--;
            }
            else {
                counterPosition++;
            }
            counters[counterPosition] = 1;
            isWhite = !isWhite;
        }
    }
    if (counterPosition == patternLength - 1) {
        if (ZXing.PDF417.Internal.Detector.patternMatchVariance(counters, pattern, 204) < 107) {
            return new Int32Array([patternStart, x - 1]);
        }
    }
    return null;
};
ZXing.PDF417.Internal.Detector.patternMatchVariance = function (counters, pattern, maxIndividualVariance) {
    var numCounters = counters.length;
    var total = 0;
    var patternLength = 0;
    for (var i = 0; i < numCounters; i++) {
        total += counters[i];
        patternLength += pattern[i];
    }
    if (total < patternLength) {
        return 2147483647;
    }
    var unitBarWidth = Math.floor((total << 8) / patternLength);
    maxIndividualVariance = (maxIndividualVariance * unitBarWidth) >> 8;
    var totalVariance = 0;
    for (var x = 0; x < numCounters; x++) {
        var counter = counters[x] << 8;
        var scaledPattern = pattern[x] * unitBarWidth;
        var variance = counter > scaledPattern ? counter - scaledPattern : scaledPattern - counter;
        if (variance > maxIndividualVariance) {
            return 2147483647;
        }
        totalVariance += variance;
    }
    return Math.floor(totalVariance / total);
};


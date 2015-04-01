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

ZXing.PDF417.Internal.PDF417CodewordDecoder = function () {
};
ZXing.PDF417.Internal.PDF417CodewordDecoder.RATIOS_TABLE = null;
ZXing.PDF417.Internal.PDF417CodewordDecoder.RATIOS_TABLE = new Array(ZXing.PDF417.PDF417Common.SYMBOL_TABLE.length);
for (var s = 0; s < ZXing.PDF417.Internal.PDF417CodewordDecoder.RATIOS_TABLE.length; s++) {
    ZXing.PDF417.Internal.PDF417CodewordDecoder.RATIOS_TABLE[s] = new Float32Array(ZXing.PDF417.PDF417Common.BARS_IN_MODULE);
}
for (var i = 0; i < ZXing.PDF417.PDF417Common.SYMBOL_TABLE.length; i++) {
    var currentSymbol = ZXing.PDF417.PDF417Common.SYMBOL_TABLE[i];
    var currentBit = currentSymbol & 1;
    for (var j = 0; j < ZXing.PDF417.PDF417Common.BARS_IN_MODULE; j++) {
        var size = 0;
        while ((currentSymbol & 1) == currentBit) {
            size += 1;
            currentSymbol >>= 1;
        }
        currentBit = currentSymbol & 1;
        ZXing.PDF417.Internal.PDF417CodewordDecoder.RATIOS_TABLE[i][ZXing.PDF417.PDF417Common.BARS_IN_MODULE - j - 1] = size / ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD;
    }
}
ZXing.PDF417.Internal.PDF417CodewordDecoder.getDecodedValue = function (moduleBitCount) {
    var decodedValue = ZXing.PDF417.Internal.PDF417CodewordDecoder.getDecodedCodewordValue(ZXing.PDF417.Internal.PDF417CodewordDecoder.sampleBitCounts(moduleBitCount));
    if (decodedValue != ZXing.PDF417.PDF417Common.INVALID_CODEWORD) {
        return decodedValue;
    }
    return ZXing.PDF417.Internal.PDF417CodewordDecoder.getClosestDecodedValue(moduleBitCount);
};
ZXing.PDF417.Internal.PDF417CodewordDecoder.sampleBitCounts = function (moduleBitCount) {
    var bitCountSum = ZXing.PDF417.PDF417Common.getBitCountSum(moduleBitCount);
    var result = new Int32Array(ZXing.PDF417.PDF417Common.BARS_IN_MODULE);
    var bitCountIndex = 0;
    var sumPreviousBits = 0;
    for (var i = 0; i < ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD; i++) {
        var sampleIndex = bitCountSum / (2 * ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD) + (i * bitCountSum) / ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD;
        if (sumPreviousBits + moduleBitCount[bitCountIndex] <= sampleIndex) {
            sumPreviousBits += moduleBitCount[bitCountIndex];
            bitCountIndex++;
        }
        result[bitCountIndex]++;
    }
    return result;
};
ZXing.PDF417.Internal.PDF417CodewordDecoder.getDecodedCodewordValue = function (moduleBitCount) {
    var decodedValue = ZXing.PDF417.Internal.PDF417CodewordDecoder.getBitValue(moduleBitCount);
    return ZXing.PDF417.PDF417Common.getCodeword(decodedValue) == ZXing.PDF417.PDF417Common.INVALID_CODEWORD ? ZXing.PDF417.PDF417Common.INVALID_CODEWORD : decodedValue;
};
ZXing.PDF417.Internal.PDF417CodewordDecoder.getBitValue = function (moduleBitCount) {
    var result = 0;
    for (var i = 0; i < moduleBitCount.length ; i++) {
        for (var bit = 0; bit < moduleBitCount[i]; bit++) {
            result = (result << 1) | (i % 2 == 0 ? 1 : 0);
        }
    }
    return result;
};
ZXing.PDF417.Internal.PDF417CodewordDecoder.getClosestDecodedValue = function (moduleBitCount) {
    var bitCountSum = ZXing.PDF417.PDF417Common.getBitCountSum(moduleBitCount);
    var bitCountRatios = new Float32Array(ZXing.PDF417.PDF417Common.BARS_IN_MODULE);
    for (var i = 0; i < bitCountRatios.length; i++) {
        bitCountRatios[i] = moduleBitCount[i] / bitCountSum;
    }
    var bestMatchError = 3.402823E+38;
    var bestMatch = ZXing.PDF417.PDF417Common.INVALID_CODEWORD;
    for (var j = 0; j < ZXing.PDF417.Internal.PDF417CodewordDecoder.RATIOS_TABLE.length; j++) {
        var error = 0;
        var ratioTableRow = ZXing.PDF417.Internal.PDF417CodewordDecoder.RATIOS_TABLE[j];
        for (var k = 0; k < ZXing.PDF417.PDF417Common.BARS_IN_MODULE; k++) {
            var diff = ratioTableRow[k] - bitCountRatios[k];
            error += diff * diff;
            if (error >= bestMatchError) {
                break;
            }
        }
        if (error < bestMatchError) {
            bestMatchError = error;
            bestMatch = ZXing.PDF417.PDF417Common.SYMBOL_TABLE[j];
        }
    }
    return bestMatch;
};


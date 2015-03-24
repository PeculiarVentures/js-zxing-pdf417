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

ZXing.PDF417.Internal.DecodedBitStreamParser = function () {
};
ZXing.PDF417.Internal.DecodedBitStreamParser.TEXT_COMPACTION_MODE_LATCH = 900;
ZXing.PDF417.Internal.DecodedBitStreamParser.BYTE_COMPACTION_MODE_LATCH = 901;
ZXing.PDF417.Internal.DecodedBitStreamParser.NUMERIC_COMPACTION_MODE_LATCH = 902;
ZXing.PDF417.Internal.DecodedBitStreamParser.BYTE_COMPACTION_MODE_LATCH_6 = 924;
ZXing.PDF417.Internal.DecodedBitStreamParser.ECI_USER_DEFINED = 925;
ZXing.PDF417.Internal.DecodedBitStreamParser.ECI_GENERAL_PURPOSE = 926;
ZXing.PDF417.Internal.DecodedBitStreamParser.ECI_CHARSET = 927;
ZXing.PDF417.Internal.DecodedBitStreamParser.BEGIN_MACRO_PDF417_CONTROL_BLOCK = 928;
ZXing.PDF417.Internal.DecodedBitStreamParser.BEGIN_MACRO_PDF417_OPTIONAL_FIELD = 923;
ZXing.PDF417.Internal.DecodedBitStreamParser.MACRO_PDF417_TERMINATOR = 922;
ZXing.PDF417.Internal.DecodedBitStreamParser.MODE_SHIFT_TO_BYTE_COMPACTION_MODE = 913;
ZXing.PDF417.Internal.DecodedBitStreamParser.MAX_NUMERIC_CODEWORDS = 15;
ZXing.PDF417.Internal.DecodedBitStreamParser.PL = 25;
ZXing.PDF417.Internal.DecodedBitStreamParser.LL = 27;
ZXing.PDF417.Internal.DecodedBitStreamParser.AS = 27;
ZXing.PDF417.Internal.DecodedBitStreamParser.ML = 28;
ZXing.PDF417.Internal.DecodedBitStreamParser.AL = 28;
ZXing.PDF417.Internal.DecodedBitStreamParser.PS = 29;
ZXing.PDF417.Internal.DecodedBitStreamParser.PAL = 29;
ZXing.PDF417.Internal.DecodedBitStreamParser.PUNCT_CHARS = [";", "<", ">", "@", "[", "\\", "]", "_", "`", "~", "!", "\r", "\t", ",", ":", "\n", "-", ".", "$", "/", "\"", "|", "*", "(", ")", "?", "{", "}", "\'"];
ZXing.PDF417.Internal.DecodedBitStreamParser.MIXED_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "&", "\r", "\t", ",", ":", "#", "-", ".", "$", "/", "+", "%", "*", "=", "^"];
ZXing.PDF417.Internal.DecodedBitStreamParser.EXP900 = null;
ZXing.PDF417.Internal.DecodedBitStreamParser.NUMBER_OF_SEQUENCE_CODEWORDS = 2;
ZXing.PDF417.Internal.DecodedBitStreamParser.EXP900 = new Array(16);
ZXing.PDF417.Internal.DecodedBitStreamParser.EXP900[0] = BigInteger.ONE;
var nineHundred = new BigInteger(900);
ZXing.PDF417.Internal.DecodedBitStreamParser.EXP900[1] = nineHundred;
for (var i = 2; i < ZXing.PDF417.Internal.DecodedBitStreamParser.EXP900.length; i++) {
    ZXing.PDF417.Internal.DecodedBitStreamParser.EXP900[i] = BigInteger.multiply(ZXing.PDF417.Internal.DecodedBitStreamParser.EXP900[i - 1], nineHundred);
}
ZXing.PDF417.Internal.DecodedBitStreamParser.decode = function (codewords, ecLevel) {
    var result = "";
    var codeIndex = 1;
    var code = codewords[codeIndex++];
    var resultMetadata = new ZXing.PDF417.PDF417ResultMetadata();
    while (codeIndex < codewords[0]) {
        switch (code) {
            case 900:
                var p1 = { mode: code, codewords: codewords, codeIndex: codeIndex, result: result };
                codeIndex = ZXing.PDF417.Internal.DecodedBitStreamParser.textCompaction(p1);
                result = p1.result;
                break;
            case 901:
            case 924:
                var p1 = { mode: code, codewords: codewords, codeIndex: codeIndex, result: result };
                codeIndex = ZXing.PDF417.Internal.DecodedBitStreamParser.byteCompaction(p1);
                result = p1.result;
                break;
            case 913:
                result += (codewords[codeIndex++]);
                break;
            case 902:
                var p1 = { mode: code, codewords: codewords, codeIndex: codeIndex, result: result };
                codeIndex = ZXing.PDF417.Internal.DecodedBitStreamParser.numericCompaction(p1);
                result = p1.result;
                break;
            case 927:
                var charsetECI = ZXing.Common.CharacterSetECI.getCharacterSetECIByValue(codewords[codeIndex++]);
                break;
            case 926:
                codeIndex += 2;
                break;
            case 925:
                codeIndex++;
                break;
            case 928:
                codeIndex = ZXing.PDF417.Internal.DecodedBitStreamParser.decodeMacroBlock(codewords, codeIndex, resultMetadata);
                break;
            case 923:
            case 922:
                return null;
            default:
                codeIndex--;
                var p1 = { mode: code, codewords: codewords, codeIndex: codeIndex, result: result };
                codeIndex = ZXing.PDF417.Internal.DecodedBitStreamParser.textCompaction(p1);
                result = p1.result;
                break;
        }
        if (codeIndex < 0)
            return null;
        if (codeIndex < codewords.length) {
            code = codewords[codeIndex++];
        }
        else {
            return null;
        }
    }
    if (result.length == 0) {
        return null;
    }
    var decoderResult = new ZXing.Common.DecoderResult(null, result.toString(), null, ecLevel);
    decoderResult.Other = resultMetadata;
    return decoderResult;
};

ZXing.PDF417.Internal.DecodedBitStreamParser.decodeMacroBlock = function (codewords, codeIndex, resultMetadata) {
    if (codeIndex + 2 > codewords[0]) {
        return -1;
    }
    var segmentIndexArray = new Int32Array(2);
    for (var i = 0; i < 2; i++, codeIndex++) {
        segmentIndexArray[i] = codewords[codeIndex];
    }
    var s = ZXing.PDF417.Internal.DecodedBitStreamParser.decodeBase900toBase10(segmentIndexArray, 2);
    if (s == null)
        return -1;
    resultMetadata.set_SegmentIndex(parseInt(s));
    var fileId = "";
    var p1 = { codewords: codewords, codeIndex: codeIndex, result: fileId };
    codeIndex = ZXing.PDF417.Internal.DecodedBitStreamParser.textCompaction(p1);
    fileId = p.result;
    resultMetadata.set_FileId(fileId);
    if (codewords[codeIndex] == 923) {
        codeIndex++;
        var additionalOptionCodeWords = new Int32Array(codewords[0] - codeIndex);
        var additionalOptionCodeWordsIndex = 0;
        var end = false;
        while ((codeIndex < codewords[0]) && !end) {
            var code = codewords[codeIndex++];
            if (code < 900) {
                additionalOptionCodeWords[additionalOptionCodeWordsIndex++] = code;
            }
            else {
                switch (code) {
                    case 922:
                        resultMetadata.set_IsLastSegment(true);
                        codeIndex++;
                        end = true;
                        break;
                    default:
                        return -1;
                }
            }
        }
        resultMetadata.set_OptionalData(additionalOptionCodeWords.slice(0));
    }
    else if (codewords[codeIndex] == 922) {
        resultMetadata.set_IsLastSegment(true);
        codeIndex++;
    }
    return codeIndex;
};
ZXing.PDF417.Internal.DecodedBitStreamParser.textCompaction = function (p) {
    var codewords = p.codewords, codeIndex = p.codeIndex, result = p.result;
    var textCompactionData = new Int32Array((codewords[0] - codeIndex) << 1);
    var byteCompactionData = new Int32Array((codewords[0] - codeIndex) << 1);
    var index = 0;
    var end = false;
    while ((codeIndex < codewords[0]) && !end) {
        var code = codewords[codeIndex++];
        if (code < 900) {
            textCompactionData[index] = Math.floor(code / 30);
            textCompactionData[index + 1] = code % 30;
            index += 2;
        }
        else {
            switch (code) {
                case 900:
                    textCompactionData[index++] = 900;
                    break;
                case 901:
                case 924:
                case 902:
                case 928:
                case 923:
                case 922:
                    codeIndex--;
                    end = true;
                    break;
                case 913:
                    textCompactionData[index] = 913;
                    code = codewords[codeIndex++];
                    byteCompactionData[index] = code;
                    index++;
                    break;
            }
        }
    }
    var p1 = { textCompactionData: textCompactionData, byteCompactionData: byteCompactionData, length: index, result: result }
    ZXing.PDF417.Internal.DecodedBitStreamParser.decodeTextCompaction(p1);
    p.result = p1.result;
    return codeIndex;
};
ZXing.PDF417.Internal.DecodedBitStreamParser.decodeTextCompaction = function (p) {
    var textCompactionData = p.textCompactionData, byteCompactionData = p.byteCompactionData, length = p.length;
    var subMode = 0;
    var priorToShiftMode = 0;
    var i = 0;
    while (i < length) {
        var subModeCh = textCompactionData[i];
        var ch = null;
        switch (subMode) {
            case 0:
                if (subModeCh < 26) {
                    ch = String.fromCharCode(65 + subModeCh);
                }
                else {
                    if (subModeCh == 26) {
                        ch = " ";
                    }
                    else if (subModeCh == 27) {
                        subMode = 1;
                    }
                    else if (subModeCh == 28) {
                        subMode = 2;
                    }
                    else if (subModeCh == 29) {
                        priorToShiftMode = subMode;
                        subMode = 5;
                    }
                    else if (subModeCh == 913) {
                        p.result += String.fromCharCode(byteCompactionData[i]);
                    }
                    else if (subModeCh == 900) {
                        subMode = 0;
                    }
                }
                break;
            case 1:
                if (subModeCh < 26) {
                    ch = String.fromCharCode(97 + subModeCh);
                }
                else {
                    if (subModeCh == 26) {
                        ch = " ";
                    }
                    else if (subModeCh == 27) {
                        priorToShiftMode = subMode;
                        subMode = 4;
                    }
                    else if (subModeCh == 28) {
                        subMode = 2;
                    }
                    else if (subModeCh == 29) {
                        priorToShiftMode = subMode;
                        subMode = 5;
                    }
                    else if (subModeCh == 913) {
                        p.result += String.fromCharCode(byteCompactionData[i]);
                    }
                    else if (subModeCh == 900) {
                        subMode = 0;
                    }
                }
                break;
            case 2:
                if (subModeCh < 25) {
                    ch = ZXing.PDF417.Internal.DecodedBitStreamParser.MIXED_CHARS[subModeCh];
                }
                else {
                    if (subModeCh == 25) {
                        subMode = 3;
                    }
                    else if (subModeCh == 26) {
                        ch = " ";
                    }
                    else if (subModeCh == 27) {
                        subMode = 1;
                    }
                    else if (subModeCh == 28) {
                        subMode = 0;
                    }
                    else if (subModeCh == 29) {
                        priorToShiftMode = subMode;
                        subMode = 5;
                    }
                    else if (subModeCh == 913) {
                        p.result += String.fromCharCode(byteCompactionData[i]);
                    }
                    else if (subModeCh == 900) {
                        subMode = 0;
                    }
                }
                break;
            case 3:
                if (subModeCh < 29) {
                    ch = ZXing.PDF417.Internal.DecodedBitStreamParser.PUNCT_CHARS[subModeCh];
                }
                else {
                    if (subModeCh == 29) {
                        subMode = 0;
                    }
                    else if (subModeCh == 913) {
                        p.result += String.fromCharCode(byteCompactionData[i]);
                    }
                    else if (subModeCh == 900) {
                        subMode = 0;
                    }
                }
                break;
            case 4:
                subMode = priorToShiftMode;
                if (subModeCh < 26) {
                    ch = (65 + subModeCh);
                }
                else {
                    if (subModeCh == 26) {
                        ch = " ";
                    }
                    else if (subModeCh == 900) {
                        subMode = 0;
                    }
                }
                break;
            case 5:
                subMode = priorToShiftMode;
                if (subModeCh < 29) {
                    ch = ZXing.PDF417.Internal.DecodedBitStreamParser.PUNCT_CHARS[subModeCh];
                }
                else {
                    if (subModeCh == 29) {
                        subMode = 0;
                    }
                    else if (subModeCh == 913) {
                        p.result += String.fromCharCode(byteCompactionData[i]);
                    }
                    else if (subModeCh == 900) {
                        subMode = 0;
                    }
                }
                break;
        }
        if (ch !== null) {
            p.result += ch;
        }
        i++;
    }
};
ZXing.PDF417.Internal.DecodedBitStreamParser.byteCompaction = function (p) {
    var mode = p.mode, codewords = p.codewords, codeIndex = p.codeIndex;
    var decodedBytes = [];
    if (mode == 901) {
        var count = 0;
        var value = 0;
        var byteCompactedCodewords = new Int32Array(6);
        var end = false;
        var nextCode = codewords[codeIndex++];
        while ((codeIndex < codewords[0]) && !end) {
            byteCompactedCodewords[count++] = nextCode;
            value = 900 * value + nextCode;
            nextCode = codewords[codeIndex++];
            if (nextCode == 900 || nextCode == 901 || nextCode == 902 || nextCode == 924 || nextCode == 928 || nextCode == 923 || nextCode == 922) {
                codeIndex--;
                end = true;
            }
            else {
                if ((count % 5 == 0) && (count > 0)) {
                    for (var j = 0; j < 6; ++j) {
                        decodedBytes.push((value >> (8 * (5 - j))));
                    }
                    value = 0;
                    count = 0;
                }
            }
        }
        if (codeIndex == codewords[0] && nextCode < 900)
            byteCompactedCodewords[count++] = nextCode;
        for (var i = 0; i < count; i++) {
            decodedBytes.push(byteCompactedCodewords[i]);
        }
    }
    else if (mode == 924) {
        var count = 0;
        var value = 0;
        var end = false;
        while (codeIndex < codewords[0] && !end) {
            var code = codewords[codeIndex++];
            if (code < 900) {
                count++;
                value = 900 * value + code;
            }
            else {
                if (code == 900 || code == 901 || code == 902 || code == 924 || code == 928 || code == 923 || code == 922) {
                    codeIndex--;
                    end = true;
                }
            }
            if ((count % 5 == 0) && (count > 0)) {
                for (var j = 0; j < 6; ++j) {
                    decodedBytes.push((value >> (8 * (5 - j))));
                }
                value = 0;
                count = 0;
            }
        }
    }
    var bytes = decodedBytes;
    p.result += (String.fromCharCode.apply(null, bytes));
    return codeIndex;
};
ZXing.PDF417.Internal.DecodedBitStreamParser.numericCompaction = function (p) {
    var codewords = p.codewords, codeIndex = p.codeIndex;

    var count = 0;
    var end = false;
    var numericCodewords = new Int32Array(15);
    while (codeIndex < codewords[0] && !end) {
        var code = codewords[codeIndex++];
        if (codeIndex == codewords[0]) {
            end = true;
        }
        if (code < 900) {
            numericCodewords[count] = code;
            count++;
        }
        else {
            if (code == 900 || code == 901 || code == 924 || code == 928 || code == 923 || code == 922) {
                codeIndex--;
                end = true;
            }
        }
        if (count % 15 == 0 || code == 902 || end) {
            if (count > 0) {
                var s = ZXing.PDF417.Internal.DecodedBitStreamParser.decodeBase900toBase10(numericCodewords, count);
                if (s == null)
                    return -1;
                p.result += (s);
                count = 0;
            }
        }
    }
    return codeIndex;
};
ZXing.PDF417.Internal.DecodedBitStreamParser.decodeBase900toBase10 = function (codewords, count) {
    var result = BigInteger.ZERO;
    for (var i = 0; i < count; i++) {
        result = result.add(BigInteger.multiply(ZXing.PDF417.Internal.DecodedBitStreamParser.EXP900[count - i - 1], new BigInteger(codewords[i])));
    }
    var resultString = result.toString();
    if (resultString.charAt(0) != "1") {
        return null;
    }
    return resultString.substr(1);
};


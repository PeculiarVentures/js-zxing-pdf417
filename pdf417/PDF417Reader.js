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

ZXing.PDF417.PDF417Reader = function () {
};

ZXing.PDF417.PDF417Reader.prototype.decode = function (image, hints) {
    var results = ZXing.PDF417.PDF417Reader.decode(image, hints || null, false);
    if (results.length == 0) {
        return null;
    }
    else {
        return results[0];
    }
};
ZXing.PDF417.PDF417Reader.prototype.decodeMultiple = function (image, hints) {
    return ZXing.PDF417.PDF417Reader.decode(image, hints || null, true);
};
ZXing.PDF417.PDF417Reader.decode = function (image, hints, multiple, dr) {
    var results = [];
    var detectorResult = dr || ZXing.PDF417.Internal.Detector.detectSingle(image, hints, multiple);
    if (detectorResult) {
        var pointsList = detectorResult.Points;
        for (var $i = 0, $n = pointsList.length ; $i < $n; $i++) {
            var points = pointsList[$i];
            var decoderResult = ZXing.PDF417.Internal.PDF417ScanningDecoder.decode(detectorResult.Bits, points[4], points[5], points[6], points[7], ZXing.PDF417.PDF417Reader.getMinCodewordWidth(points), ZXing.PDF417.PDF417Reader.getMaxCodewordWidth(points));
            if (!decoderResult) {
                continue;
            }
            var result = new ZXing.Result(decoderResult.Text, decoderResult.RawBytes, points, ZXing.BarcodeFormat.PDF_417);
            //result.putMetadata(ZXing.ResultMetadataType.ERROR_CORRECTION_LEVEL, decoderResult.ECLevel);
            result.putMetadata("ERROR_CORRECTION_LEVEL", decoderResult.ECLevel);
            var pdf417ResultMetadata = decoderResult.Other instanceof ZXing.PDF417.PDF417ResultMetadata || decoderResult.Other == null ? decoderResult.Other : (function () {
                throw new Error("InvalidCastException");
            }());
            if (pdf417ResultMetadata) {
                //result.putMetadata(ZXing.ResultMetadataType.PDF417_EXTRA_METADATA, pdf417ResultMetadata);
                result.putMetadata("PDF417_EXTRA_METADATA", pdf417ResultMetadata);
            }
            results.push(result);
        }
    }
    return results;
};
ZXing.PDF417.PDF417Reader.getMaxWidth = function (p1, p2) {
    if (!p1 || !p2) {
        return 0;
    }
    return Math.abs(p1.x - p2.x);
};
ZXing.PDF417.PDF417Reader.getMinWidth = function (p1, p2) {
    if (!p1 || !p2) {
        return 2147483647;
    }
    return Math.abs(p1.x - p2.x);
};
ZXing.PDF417.PDF417Reader.getMaxCodewordWidth = function (p) {
    return Math.max(Math.max(ZXing.PDF417.PDF417Reader.getMaxWidth(p[0], p[4]), Math.floor(ZXing.PDF417.PDF417Reader.getMaxWidth(p[6], p[2]) * ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD / ZXing.PDF417.PDF417Common.MODULES_IN_STOP_PATTERN)), Math.max(ZXing.PDF417.PDF417Reader.getMaxWidth(p[1], p[5]), Math.floor(ZXing.PDF417.PDF417Reader.getMaxWidth(p[7], p[3]) * ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD / ZXing.PDF417.PDF417Common.MODULES_IN_STOP_PATTERN)));
};
ZXing.PDF417.PDF417Reader.getMinCodewordWidth = function (p) {
    return Math.min(Math.min(ZXing.PDF417.PDF417Reader.getMinWidth(p[0], p[4]), Math.floor(ZXing.PDF417.PDF417Reader.getMinWidth(p[6], p[2]) * ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD / ZXing.PDF417.PDF417Common.MODULES_IN_STOP_PATTERN)), Math.min(ZXing.PDF417.PDF417Reader.getMinWidth(p[1], p[5]), Math.floor(ZXing.PDF417.PDF417Reader.getMinWidth(p[7], p[3]) * ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD / ZXing.PDF417.PDF417Common.MODULES_IN_STOP_PATTERN)));
};
ZXing.PDF417.PDF417Reader.prototype.reset = function () {
};


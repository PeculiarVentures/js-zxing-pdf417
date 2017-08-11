(function(exports, Error, document, Uin8Array, Uint32Array, BigInteger, undefined){
document.addEventListener("DOMContentLoaded", function() {
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

var ZeroFilledInt32Array = function (len) {
    var rv = [];
    while (--len >= 0) {
        rv.push(0);
    }
    return rv;
};

if (typeof (Uint8Array) == "undefined")
    Uint8Array = Array;
if (typeof (Int32Array) == "undefined") {
    Int32Array = Array;
} else {
    ZeroFilledInt32Array = function (size) {
        return new Int32Array(size);
    };
}

if (typeof ($Inherit) == 'undefined') {
    var $Inherit = function (ce, ce2) {

        if (typeof (Object.getOwnPropertyNames) == 'undefined') {

            for (var p in ce2.prototype)
                if (typeof (ce.prototype[p]) == 'undefined' || ce.prototype[p] == Object.prototype[p])
                    ce.prototype[p] = ce2.prototype[p];
            for (var p in ce2)
                if (typeof (ce[p]) == 'undefined')
                    ce[p] = ce2[p];
            ce.$baseCtor = ce2;

        } else {

            var props = Object.getOwnPropertyNames(ce2.prototype);
            for (var i = 0; i < props.length; i++)
                if (typeof (Object.getOwnPropertyDescriptor(ce.prototype, props[i])) == 'undefined')
                    Object.defineProperty(ce.prototype, props[i], Object.getOwnPropertyDescriptor(ce2.prototype, props[i]));

            for (var p in ce2)
                if (typeof (ce[p]) == 'undefined')
                    ce[p] = ce2[p];
            ce.$baseCtor = ce2;

        }

    }
};

function ArrayCopy(source, sourceIndex, dest, destIndex, n) {
    n = typeof n != 'undefined' ? n : source.length;
    destIndex = destIndex || 0;
    sourceIndex = sourceIndex || 0;

    var max = (dest.length > 0 && dest.length < n) ? dest.length : n;
    max += sourceIndex;

    for (; sourceIndex < max; sourceIndex++)
        dest[destIndex++] = source[sourceIndex];
}

if (typeof Array.prototype.blockCopy != 'function') {
    Array.prototype.blockCopy = function (dest, sourceIndex, destIndex, n) {
        n = typeof n != 'undefined' ? n : this.length;
        destIndex = destIndex || 0;
        sourceIndex = sourceIndex || 0;

        var max = (dest.length > 0 && dest.length < n) ? dest.length : n;
        max += sourceIndex;
        for (; sourceIndex < max; sourceIndex++)
            dest[destIndex++] = this[sourceIndex];
    }
}

if (typeof Int16Array.prototype.blockCopy != 'function') {
    Int16Array.prototype.blockCopy = Array.prototype.blockCopy;
}

if (typeof Int32Array.prototype.blockCopy != 'function') {
    Int32Array.prototype.blockCopy = Array.prototype.blockCopy;
}

if (typeof Uint16Array.prototype.blockCopy != 'function') {
    Uint16Array.prototype.blockCopy = Array.prototype.blockCopy;
}

if (typeof Uint8Array.prototype.blockCopy != 'function') {
    Uint8Array.prototype.blockCopy = Array.prototype.blockCopy;
}

if (typeof Uint32Array.prototype.blockCopy != 'function') {
    Uint32Array.prototype.blockCopy = Array.prototype.blockCopy;
}

if (typeof Uint8Array.prototype.blockCopy != 'function') {
    Uint8Array.prototype.blockCopy = Array.prototype.blockCopy;
}

if (typeof Uint8ClampedArray.prototype.blockCopy != 'function') {
    Uint8ClampedArray.prototype.blockCopy = Array.prototype.blockCopy;
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        if (arguments.length == 1 && args[0] instanceof Array) args = args[0];
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}

function FormatInteger(n, l, c) { return (n / Math.pow(10, l)).toFixed(l).substr(2).replace(/0/g, c || ' '); }

var ZXing = typeof exports != 'undefined' && typeof exports.ZXing != 'undefined' ? exports.ZXing : {};

if (typeof exports != 'undefined')
    exports.ZXing = ZXing;

if (typeof (ZXing.Common) == "undefined")
    ZXing.Common = {};

if (typeof (ZXing.Common.Detector) == "undefined")
    ZXing.Common.Detector = {};

if (typeof (ZXing.PDF417) == "undefined")
    ZXing.PDF417 = {};

if (typeof (ZXing.PDF417.Internal) == "undefined")
    ZXing.PDF417.Internal = {};

if (typeof (ZXing.PDF417.Internal.EC) == "undefined")
    ZXing.PDF417.Internal.EC = {};

ZXing.SupportClass = function () {
};
ZXing.SupportClass.GetCharsFromString = function (sourceString, sourceStart, sourceEnd, destinationArray, destinationStart) {
    var sourceCounter = sourceStart;
    var destinationCounter = destinationStart;
    while (sourceCounter < sourceEnd) {
        destinationArray[destinationCounter] = sourceString.charAt(sourceCounter);
        sourceCounter++;
        destinationCounter++;
    }
};
ZXing.SupportClass.SetCapacity = function (vector, newCapacity) {
    while (newCapacity > vector.length)
        vector.push(new T());
    while (newCapacity < vector.length)
        vector.splice(newCapacity, vector.length - newCapacity);
};
ZXing.SupportClass.toStringArray = function (strings) {
    var obj = new Object(strings);
    var result = [];
    for (var val in obj) {
        if (!(obj[val] instanceof Function))
            result.push(obj[val]);
    }
    return result;
};
ZXing.SupportClass.Join = function (separator, origvalues) {
    var builder = "";
    separator = (separator != null ? separator : "");
    if (origvalues != null) {
        var values = new Object(origvalues);
        for (var idx in values) {
            builder += values[idx];
            builder += separator;
        }
        if (builder.length > 0) {
            builder = builder.substr(0, builder.length - separator.length);
        }
    }
    return builder;
};
ZXing.SupportClass.Fill = function (array, value) {
  for(var i = 0; i < array.length; i++) {
    array[i] = value;
  }
};
ZXing.SupportClass.Fill = function (array, startIndex, endIndex, value) {
  if (arguments.length < 4) {
    value = startIndex;
    for(var i = 0; i < array.length; i++) {
        array[i] = value;
    }
  } else {
    for(var i1 = startIndex; i1 < endIndex; i1++) {
      array[i1] = value;
    }
  }
};
ZXing.SupportClass.ToBinaryString = function (x) {
  var bits = new Array(32);
  var i = 0;
  while (x) {
    bits[i++] = (x & 1) == 1 ? "1" : "0";
    x >>= 1;
  }
  var rv = new Array(i);
  for(var idx = 0; idx < i; idx++) {
    rv.push(bits[idx]);
  }
  return rv.join("");
};
ZXing.SupportClass.bitCount = function (n) {
  var ret = 0;
  while (n) {
    n &= (n - 1);
    ret++;
  }
  return ret;
};
ZXing.SupportClass.GetValue = function (hintsv, hintType, def) {
  if (hintsv.hasOwnProperty(hintType)) return hintsv[hintType];
  return def;
};


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

ZXing.ResultMetadataType = {
    OTHER: 0,
    ORIENTATION: 1,
    BYTE_SEGMENTS: 2,
    ERROR_CORRECTION_LEVEL: 3,
    ISSUE_NUMBER: 4,
    SUGGESTED_PRICE: 5,
    POSSIBLE_COUNTRY: 6,
    UPC_EAN_EXTENSION: 7,
    STRUCTURED_APPEND_SEQUENCE: 8,
    STRUCTURED_APPEND_PARITY: 9,
    PDF417_EXTRA_METADATA: 10,
    AZTEC_EXTRA_METADATA: 11
};


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

ZXing.BarcodeFormat = {
    AZTEC: 1,
    CODABAR: 2,
    CODE_39: 4,
    CODE_93: 8,
    CODE_128: 16,
    DATA_MATRIX: 32,
    EAN_8: 64,
    EAN_13: 128,
    ITF: 256,
    MAXICODE: 512,
    PDF_417: 1024,
    QR_CODE: 2048,
    RSS_14: 4096,
    RSS_EXPANDED: 8192,
    UPC_A: 16384,
    UPC_E: 32768,
    UPC_EAN_EXTENSION: 65536,
    MSI: 131072,
    PLESSEY: 262144,
    IMB: 524288,
    All_1D: 61918
};


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

ZXing.Result = function (text, rawBytes, resultPoints, format, timestamp) {
  this.Text = null;
  this.RawBytes = null;
  this.ResultPoints = null;
  this.BarcodeFormat = ZXing.BarcodeFormat.AZTEC;
  this.ResultMetadata = null;
  this.Timestamp = 0;
  if (!text&& !rawBytes) {
    throw new Error("Text and bytes are null");
  }
  this.Text = text;
  this.RawBytes = rawBytes;
  this.ResultPoints = resultPoints;
  this.BarcodeFormat = format;
  this.ResultMetadata = null;
  this.Timestamp = timestamp || ((new Date().getTime() * 10000) + 621355968000000000);
};

ZXing.Result.prototype.putMetadata = function (type, value) {
  if (!this.ResultMetadata) {
    this.ResultMetadata = {};
  }
  this.ResultMetadata[type] = value;
};
ZXing.Result.prototype.putAllMetadata = function (metadata) {
  if (metadata) {
    if (!this.ResultMetadata) {
      this.ResultMetadata = metadata;
    } else {
      for(var entry in metadata) {
        if (metadata.hasOwnProperty(entry))
          this.ResultMetadata[entry] = metadata[entry];
      }
    }
  }
};
ZXing.Result.prototype.addResultPoints = function (newPoints) {
  var oldPoints = this.ResultPoints;
  if (!oldPoints) {
    this.ResultPoints = newPoints;
  } else if (newPoints && newPoints.length > 0) {
    this.ResultPoints = oldPoints.concat(newPoints);
  }
};
ZXing.Result.prototype.toString = function () {
  if (!this.Text) {
    return "[" + this.RawBytes.length + " bytes]";
  }
  return this.Text;
};


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

ZXing.DecodeHintType = {
    OTHER: 0,
    PURE_BARCODE: 1,
    POSSIBLE_FORMATS: 2,
    TRY_HARDER: 3,
    CHARACTER_SET: 4,
    ALLOWED_LENGTHS: 5,
    ASSUME_CODE_39_CHECK_DIGIT: 6,
    NEED_RESULT_POINT_CALLBACK: 7,
    ASSUME_MSI_CHECK_DIGIT: 8,
    USE_CODE_39_EXTENDED_MODE: 9,
    RELAXED_CODE_39_EXTENDED_MODE: 10,
    TRY_HARDER_WITHOUT_ROTATION: 11,
    ASSUME_GS1: 12,
    RETURN_CODABAR_START_END: 13,
    ALLOWED_EAN_EXTENSIONS: 14
};


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

ZXing.BinaryBitmap = function (binarizer) {
    this.binarizer = null;
    this.matrix = null;
    if (binarizer instanceof ZXing.Binarizer ||
        binarizer instanceof ZXing.Common.HybridBinarizer ||
        binarizer instanceof ZXing.Common.GlobalHistogramBinarizer) {
        if (!binarizer) {
            throw new Error("Binarizer must be non-null.");
        }
        this.binarizer = binarizer;
    } else {
        var matrix = binarizer;
        if (matrix) {
            throw new Error("parameter must be non-null.");
        }
        this.matrix = matrix;
    }
};
ZXing.BinaryBitmap.prototype.get_Width = function () {
    return this.binarizer.get_Width();
};
ZXing.BinaryBitmap.prototype.get_Height = function () {
    return this.binarizer.get_Height();
};
ZXing.BinaryBitmap.prototype.getBlackRow = function (y, row) {
    return this.binarizer.getBlackRow(y, row);
};
ZXing.BinaryBitmap.prototype.get_BlackMatrix = function () {
    return (this.matrix ? this.matrix : (this.matrix = this.binarizer.get_BlackMatrix()));
};
ZXing.BinaryBitmap.prototype.get_CropSupported = function () {
    return this.binarizer.get_LuminanceSource().get_CropSupported();
};
ZXing.BinaryBitmap.prototype.crop = function (left, top, width, height) {
    var newSource = this.binarizer.get_LuminanceSource().crop(left, top, width, height);
    return new ZXing.BinaryBitmap(this.binarizer.createBinarizer(newSource));
};
ZXing.BinaryBitmap.prototype.get_RotateSupported = function () {
    return this.binarizer.get_LuminanceSource().get_RotateSupported();
};
ZXing.BinaryBitmap.prototype.rotateCounterClockwise = function () {
    var newSource = this.binarizer.get_LuminanceSource().rotateCounterClockwise();
    return new ZXing.BinaryBitmap(this.binarizer.createBinarizer(newSource));
};
ZXing.BinaryBitmap.prototype.rotateCounterClockwise45 = function () {
    var newSource = this.binarizer.get_LuminanceSource().rotateCounterClockwise45();
    return new ZXing.BinaryBitmap(this.binarizer.createBinarizer(newSource));
};
ZXing.BinaryBitmap.prototype.toString = function () {
    var blackMatrix = this.get_BlackMatrix();
    return blackMatrix ? blackMatrix.toString() : "";
};


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

ZXing.ResultPoint = function (x, y) {
    this.x = 0;
    this.y = 0;
    this.x = x;
    this.y = y;
};

ZXing.ResultPoint.prototype.Equals = function (other) {
    var otherPoint = other instanceof ZXing.ResultPoint ? other : null;
    if (!otherPoint)
        return false;
    return this.x == otherPoint.x && this.y == otherPoint.y;
};
ZXing.ResultPoint.prototype.toString = function () {
    var result = "(" + this.x + ", " + this.y + ")";
    return result;
};
ZXing.ResultPoint.orderBestPatterns = function (patterns) {
    var zeroOneDistance = ZXing.ResultPoint.distance(patterns[0], patterns[1]);
    var oneTwoDistance = ZXing.ResultPoint.distance(patterns[1], patterns[2]);
    var zeroTwoDistance = ZXing.ResultPoint.distance(patterns[0], patterns[2]);
    var pointA, pointB, pointC;
    if (oneTwoDistance >= zeroOneDistance && oneTwoDistance >= zeroTwoDistance) {
        pointB = patterns[0];
        pointA = patterns[1];
        pointC = patterns[2];
    }
    else if (zeroTwoDistance >= oneTwoDistance && zeroTwoDistance >= zeroOneDistance) {
        pointB = patterns[1];
        pointA = patterns[0];
        pointC = patterns[2];
    }
    else {
        pointB = patterns[2];
        pointA = patterns[0];
        pointC = patterns[1];
    }
    if (ZXing.ResultPoint.crossProductZ(pointA, pointB, pointC) < 0) {
        var temp = pointA;
        pointA = pointC;
        pointC = temp;
    }
    patterns[0] = pointA;
    patterns[1] = pointB;
    patterns[2] = pointC;
};
ZXing.ResultPoint.distance = function (pattern1, pattern2) {
    return ZXing.Common.Detector.MathUtils.distance(pattern1.x, pattern1.y, pattern2.x, pattern2.y);
};
ZXing.ResultPoint.crossProductZ = function (pointA, pointB, pointC) {
    var bX = pointB.x;
    var bY = pointB.y;
    return ((pointC.x - bX) * (pointA.y - bY)) - ((pointC.y - bY) * (pointA.x - bX));
};


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

ZXing.LuminanceSource = function (width, height) {
    this.width = 0;
    this.height = 0;
    this.width = width;
    this.height = height;
};
ZXing.LuminanceSource.prototype.get_Width = function () {
    return this.width;
};
ZXing.LuminanceSource.prototype.set_Width = function (value) {
    this.width = value;
};
ZXing.LuminanceSource.prototype.get_Height = function () {
    return this.height;
};
ZXing.LuminanceSource.prototype.set_Height = function (value) {
    this.height = value;
};
ZXing.LuminanceSource.prototype.get_CropSupported = function () {
    return false;
};
ZXing.LuminanceSource.prototype.crop = function (left, top, width, height) {
    throw new Error("This luminance source does not support cropping.");
};
ZXing.LuminanceSource.prototype.get_RotateSupported = function () {
    return false;
};
ZXing.LuminanceSource.prototype.rotateCounterClockwise = function () {
    throw  new Error("This luminance source does not support rotation.");
};
ZXing.LuminanceSource.prototype.rotateCounterClockwise45 = function () {
    throw new Error("This luminance source does not support rotation by 45 degrees.");
};
ZXing.LuminanceSource.prototype.get_InversionSupported = function () {
    return false;
};
ZXing.LuminanceSource.prototype.invert = function () {
    throw new Error("This luminance source does not support inversion.");
};
ZXing.LuminanceSource.prototype.toString = function () {
    var row = new Uint8Array(this.width);
    var result = "";
    for (var y = 0; y < this.height; y++) {
        row = this.getRow(y, row);
        for (var x = 0; x < this.width; x++) {
            var luminance = row[x] & 255;
            var c;
            if (luminance < 64) {
                c = "#";
            }
            else if (luminance < 128) {
                c = "+";
            }
            else if (luminance < 192) {
                c = ".";
            }
            else {
                c = " ";
            }
            result += c;
        }
        result += "\n";
    }
    return result;
};


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

ZXing.InvertedLuminanceSource = function (delegate) {
    this.delegate = null;
    this.invertedMatrix = null;
    this.delegate = delegate;
};
ZXing.InvertedLuminanceSource.prototype.getRow = function (y, row){
    row = this.delegate.getRow(y, row);
    var width = this.get_Width();
    for (var i = 0; i < width; i++){
        row[i] = (255 - (row[i] & 255));
    }
    return row;
};
ZXing.InvertedLuminanceSource.prototype.get_Matrix = function (){
    if (!this.invertedMatrix){
        var matrix = this.delegate.get_Matrix();
        var length = this.get_Width() * this.get_Height();
        this.invertedMatrix = new Uint8Array(length);
        for (var i = 0; i < length; i++){
            this.invertedMatrix[i] = (255 - (matrix[i] & 255));
        }
    }
    return this.invertedMatrix;
};
ZXing.InvertedLuminanceSource.prototype.get_CropSupported = function (){
    return this.delegate.get_CropSupported();
};
ZXing.InvertedLuminanceSource.prototype.crop = function (left, top, width, height){
    return new ZXing.InvertedLuminanceSource(this.delegate.crop(left, top, width, height));
};
ZXing.InvertedLuminanceSource.prototype.get_RotateSupported = function (){
    return this.delegate.get_RotateSupported();
};
ZXing.InvertedLuminanceSource.prototype.invert = function (){
    return this.delegate;
};
ZXing.InvertedLuminanceSource.prototype.rotateCounterClockwise = function (){
    return new ZXing.InvertedLuminanceSource(this.delegate.rotateCounterClockwise());
};
ZXing.InvertedLuminanceSource.prototype.rotateCounterClockwise45 = function (){
    return new ZXing.InvertedLuminanceSource(this.delegate.rotateCounterClockwise45());
};


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

ZXing.BaseLuminanceSource = function (width, height) {
    this.luminances = null;
    this.luminances = new Uint8Array(width * height);
};

ZXing.BaseLuminanceSource.RChannelWeight = 19562;
ZXing.BaseLuminanceSource.GChannelWeight = 38550;
ZXing.BaseLuminanceSource.BChannelWeight = 7424;
ZXing.BaseLuminanceSource.ChannelWeight = 16;

ZXing.BaseLuminanceSource = function (luminanceArray, width, height) {
    this.luminances = [];
    if (luminanceArray instanceof Array) {
        this.luminances = luminanceArray.slice(0);
    } else {
        var w = luminanceArray;
        height = width;
        width = w;
    }
    ZXing.LuminanceSource.call(this, width, height);
};
ZXing.BaseLuminanceSource.prototype.getRow = function (y, row) {
    var width = this.get_Width();
    if (!row || row.length < width) {
        row = new Uint8Array(width);
    }
    for (var i = 0; i < width; i++)
        row[i] = this.luminances[y * width + i];
    return row;
};
ZXing.BaseLuminanceSource.prototype.get_Matrix = function () {
    return this.luminances;
};
ZXing.BaseLuminanceSource.prototype.rotateCounterClockwise = function () {
    var rotatedLuminances = new Uint8Array(this.get_Width() * this.get_Height());
    var newWidth = this.get_Height();
    var newHeight = this.get_Width();
    var localLuminances = this.get_Matrix();
    for (var yold = 0; yold < this.get_Height() ; yold++) {
        for (var xold = 0; xold < this.get_Width() ; xold++) {
            var ynew = newHeight - xold - 1;
            rotatedLuminances[ynew * newWidth + yold] = localLuminances[yold * this.get_Width() + xold];
        }
    }
    return this.CreateLuminanceSource(rotatedLuminances, newWidth, newHeight);
};
ZXing.BaseLuminanceSource.prototype.rotateCounterClockwise45 = function () {
    return ZXing.LuminanceSource.commonPrototype.rotateCounterClockwise45.call(this);
};
ZXing.BaseLuminanceSource.prototype.get_RotateSupported = function () {
    return true;
};
ZXing.BaseLuminanceSource.prototype.crop = function (left, top, width, height) {
    if (left + width > this.get_Width() || top + height > this.get_Height()) {
        throw new Error("Crop rectangle does not fit within image data.");
    }
    var croppedLuminances = new Uint8Array(width * height);
    var oldLuminances = this.get_Matrix();
    var oldWidth = this.get_Width();
    var oldRightBound = left + width;
    var oldBottomBound = top + height;
    for (var yold = top, ynew = 0; yold < oldBottomBound; yold++, ynew++) {
        for (var xold = left, xnew = 0; xold < oldRightBound; xold++, xnew++) {
            croppedLuminances[ynew * width + xnew] = oldLuminances[yold * oldWidth + xold];
        }
    }
    return this.CreateLuminanceSource(croppedLuminances, width, height);
};
ZXing.BaseLuminanceSource.prototype.get_CropSupported = function () {
    return true;
};
ZXing.BaseLuminanceSource.prototype.get_InversionSupported = function () {
    return true;
};
ZXing.BaseLuminanceSource.prototype.invert = function () {
    return new ZXing.InvertedLuminanceSource(this);
};
$Inherit(ZXing.BaseLuminanceSource, ZXing.LuminanceSource);

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

ZXing.BitmapLuminanceSource = function (bitmap, w, h) {

  var debug = typeof window != 'undefined' && window.__debug === true;
  var width, height;
  if (typeof bitmap == 'number') {
    width = bitmap;
    height = w;
    ZXing.BaseLuminanceSource.call(this, width, height);
  } else {
    var canvas, data;
    if (bitmap instanceof Uint8ClampedArray) {
      width = w;
      height = h;
      data = bitmap;
    } else if (bitmap instanceof ImageData) {
      width = w || bitmap.width;
      height = h || bitmap.height;
      data = bitmap.data;
    } else {
      canvas = w;
      width = canvas.naturalWidth;
      height = canvas.naturalHeight;
      var imageData = bitmap.getImageData(0, 0, width, height);
      data = imageData.data;
    }
    ZXing.BaseLuminanceSource.call(this, width, height);

    var stride = Math.abs(data.length / height);

    if (debug) this.debugBitmap = [];
    //console.time("luminances")
    for(var y = 0; y < height; y++) {
      var strideOffset = y * stride;

      var maxIndex = (4 * width) + strideOffset;
      for(var x = strideOffset; x < maxIndex; x += 4) {
        var luminance = ((7424 * data[x] + 38550 * data[x + 1] + 19562 * data[x + 2]) >> 16);
        //var alpha = data[x + 3];
        //luminance = (((luminance * alpha) >> 8) + (255 * (255 - alpha) >> 8) + 1);

        //luminance = luminance < 50 ? 1 : (luminance > 90 ? 255 : luminance)

        this.luminances.push(luminance);
        if (debug) {
          this.debugBitmap.push(luminance);
          this.debugBitmap.push(luminance);
          this.debugBitmap.push(luminance);
          this.debugBitmap.push(255);
        }
      }
    }
    //console.timeEnd("luminances")
  }
};

ZXing.BitmapLuminanceSource.prototype.CreateLuminanceSource = function (newLuminances, width, height) {
  return (function () {
    var $v1 = new ZXing.BitmapLuminanceSource(width, height);
    $v1.luminances = newLuminances;
    return $v1;
  }).call(this);
};

$Inherit(ZXing.BitmapLuminanceSource, ZXing.BaseLuminanceSource);

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

ZXing.Common.DecoderResult = function (rawBytes, text, byteSegments, ecLevel, saSequence, saParity) {
    this.RawBytes = null;
    this.Text = null;
    this.ByteSegments = null;
    this.ECLevel = null;
    this.ErrorsCorrected = 0;
    this.StructuredAppendSequenceNumber = 0;
    this.Erasures = 0;
    this.StructuredAppendParity = 0;
    this.Other = null;
    if (rawBytes === null && text === null) {
        throw new Error();
    }
    this.RawBytes = rawBytes;
    this.Text = text;
    this.ByteSegments = byteSegments;
    this.ECLevel = ecLevel;
    this.StructuredAppendParity = typeof saParity == 'undefined' ? -1 : saParity;
    this.StructuredAppendSequenceNumber = typeof saSequence == 'undefined' ? -1 : saSequence;
    this.AmbiguousValuesCount = 0;
};

//
//  Ported to JavaScript by Patrizio Bruno 2015
//
//desertconsulting@gmail.com, https://github.com/PeculiarVentures/idscanjs
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


ZXing.Common.BitArray = function (bits, size) {
  this.bits = null;
  this.size = 0;
  this.size = arguments.length == 2 ? size : bits ? bits : 0;
  if (this.size < 1) {
    throw new Error("size must be at least 1");
  }
  this.bits = arguments.length == 2 ? bits : this.size ? ZXing.Common.BitArray.makeArray(this.size) : [];
};
ZXing.Common.BitArray._lookup = new Int32Array([32, 0, 1, 26, 2, 23, 27, 0, 3, 16, 24, 30, 28, 11, 0, 13, 4, 7, 17, 0, 25, 22, 31, 15, 29, 10, 12, 6, 0, 21, 14, 9, 5, 20, 8, 19, 18]);
ZXing.Common.BitArray.prototype.get_Size = function () {
  return this.size;
};
ZXing.Common.BitArray.prototype.get_SizeInBytes = function () {
  return (this.size + 7) >> 3;
};
ZXing.Common.BitArray.prototype.get_Item = function (i) {
  return (this.bits[i >> 5] & (1 << (i & 31))) != 0;
};
ZXing.Common.BitArray.prototype.set_Item = function (i, value) {
  if (value)
    this.bits[i >> 5] |= 1 << (i & 31);
};
ZXing.Common.BitArray.prototype.ensureCapacity = function (size) {
  var that = this,
    bits = that.bits;

  if (size > bits.length << 5) {
    that.bits = bits.slice(0);
  }
};
ZXing.Common.BitArray.prototype.flip = function (i) {
  this.bits[i >> 5] ^= 1 << (i & 31);
};
ZXing.Common.BitArray.numberOfTrailingZeros = function (num) {
  var index = (-num & num) % 37;
  if (index < 0)
    index *= -1;
  return ZXing.Common.BitArray._lookup[index];
};
ZXing.Common.BitArray.prototype.getNextSet = function (from) {
  if (from >= this.size) {
    return this.size;
  }
  var bitsOffset = from >> 5;
  var currentBits = this.bits[bitsOffset];
  currentBits &= ~((1 << (from & 31)) - 1);
  while (currentBits == 0) {
    if (++bitsOffset == this.bits.length) {
      return this.size;
    }
    currentBits = this.bits[bitsOffset];
  }
  var result = (bitsOffset << 5) + ZXing.Common.BitArray.numberOfTrailingZeros(currentBits);
  return result > this.size ? this.size : result;
};
ZXing.Common.BitArray.prototype.getNextUnset = function (from) {
  if (from >= this.size) {
    return this.size;
  }
  var bitsOffset = from >> 5;
  var currentBits = ~this.bits[bitsOffset];
  currentBits &= ~((1 << (from & 31)) - 1);
  while (currentBits == 0) {
    if (++bitsOffset == this.bits.length) {
      return this.size;
    }
    currentBits = ~this.bits[bitsOffset];
  }
  var result = (bitsOffset << 5) + ZXing.Common.BitArray.numberOfTrailingZeros(currentBits);
  return result > this.size ? this.size : result;
};
ZXing.Common.BitArray.prototype.setBulk = function (i, newBits) {
  this.bits[i >> 5] = newBits;
};
ZXing.Common.BitArray.prototype.setRange = function (start, end) {
  if (end < start) {
    throw new Error("start after end");
  }
  if (end == start) {
    return;
  }
  end--;
  var firstInt = start >> 5;
  var lastInt = end >> 5;
  for(var i = firstInt; i <= lastInt; i++) {
    var firstBit = i > firstInt ? 0 : start & 31;
    var lastBit = i < lastInt ? 31 : end & 31;
    var mask;
    if (firstBit == 0 && lastBit == 31) {
      mask = -1;
    } else {
      mask = 0;
      for(var j = firstBit; j <= lastBit; j++) {
        mask |= 1 << j;
      }
    }
    this.bits[i] |= mask;
  }
};
ZXing.Common.BitArray.prototype.clear = function () {
  var max = this.bits.length;
  for(var i = 0; i < max; i++) {
    this.bits[i] = 0;
  }
};
ZXing.Common.BitArray.prototype.isRange = function (start, end, value) {
  if (end < start) {
    throw new Error();
  }
  if (end == start) {
    return true;
  }
  end--;
  var firstInt = start >> 5;
  var lastInt = end >> 5;
  for(var i = firstInt; i <= lastInt; i++) {
    var firstBit = i > firstInt ? 0 : start & 31;
    var lastBit = i < lastInt ? 31 : end & 31;
    var mask;
    if (firstBit == 0 && lastBit == 31) {
      mask = -1;
    } else {
      mask = 0;
      for(var j = firstBit; j <= lastBit; j++) {
        mask |= 1 << j;
      }
    }
    if ((this.bits[i] & mask) != (value ? mask : 0)) {
      return false;
    }
  }
  return true;
};
ZXing.Common.BitArray.prototype.appendBit = function (bit) {
  this.ensureCapacity(this.size + 1);
  if (bit) {
    this.bits[this.size >> 5] |= 1 << (this.size & 31);
  }
  this.size++;
};
ZXing.Common.BitArray.prototype.get_Array = function () {
  return this.bits;
};
ZXing.Common.BitArray.prototype.appendBits = function (value, numBits) {
  if (numBits < 0 || numBits > 32) {
    throw new Error("Num bits must be between 0 and 32");
  }
  this.ensureCapacity(this.size + numBits);
  for(var numBitsLeft = numBits; numBitsLeft > 0; numBitsLeft--) {
    this.appendBit(((value >> (numBitsLeft - 1)) & 1) == 1);
  }
};
ZXing.Common.BitArray.prototype.appendBitArray = function (other) {
  var otherSize = other.size;
  this.ensureCapacity(this.size + otherSize);
  for(var i = 0; i < otherSize; i++) {
    this.appendBit(other.get_Item(i));
  }
};
ZXing.Common.BitArray.prototype.xor = function (other) {
  if (this.bits.length != other.bits.length) {
    throw new Error("Sizes don\'t match");
  }
  for(var i = 0; i < this.bits.length; i++) {
    this.bits[i] ^= other.bits[i];
  }
};
ZXing.Common.BitArray.prototype.toBytes = function (bitOffset, array, offset, numBytes) {
  for(var i = 0; i < numBytes; i++) {
    var theByte = 0;
    for(var j = 0; j < 8; j++) {
      if (this.get_Item(bitOffset)) {
        theByte |= 1 << (7 - j);
      }
      bitOffset++;
    }
    array[offset + i] = theByte;
  }
};
ZXing.Common.BitArray.prototype.reverse = function () {
  var newBits = [];
  var len = ((this.size - 1) >> 5);
  var oldBitsLen = len + 1;
  for(var i = 0; i < oldBitsLen; i++) {
    var x = this.bits[i];
    x = ((x >> 1) & 1431655765) | ((x & 1431655765) << 1);
    x = ((x >> 2) & 858993459) | ((x & 858993459) << 2);
    x = ((x >> 4) & 252645135) | ((x & 252645135) << 4);
    x = ((x >> 8) & 16711935) | ((x & 16711935) << 8);
    x = ((x >> 16) & 65535) | ((x & 65535) << 16);
    newBits[len - i] = x;
  }
  if (this.size != oldBitsLen * 32) {
    var leftOffset = oldBitsLen * 32 - this.size;
    var mask = 1;
    for(var i1 = 0; i1 < 31 - leftOffset; i1++)
      mask = (mask << 1) | 1;
    var currentInt = (newBits[0] >> leftOffset) & mask;
    for(var i2 = 1; i2 < oldBitsLen; i2++) {
      var nextInt = newBits[i2];
      currentInt |= nextInt << (32 - leftOffset);
      newBits[i2 - 1] = currentInt;
      currentInt = (nextInt >> leftOffset) & mask;
    }
    newBits[oldBitsLen - 1] = currentInt;
  }
  this.bits = newBits;
};
ZXing.Common.BitArray.makeArray = function (size) {
  return ZeroFilledInt32Array((size + 31) >> 5);
};
ZXing.Common.BitArray.prototype.Equals = function (o) {
  var other = o instanceof ZXing.Common.BitArray ? o : null;
  if (other == null)
    return false;
  if (this.size != other.size)
    return false;
  for(var index = 0; index < this.size; index++) {
    if (this.bits[index] != other.bits[index])
      return false;
  }
  return true;
};
ZXing.Common.BitArray.prototype.toString = function () {
  var result = "";
  for(var i = 0; i < this.size; i++) {
    if ((i & 7) == 0) {
      result += " ";
    }
    result += (this.get_Item(i) ? "X" : ".");
  }
  return result;
};
ZXing.Common.BitArray.prototype.Clone = function () {
  return new ZXing.Common.BitArray(this.bits.slice(0), this.size);
};


//
//Ported to JavaScript by Patrizio Bruno 2015
//  
//desertconsulting@gmail.com, https://github.com/PeculiarVentures/idscanjs
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

ZXing.Common.BitMatrix = function (width, height, rowSize, bits) {
  this.width = 0;
  this.height = 0;
  this.rowSize = 0;
  this.bits = null;

  if (width < 1 || typeof height != 'undefined' && height < 1) {
    throw new Error("Both dimensions must be greater than 0");
  }

  this.width = width;
  this.height = arguments.length > 1 ? height : width;
  this.rowSize = arguments.length == 4 ? rowSize : (width + 31) >> 5;
  this.bits = arguments.length == 4 ? bits : arguments.length == 3 ? rowSize : new Int32Array(this.rowSize * this.height);
};


ZXing.Common.BitMatrix.prototype.get_Width = function () {
  return this.width;
};
ZXing.Common.BitMatrix.prototype.get_Height = function () {
  return this.height;
};
ZXing.Common.BitMatrix.prototype.get_Dimension = function () {
  if (this.width != this.height) {
    throw new Error("Can\'t call Dimension on a non-square matrix");
  }
  return this.width;
};
ZXing.Common.BitMatrix.prototype.get_RowSize = function () {
  return this.rowSize;
};
ZXing.Common.BitMatrix.parse = function (stringRepresentation, setString, unsetString) {
  if (stringRepresentation == null) {
    throw new Error();
  }
  var bits = new Array(stringRepresentation.length);
  var bitsPos = 0;
  var rowStartPos = 0;
  var rowLength = -1;
  var nRows = 0;
  var pos = 0;
  while (pos < stringRepresentation.length) {
    if (stringRepresentation.substr(pos, 1) == "\n" || stringRepresentation.substr(pos, 1) == "\r") {
      if (bitsPos > rowStartPos) {
        if (rowLength == -1) {
          rowLength = bitsPos - rowStartPos;
        } else if (bitsPos - rowStartPos != rowLength) {
          throw new Error("row lengths do not match");
        }
        rowStartPos = bitsPos;
        nRows++;
      }
      pos++;
    }
    else if (stringRepresentation.substr(pos, setString.length) == setString) {
      pos += setString.length;
      bits[bitsPos] = true;
      bitsPos++;
    }
    else if (stringRepresentation.substr(pos, unsetString.length) == unsetString) {
      pos += unsetString.length;
      bits[bitsPos] = false;
      bitsPos++;
    }
    else {
      throw new Error("illegal character encountered: " + stringRepresentation.substr(pos));
    }
  }
  if (bitsPos > rowStartPos) {
    if (rowLength == -1) {
      rowLength = bitsPos - rowStartPos;
    }
    else if (bitsPos - rowStartPos != rowLength) {
      throw new Error("row lengths do not match");
    }
    nRows++;
  }
  var matrix = new ZXing.Common.BitMatrix(rowLength, nRows);
  for(var i = 0; i < bitsPos; i++) {
    if (bits[i]) {
      matrix.set_Item(i % rowLength, Math.floor(i / rowLength), true);
    }
  }
  return matrix;
};
ZXing.Common.BitMatrix.prototype.get_Item = function (x, y) {
  var offset = y * this.rowSize + (x >> 5);
  return (((this.bits[offset]) >> (x & 31)) & 1) != 0;
};
ZXing.Common.BitMatrix.prototype.set_Item = function (x, y, value) {
  var offset;
  if (value) {
    offset = y * this.rowSize + (x >> 5);
    this.bits[offset] |= 1 << (x & 31);
  } else {
    offset = y * this.rowSize + Math.floor((x / 32));
    this.bits[offset] &= ~(1 << (x & 31));
  }
};
ZXing.Common.BitMatrix.prototype.flip = function (x, y) {
  var offset = y * this.rowSize + (x >> 5);
  this.bits[offset] ^= 1 << (x & 31);
};
ZXing.Common.BitMatrix.prototype.xor = function (mask) {
  if (this.width != mask.get_Width() || this.height != mask.get_Height() || this.rowSize != mask.get_RowSize()) {
    throw new Error("input matrix dimensions do not match");
  }
  var rowArray = new ZXing.Common.BitArray(Math.floor(this.width / 32) + 1);
  for(var y = 0; y < this.height; y++) {
    var offset = y * this.rowSize;
    var row = mask.getRow(y, rowArray).get_Array();
    for(var x = 0; x < this.rowSize; x++) {
      this.bits[offset + x] ^= row[x];
    }
  }
};
ZXing.Common.BitMatrix.prototype.clear = function () {
  var max = this.bits.length;
  for(var i = 0; i < max; i++) {
    this.bits[i] = 0;
  }
};
ZXing.Common.BitMatrix.prototype.setRegion = function (left, top, width, height) {
  if (top < 0 || left < 0) {
    throw new Error("Left and top must be non negative");
  }
  if (height < 1 || width < 1) {
    throw new Error("Height and width must be at least 1");
  }
  var right = left + width;
  var bottom = top + height;
  if (bottom > this.height || right > this.width) {
    throw new Error("The region must fit inside the matrix");
  }
  for(var y = top; y < bottom; y++) {
    var offset = y * this.rowSize;
    for(var x = left; x < right; x++) {
      this.bits[offset + (x >> 5)] |= 1 << (x & 31);
    }
  }
};
ZXing.Common.BitMatrix.prototype.getRow = function (y, row) {
  if (row == null || row.get_Size() < this.width) {
    row = new ZXing.Common.BitArray(this.width);
  }
  else {
    row.clear();
  }
  var offset = y * this.rowSize;
  for(var x = 0; x < this.rowSize; x++) {
    row.setBulk(x << 5, this.bits[offset + x]);
  }
  return row;
};
ZXing.Common.BitMatrix.prototype.setRow = function (y, row) {
  row.get_Array().blockCopy(this.bits, y * this.rowSize, this.rowSize);
};
ZXing.Common.BitMatrix.prototype.rotate180 = function () {
  var width = this.get_Width();
  var height = this.get_Height();
  var topRow = new ZXing.Common.BitArray(width);
  var bottomRow = new ZXing.Common.BitArray(width);
  for(var i = 0; i < (height + 1) / 2; i++) {
    topRow = this.getRow(i, topRow);
    bottomRow = this.getRow(height - 1 - i, bottomRow);
    topRow.reverse();
    bottomRow.reverse();
    this.setRow(i, bottomRow);
    this.setRow(height - 1 - i, topRow);
  }
};
ZXing.Common.BitMatrix.prototype.getEnclosingRectangle = function () {
  var left = this.width;
  var top = this.height;
  var right = -1;
  var bottom = -1;
  for(var y = 0; y < this.height; y++) {
    for(var x32 = 0; x32 < this.rowSize; x32++) {
      var theBits = this.bits[y * this.rowSize + x32];
      if (theBits != 0) {
        if (y < top) {
          top = y;
        }
        if (y > bottom) {
          bottom = y;
        }
        if (x32 * 32 < left) {
          var bit = 0;
          while ((theBits << (31 - bit)) == 0) {
            bit++;
          }
          if ((x32 * 32 + bit) < left) {
            left = x32 * 32 + bit;
          }
        }

        if (x32 * 32 + 31 > right) {
          var bit1 = 31;
          while ((theBits >> bit) == 0) {
            bit1--;
          }
          if ((x32 * 32 + bit1) > right) {
            right = x32 * 32 + bit1;
          }
        }
      }
    }
  }
  var widthTmp = right - left;
  var heightTmp = bottom - top;
  if (widthTmp < 0 || heightTmp < 0) {
    return null;
  }
  return new Int32Array([left, top, widthTmp, heightTmp]);
};
ZXing.Common.BitMatrix.prototype.getTopLeftOnBit = function () {
  var bitsOffset = 0;
  while (bitsOffset < this.bits.length && this.bits[bitsOffset] == 0) {
    bitsOffset++;
  }
  if (bitsOffset == this.bits.length) {
    return null;
  }
  var y = Math.floor(bitsOffset / this.rowSize);
  var x = (bitsOffset % this.rowSize) << 5;
  var theBits = this.bits[bitsOffset];
  var bit = 0;
  while ((theBits << (31 - bit)) == 0) {
    bit++;
  }
  x += bit;
  return new Int32Array([x, y]);
};
ZXing.Common.BitMatrix.prototype.getBottomRightOnBit = function () {
  var bitsOffset = this.bits.length - 1;
  while (bitsOffset >= 0 && this.bits[bitsOffset] == 0) {
    bitsOffset--;
  }
  if (bitsOffset < 0) {
    return null;
  }
  var y = Math.floor(bitsOffset / this.rowSize);
  var x = (bitsOffset % this.rowSize) << 5;
  var theBits = this.bits[bitsOffset];
  var bit = 31;
  while ((theBits >> bit) == 0) {
    bit--;
  }
  x += bit;
  return new Int32Array([x, y]);
};
ZXing.Common.BitMatrix.prototype.Equals = function (obj) {
  if (!(obj instanceof ZXing.Common.BitMatrix)) {
    return false;
  }
  var other = obj instanceof ZXing.Common.BitMatrix || obj == null ? obj : (function () {
    throw new Error("InvalidCastException");
  }());
  if (this.width != other.width || this.height != other.height || this.rowSize != other.rowSize || this.bits.length != other.bits.length) {
    return false;
  }
  for(var i = 0; i < this.bits.length; i++) {
    if (this.bits[i] != other.bits[i]) {
      return false;
    }
  }
  return true;
};

ZXing.Common.BitMatrix.prototype.toString = function (setString, unsetString, lineSeparator) {
  var result = "";

  // default parameters values
  setString = setString || "X";
  unsetString = unsetString || "  ";
  lineSeparator = lineSeparator || '\n';

  for(var y = 0; y < this.height; y++) {
    for(var x = 0; x < this.width; x++) {
      result += (this.get_Item(x, y) ? setString : unsetString);
    }
    result += lineSeparator;
  }
  return result;
};
ZXing.Common.BitMatrix.prototype.Clone = function () {
  return new ZXing.Common.BitMatrix(this.width, this.height, this.rowSize, this.bits.slice(0));
};

//
//  Ported to JavaScript by Patrizio Bruno 2015
//
//  desertconsulting@gmail.com, https://github.com/PeculiarVentures/idscanjs
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

ZXing.Common.Detector.MathUtils = function () {
};

ZXing.Common.Detector.MathUtils.distance = function (aX, aY, bX, bY) {
    var xDiff = aX - bX;
    var yDiff = aY - bY;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};


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

ZXing.Common.ECI = function (value_Renamed) {
    this.value_Renamed = 0;
    this.value_Renamed = value_Renamed;
};
ZXing.Common.ECI.prototype.get_Value = function () {
    return this.value_Renamed;
};
ZXing.Common.ECI.getECIByValue = function (value_Renamed) {
    if (value_Renamed < 0 || value_Renamed > 999999) {
        throw new Error("Bad ECI value: " + value_Renamed);
    }
    if (value_Renamed < 900) {
        return ZXing.Common.CharacterSetECI.getCharacterSetECIByValue(value_Renamed);
    }
    return null;
};


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

ZXing.Common.CharacterSetECI = function (value, encodingName) {
    this.encodingName = null;
    ZXing.Common.ECI.call(this, value);
    this.encodingName = encodingName;
};
ZXing.Common.CharacterSetECI.prototype.get_EncodingName = function () {
    return this.encodingName;
};

ZXing.Common.CharacterSetECI.addCharacterSet = function (value, encodingNames) {
    if (Array.isArray(encodingNames)) {
        var eci = new ZXing.Common.CharacterSetECI(value, encodingNames[0]);
        ZXing.Common.CharacterSetECI.VALUE_TO_ECI[value] = eci;
        for (var $i4 = 0, $l4 = encodingNames.length, t = encodingNames[$i4]; $i4 < $l4; $i4++, t = encodingNames[$i4]) {
            ZXing.Common.CharacterSetECI.NAME_TO_ECI[t] = eci;
        }
    } else {
        var encodingName = encodingNames;
        var eci2 = new ZXing.Common.CharacterSetECI(value, encodingName);
        ZXing.Common.CharacterSetECI.VALUE_TO_ECI[value] = eci2;
        ZXing.Common.CharacterSetECI.NAME_TO_ECI[encodingName.toUpperCase()] = eci2;
    }
};

ZXing.Common.CharacterSetECI.VALUE_TO_ECI = null;
ZXing.Common.CharacterSetECI.NAME_TO_ECI = null;
ZXing.Common.CharacterSetECI.VALUE_TO_ECI = {};
ZXing.Common.CharacterSetECI.NAME_TO_ECI = {};
ZXing.Common.CharacterSetECI.addCharacterSet(0, "CP437");
ZXing.Common.CharacterSetECI.addCharacterSet(1, ["ISO-8859-1", "ISO8859_1"]);
ZXing.Common.CharacterSetECI.addCharacterSet(2, "CP437");
ZXing.Common.CharacterSetECI.addCharacterSet(3, ["ISO-8859-1", "ISO8859_1"]);
ZXing.Common.CharacterSetECI.addCharacterSet(4, ["ISO-8859-2", "ISO8859_2"]);
ZXing.Common.CharacterSetECI.addCharacterSet(5, ["ISO-8859-3", "ISO8859_3"]);
ZXing.Common.CharacterSetECI.addCharacterSet(6, ["ISO-8859-4", "ISO8859_4"]);
ZXing.Common.CharacterSetECI.addCharacterSet(7, ["ISO-8859-5", "ISO8859_5"]);
ZXing.Common.CharacterSetECI.addCharacterSet(8, ["ISO-8859-6", "ISO8859_6"]);
ZXing.Common.CharacterSetECI.addCharacterSet(9, ["ISO-8859-7", "ISO8859_7"]);
ZXing.Common.CharacterSetECI.addCharacterSet(10, ["ISO-8859-8", "ISO8859_8"]);
ZXing.Common.CharacterSetECI.addCharacterSet(11, ["ISO-8859-9", "ISO8859_9"]);
ZXing.Common.CharacterSetECI.addCharacterSet(12, ["ISO-8859-4", "ISO-8859-10", "ISO8859_10"]);
ZXing.Common.CharacterSetECI.addCharacterSet(13, ["ISO-8859-11", "ISO8859_11"]);
ZXing.Common.CharacterSetECI.addCharacterSet(15, ["ISO-8859-13", "ISO8859_13"]);
ZXing.Common.CharacterSetECI.addCharacterSet(16, ["ISO-8859-1", "ISO-8859-14", "ISO8859_14"]);
ZXing.Common.CharacterSetECI.addCharacterSet(17, ["ISO-8859-15", "ISO8859_15"]);
ZXing.Common.CharacterSetECI.addCharacterSet(18, ["ISO-8859-3", "ISO-8859-16", "ISO8859_16"]);
ZXing.Common.CharacterSetECI.addCharacterSet(20, ["SJIS", "Shift_JIS"]);
ZXing.Common.CharacterSetECI.addCharacterSet(21, ["WINDOWS-1250", "CP1250"]);
ZXing.Common.CharacterSetECI.addCharacterSet(22, ["WINDOWS-1251", "CP1251"]);
ZXing.Common.CharacterSetECI.addCharacterSet(23, ["WINDOWS-1252", "CP1252"]);
ZXing.Common.CharacterSetECI.addCharacterSet(24, ["WINDOWS-1256", "CP1256"]);
ZXing.Common.CharacterSetECI.addCharacterSet(25, ["UTF-16BE", "UNICODEBIG"]);
ZXing.Common.CharacterSetECI.addCharacterSet(26, ["UTF-8", "UTF8"]);
ZXing.Common.CharacterSetECI.addCharacterSet(27, "US-ASCII");
ZXing.Common.CharacterSetECI.addCharacterSet(170, "US-ASCII");
ZXing.Common.CharacterSetECI.addCharacterSet(28, "BIG5");
ZXing.Common.CharacterSetECI.addCharacterSet(29, ["GB18030", "GB2312", "EUC_CN", "GBK"]);
ZXing.Common.CharacterSetECI.addCharacterSet(30, ["EUC-KR", "EUC_KR"]);
ZXing.Common.CharacterSetECI.getCharacterSetECIByValue = function (value) {
    if (value < 0 || value >= 900) {
        return null;
    }
    return ZXing.Common.CharacterSetECI.VALUE_TO_ECI[value];
};
ZXing.Common.CharacterSetECI.getCharacterSetECIByName = function (name) {
    return ZXing.Common.CharacterSetECI.NAME_TO_ECI[name.toUpperCase()];
};
$Inherit(ZXing.Common.CharacterSetECI, ZXing.Common.ECI);


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

ZXing.Common.GlobalHistogramBinarizer = function (source) {
  this.luminances = null;
  this.buckets = null;
  ZXing.Binarizer.call(this, source);
  this.luminances = ZXing.Common.GlobalHistogramBinarizer.EMPTY;
  this.buckets = new Int32Array(32);
};
ZXing.Common.GlobalHistogramBinarizer.LUMINANCE_BITS = 5;
ZXing.Common.GlobalHistogramBinarizer.LUMINANCE_SHIFT = 3;
ZXing.Common.GlobalHistogramBinarizer.LUMINANCE_BUCKETS = 32;
ZXing.Common.GlobalHistogramBinarizer.EMPTY = new Uint8Array(0);
ZXing.Common.GlobalHistogramBinarizer.prototype.getBlackRow = function (y, row) {
  var source = this.get_LuminanceSource();
  var width = source.get_Width();
  if (row == null || row.get_Size() < width) {
    row = new ZXing.Common.BitArray(width);
  }
  else {
    row.clear();
  }
  this.initArrays(width);
  var localLuminances = source.getRow(y, this.luminances);
  var localBuckets = this.buckets;
  for(var x = 0; x < width; x++) {
    var pixel = localLuminances[x] & 255;
    localBuckets[pixel >> 3]++;
  }
  var blackPoint = 0;
  if (!(function () {
      var $1 = {
        Value: blackPoint
      };
      var $res = ZXing.Common.GlobalHistogramBinarizer.estimateBlackPoint(localBuckets, $1);
      blackPoint = $1.Value;
      return $res;
    }).call(this))
    return null;
  var left = localLuminances[0] & 255;
  var center = localLuminances[1] & 255;
  for(var x1 = 1; x1 < width - 1; x1++) {
    var right = localLuminances[x1 + 1] & 255;
    var luminance = ((center << 2) - left - right) >> 1;
    row.set_Item(x1, (luminance < blackPoint));
    left = center;
    center = right;
  }
  return row;
};
ZXing.Common.GlobalHistogramBinarizer.prototype.get_BlackMatrix = function () {
  var source = this.get_LuminanceSource();
  var localLuminances;
  var width = source.get_Width();
  var height = source.get_Height();
  var matrix = new ZXing.Common.BitMatrix(width, height);
  this.initArrays(width);
  var localBuckets = this.buckets;
  var pixel;
  for(var y = 1; y < 5; y++) {
    var row = height * Math.floor(y / 5);
    localLuminances = source.getRow(row, this.luminances);
    var right = Math.floor((width << 2) / 5);
    for(var x = width / 5; x < right; x++) {
      pixel = localLuminances[x] & 255;
      localBuckets[pixel >> 3]++;
    }
  }
  var blackPoint= 0;
  if (!(function () {
      var $1 = {
        Value: blackPoint
      };
      var $res = ZXing.Common.GlobalHistogramBinarizer.estimateBlackPoint(localBuckets, $1);
      blackPoint = $1.Value;
      return $res;
    }).call(this))
    return null;
  localLuminances = source.get_Matrix();
  for(var y1 = 0; y1 < height; y1++) {
    var offset = y1 * width;
    for(var x1 = 0; x1 < width; x1++) {
      pixel = localLuminances[offset + x1] & 255;
      matrix.set_Item(x1, y1, (pixel < blackPoint));
    }
  }
  return matrix;
};
ZXing.Common.GlobalHistogramBinarizer.prototype.createBinarizer = function (source) {
  return new ZXing.Common.GlobalHistogramBinarizer(source);
};
ZXing.Common.GlobalHistogramBinarizer.prototype.initArrays = function (luminanceSize) {
  if (this.luminances.length < luminanceSize) {
    this.luminances = new Uint8Array(luminanceSize);
  }
  for(var x = 0; x < 32; x++) {
    this.buckets[x] = 0;
  }
};
ZXing.Common.GlobalHistogramBinarizer.estimateBlackPoint = function (buckets, blackPoint) {
  blackPoint.Value = 0;
  var numBuckets = buckets.length;
  var maxBucketCount = 0;
  var firstPeak = 0;
  var firstPeakSize = 0;
  for(var x = 0; x < numBuckets; x++) {
    if (buckets[x] > firstPeakSize) {
      firstPeak = x;
      firstPeakSize = buckets[x];
    }
    if (buckets[x] > maxBucketCount) {
      maxBucketCount = buckets[x];
    }
  }
  var secondPeak = 0;
  var secondPeakScore = 0;
  var score;
  for(var x1 = 0; x1 < numBuckets; x1++) {
    var distanceToBiggest = x1 - firstPeak;
    score = buckets[x1] * distanceToBiggest * distanceToBiggest;
    if (score > secondPeakScore) {
      secondPeak = x1;
      secondPeakScore = score;
    }
  }
  if (firstPeak > secondPeak) {
    var temp = firstPeak;
    firstPeak = secondPeak;
    secondPeak = temp;
  }
  if (secondPeak - firstPeak <= numBuckets >> 4) {
    return false;
  }
  var bestValley = secondPeak - 1;
  var bestValleyScore = -1;
  for(x = secondPeak - 1; x > firstPeak; x--) {
    var fromFirst = x - firstPeak;
    score = fromFirst * fromFirst * (secondPeak - x) * (maxBucketCount - buckets[x]);
    if (score > bestValleyScore) {
      bestValley = x;
      bestValleyScore = score;
    }
  }
  blackPoint.Value = bestValley << 3;
  return true;
};
$Inherit(ZXing.Common.GlobalHistogramBinarizer, ZXing.Binarizer);


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

ZXing.Common.HybridBinarizer = function (source) {
    this.matrix = null;
    ZXing.Common.GlobalHistogramBinarizer.call(this, source);
};
ZXing.Common.HybridBinarizer.BLOCK_SIZE_POWER = 3;
ZXing.Common.HybridBinarizer.BLOCK_SIZE = 8;
ZXing.Common.HybridBinarizer.BLOCK_SIZE_MASK = 7;
ZXing.Common.HybridBinarizer.MINIMUM_DIMENSION = 40;
ZXing.Common.HybridBinarizer.MIN_DYNAMIC_RANGE = 24;
ZXing.Common.HybridBinarizer.prototype.get_BlackMatrix = function () {
    this.binarizeEntireImage();
    return this.matrix;
};
ZXing.Common.HybridBinarizer.prototype.createBinarizer = function (source) {
    return new ZXing.Common.HybridBinarizer(source);
};
ZXing.Common.HybridBinarizer.prototype.binarizeEntireImage = function () {
    if (this.matrix == null) {
        var source = this.get_LuminanceSource();
        var width = source.get_Width();
        var height = source.get_Height();
        if (width >= 40 && height >= 40) {
            var luminances = source.get_Matrix();
            var subWidth = width >> 3;
            if ((width & 7) != 0) {
                subWidth++;
            }
            var subHeight = height >> 3;
            if ((height & 7) != 0) {
                subHeight++;
            }
            var blackPoints = ZXing.Common.HybridBinarizer.calculateBlackPoints(luminances, subWidth, subHeight, width, height);
            var newMatrix = new ZXing.Common.BitMatrix(width, height);
            ZXing.Common.HybridBinarizer.calculateThresholdForBlock(luminances, subWidth, subHeight, width, height, blackPoints, newMatrix);
            this.matrix = newMatrix;
        }
        else {
            this.matrix = ZXing.Common.GlobalHistogramBinarizer.prototype.get_BlackMatrix.call(this);
        }
    }
};
ZXing.Common.HybridBinarizer.calculateThresholdForBlock = function (luminances, subWidth, subHeight, width, height, blackPoints, matrix) {
    var maxYOffset = height - 8;
    var maxXOffset = width - 8;
    var top, yoffset, xoffset, left, sum, blackRow, average;

    for (var y = 0; y < subHeight; y++) {
        yoffset = y << 3;
        if (yoffset > maxYOffset) {
            yoffset = maxYOffset;
        }
        top = ZXing.Common.HybridBinarizer.cap(y, 2, subHeight - 3);
        for (var x = 0; x < subWidth; x++) {
            xoffset = x << 3;
            if (xoffset > maxXOffset) {
                xoffset = maxXOffset;
            }
            left = ZXing.Common.HybridBinarizer.cap(x, 2, subWidth - 3);
            sum = 0;
            for (var z = -2; z <= 2; z++) {
                blackRow = blackPoints[top + z];
                sum += blackRow[left - 2];
                sum += blackRow[left - 1];
                sum += blackRow[left];
                sum += blackRow[left + 1];
                sum += blackRow[left + 2];
            }
            average = Math.floor(sum / 25);
            ZXing.Common.HybridBinarizer.thresholdBlock(luminances, xoffset, yoffset, average, width, matrix);
        }
    }
};
ZXing.Common.HybridBinarizer.cap = function (value, min, max) {
    return value < min ? min : value > max ? max : value;
};
ZXing.Common.HybridBinarizer.thresholdBlock = function (luminances, xoffset, yoffset, threshold, stride, matrix) {
    var offset = (yoffset * stride) + xoffset;
    var pixel;

    for (var y = 0; y < 8; y++, offset += stride) {
        for (var x = 0; x < 8; x++) {
            pixel = luminances[offset + x] & 255;
            matrix.set_Item(xoffset + x, yoffset + y, (pixel <= threshold));
        }
    }
};
ZXing.Common.HybridBinarizer.calculateBlackPoints = function (luminances, subWidth, subHeight, width, height) {
    var blackPoints = new Array(subHeight);
    var maxYOffset = height - 8;
    var maxXOffset = width - 8;
    for (var i = 0; i < subHeight; i++) {
        blackPoints[i] = new Int32Array(subWidth);
    }
    for (var y = 0; y < subHeight; y++) {
        var yoffset = y << 3;
        if (yoffset > maxYOffset) {
            yoffset = maxYOffset;
        }
        for (var x = 0; x < subWidth; x++) {
            var xoffset = x << 3;
            if (xoffset > maxXOffset) {
                xoffset = maxXOffset;
            }
            var sum = 0;
            var min = 255;
            var max = 0;
            for (var yy = 0, offset = yoffset * width + xoffset; yy < 8; yy++, offset += width) {
                for (var xx = 0; xx < 8; xx++) {
                    var pixel = luminances[offset + xx] & 255;
                    sum += pixel;
                    if (pixel < min) {
                        min = pixel;
                    }
                    if (pixel > max) {
                        max = pixel;
                    }
                }
                if (max - min > 24) {
                    for (yy++, offset += width; yy < 8; yy++, offset += width) {
                        for (xx = 0; xx < 8; xx++) {
                            sum += luminances[offset + xx] & 255;
                        }
                    }
                }
            }
            var average = sum >> (6);
            if (max - min <= 24) {
                average = min >> 1;
                if (y > 0 && x > 0) {
                    var averageNeighborBlackPoint = (blackPoints[y - 1][x] + (2 * blackPoints[y][x - 1]) + blackPoints[y - 1][x - 1]) >> 2;
                    if (min < averageNeighborBlackPoint) {
                        average = averageNeighborBlackPoint;
                    }
                }
            }
            blackPoints[y][x] = average;
        }
    }
    return blackPoints;
};
$Inherit(ZXing.Common.HybridBinarizer, ZXing.Common.GlobalHistogramBinarizer);


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

ZXing.PDF417.PDF417ResultMetadata = function () {
    this.SegmentIndex = 0;
    this.FileId = null;
    this.OptionalData = null;
    this.IsLastSegment = false;
};


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

ZXing.PDF417.PDF417Common = function () {
};

ZXing.PDF417.PDF417Common.INVALID_CODEWORD = -1;
ZXing.PDF417.PDF417Common.NUMBER_OF_CODEWORDS = 929;
ZXing.PDF417.PDF417Common.MAX_CODEWORDS_IN_BARCODE = ZXing.PDF417.PDF417Common.NUMBER_OF_CODEWORDS - 1;
ZXing.PDF417.PDF417Common.MIN_ROWS_IN_BARCODE = 3;
ZXing.PDF417.PDF417Common.MAX_ROWS_IN_BARCODE = 90;
ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD = 17;
ZXing.PDF417.PDF417Common.MODULES_IN_STOP_PATTERN = 18;
ZXing.PDF417.PDF417Common.BARS_IN_MODULE = 8;
ZXing.PDF417.PDF417Common.EMPTY_INT_ARRAY = new Int32Array(0);
ZXing.PDF417.PDF417Common.SYMBOL_TABLE = [66142, 66170, 66206, 66236, 66290, 66292, 66350, 66382, 66396, 66454, 66470, 66476, 66594, 66600, 66614, 66626, 66628, 66632, 66640, 66654, 66662, 66668, 66682, 66690, 66718, 66720, 66748, 66758, 66776, 66798, 66802, 66804, 66820, 66824, 66832, 66846, 66848, 66876, 66880, 66936, 66950, 66956, 66968, 66992, 67006, 67022, 67036, 67042, 67044, 67048, 67062, 67118, 67150, 67164, 67214, 67228, 67256, 67294, 67322, 67350, 67366, 67372, 67398, 67404, 67416, 67438, 67474, 67476, 67490, 67492, 67496, 67510, 67618, 67624, 67650, 67656, 67664, 67678, 67686, 67692, 67706, 67714, 67716, 67728, 67742, 67744, 67772, 67782, 67788, 67800, 67822, 67826, 67828, 67842, 67848, 67870, 67872, 67900, 67904, 67960, 67974, 67992, 68016, 68030, 68046, 68060, 68066, 68068, 68072, 68086, 68104, 68112, 68126, 68128, 68156, 68160, 68216, 68336, 68358, 68364, 68376, 68400, 68414, 68448, 68476, 68494, 68508, 68536, 68546, 68548, 68552, 68560, 68574, 68582, 68588, 68654, 68686, 68700, 68706, 68708, 68712, 68726, 68750, 68764, 68792, 68802, 68804, 68808, 68816, 68830, 68838, 68844, 68858, 68878, 68892, 68920, 68976, 68990, 68994, 68996, 69000, 69008, 69022, 69024, 69052, 69062, 69068, 69080, 69102, 69106, 69108, 69142, 69158, 69164, 69190, 69208, 69230, 69254, 69260, 69272, 69296, 69310, 69326, 69340, 69386, 69394, 69396, 69410, 69416, 69430, 69442, 69444, 69448, 69456, 69470, 69478, 69484, 69554, 69556, 69666, 69672, 69698, 69704, 69712, 69726, 69754, 69762, 69764, 69776, 69790, 69792, 69820, 69830, 69836, 69848, 69870, 69874, 69876, 69890, 69918, 69920, 69948, 69952, 70008, 70022, 70040, 70064, 70078, 70094, 70108, 70114, 70116, 70120, 70134, 70152, 70174, 70176, 70264, 70384, 70412, 70448, 70462, 70496, 70524, 70542, 70556, 70584, 70594, 70600, 70608, 70622, 70630, 70636, 70664, 70672, 70686, 70688, 70716, 70720, 70776, 70896, 71136, 71180, 71192, 71216, 71230, 71264, 71292, 71360, 71416, 71452, 71480, 71536, 71550, 71554, 71556, 71560, 71568, 71582, 71584, 71612, 71622, 71628, 71640, 71662, 71726, 71732, 71758, 71772, 71778, 71780, 71784, 71798, 71822, 71836, 71864, 71874, 71880, 71888, 71902, 71910, 71916, 71930, 71950, 71964, 71992, 72048, 72062, 72066, 72068, 72080, 72094, 72096, 72124, 72134, 72140, 72152, 72174, 72178, 72180, 72206, 72220, 72248, 72304, 72318, 72416, 72444, 72456, 72464, 72478, 72480, 72508, 72512, 72568, 72588, 72600, 72624, 72638, 72654, 72668, 72674, 72676, 72680, 72694, 72726, 72742, 72748, 72774, 72780, 72792, 72814, 72838, 72856, 72880, 72894, 72910, 72924, 72930, 72932, 72936, 72950, 72966, 72972, 72984, 73008, 73022, 73056, 73084, 73102, 73116, 73144, 73156, 73160, 73168, 73182, 73190, 73196, 73210, 73226, 73234, 73236, 73250, 73252, 73256, 73270, 73282, 73284, 73296, 73310, 73318, 73324, 73346, 73348, 73352, 73360, 73374, 73376, 73404, 73414, 73420, 73432, 73454, 73498, 73518, 73522, 73524, 73550, 73564, 73570, 73572, 73576, 73590, 73800, 73822, 73858, 73860, 73872, 73886, 73888, 73916, 73944, 73970, 73972, 73992, 74014, 74016, 74044, 74048, 74104, 74118, 74136, 74160, 74174, 74210, 74212, 74216, 74230, 74244, 74256, 74270, 74272, 74360, 74480, 74502, 74508, 74544, 74558, 74592, 74620, 74638, 74652, 74680, 74690, 74696, 74704, 74726, 74732, 74782, 74784, 74812, 74992, 75232, 75288, 75326, 75360, 75388, 75456, 75512, 75576, 75632, 75646, 75650, 75652, 75664, 75678, 75680, 75708, 75718, 75724, 75736, 75758, 75808, 75836, 75840, 75896, 76016, 76256, 76736, 76824, 76848, 76862, 76896, 76924, 76992, 77048, 77296, 77340, 77368, 77424, 77438, 77536, 77564, 77572, 77576, 77584, 77600, 77628, 77632, 77688, 77702, 77708, 77720, 77744, 77758, 77774, 77788, 77870, 77902, 77916, 77922, 77928, 77966, 77980, 78008, 78018, 78024, 78032, 78046, 78060, 78074, 78094, 78136, 78192, 78206, 78210, 78212, 78224, 78238, 78240, 78268, 78278, 78284, 78296, 78322, 78324, 78350, 78364, 78448, 78462, 78560, 78588, 78600, 78622, 78624, 78652, 78656, 78712, 78726, 78744, 78768, 78782, 78798, 78812, 78818, 78820, 78824, 78838, 78862, 78876, 78904, 78960, 78974, 79072, 79100, 79296, 79352, 79368, 79376, 79390, 79392, 79420, 79424, 79480, 79600, 79628, 79640, 79664, 79678, 79712, 79740, 79772, 79800, 79810, 79812, 79816, 79824, 79838, 79846, 79852, 79894, 79910, 79916, 79942, 79948, 79960, 79982, 79988, 80006, 80024, 80048, 80062, 80078, 80092, 80098, 80100, 80104, 80134, 80140, 80176, 80190, 80224, 80252, 80270, 80284, 80312, 80328, 80336, 80350, 80358, 80364, 80378, 80390, 80396, 80408, 80432, 80446, 80480, 80508, 80576, 80632, 80654, 80668, 80696, 80752, 80766, 80776, 80784, 80798, 80800, 80828, 80844, 80856, 80878, 80882, 80884, 80914, 80916, 80930, 80932, 80936, 80950, 80962, 80968, 80976, 80990, 80998, 81004, 81026, 81028, 81040, 81054, 81056, 81084, 81094, 81100, 81112, 81134, 81154, 81156, 81160, 81168, 81182, 81184, 81212, 81216, 81272, 81286, 81292, 81304, 81328, 81342, 81358, 81372, 81380, 81384, 81398, 81434, 81454, 81458, 81460, 81486, 81500, 81506, 81508, 81512, 81526, 81550, 81564, 81592, 81602, 81604, 81608, 81616, 81630, 81638, 81644, 81702, 81708, 81722, 81734, 81740, 81752, 81774, 81778, 81780, 82050, 82078, 82080, 82108, 82180, 82184, 82192, 82206, 82208, 82236, 82240, 82296, 82316, 82328, 82352, 82366, 82402, 82404, 82408, 82440, 82448, 82462, 82464, 82492, 82496, 82552, 82672, 82694, 82700, 82712, 82736, 82750, 82784, 82812, 82830, 82882, 82884, 82888, 82896, 82918, 82924, 82952, 82960, 82974, 82976, 83004, 83008, 83064, 83184, 83424, 83468, 83480, 83504, 83518, 83552, 83580, 83648, 83704, 83740, 83768, 83824, 83838, 83842, 83844, 83848, 83856, 83872, 83900, 83910, 83916, 83928, 83950, 83984, 84000, 84028, 84032, 84088, 84208, 84448, 84928, 85040, 85054, 85088, 85116, 85184, 85240, 85488, 85560, 85616, 85630, 85728, 85756, 85764, 85768, 85776, 85790, 85792, 85820, 85824, 85880, 85894, 85900, 85912, 85936, 85966, 85980, 86048, 86080, 86136, 86256, 86496, 86976, 88160, 88188, 88256, 88312, 88560, 89056, 89200, 89214, 89312, 89340, 89536, 89592, 89608, 89616, 89632, 89664, 89720, 89840, 89868, 89880, 89904, 89952, 89980, 89998, 90012, 90040, 90190, 90204, 90254, 90268, 90296, 90306, 90308, 90312, 90334, 90382, 90396, 90424, 90480, 90494, 90500, 90504, 90512, 90526, 90528, 90556, 90566, 90572, 90584, 90610, 90612, 90638, 90652, 90680, 90736, 90750, 90848, 90876, 90884, 90888, 90896, 90910, 90912, 90940, 90944, 91000, 91014, 91020, 91032, 91056, 91070, 91086, 91100, 91106, 91108, 91112, 91126, 91150, 91164, 91192, 91248, 91262, 91360, 91388, 91584, 91640, 91664, 91678, 91680, 91708, 91712, 91768, 91888, 91928, 91952, 91966, 92000, 92028, 92046, 92060, 92088, 92098, 92100, 92104, 92112, 92126, 92134, 92140, 92188, 92216, 92272, 92384, 92412, 92608, 92664, 93168, 93200, 93214, 93216, 93244, 93248, 93304, 93424, 93664, 93720, 93744, 93758, 93792, 93820, 93888, 93944, 93980, 94008, 94064, 94078, 94084, 94088, 94096, 94110, 94112, 94140, 94150, 94156, 94168, 94246, 94252, 94278, 94284, 94296, 94318, 94342, 94348, 94360, 94384, 94398, 94414, 94428, 94440, 94470, 94476, 94488, 94512, 94526, 94560, 94588, 94606, 94620, 94648, 94658, 94660, 94664, 94672, 94686, 94694, 94700, 94714, 94726, 94732, 94744, 94768, 94782, 94816, 94844, 94912, 94968, 94990, 95004, 95032, 95088, 95102, 95112, 95120, 95134, 95136, 95164, 95180, 95192, 95214, 95218, 95220, 95244, 95256, 95280, 95294, 95328, 95356, 95424, 95480, 95728, 95758, 95772, 95800, 95856, 95870, 95968, 95996, 96008, 96016, 96030, 96032, 96060, 96064, 96120, 96152, 96176, 96190, 96220, 96226, 96228, 96232, 96290, 96292, 96296, 96310, 96322, 96324, 96328, 96336, 96350, 96358, 96364, 96386, 96388, 96392, 96400, 96414, 96416, 96444, 96454, 96460, 96472, 96494, 96498, 96500, 96514, 96516, 96520, 96528, 96542, 96544, 96572, 96576, 96632, 96646, 96652, 96664, 96688, 96702, 96718, 96732, 96738, 96740, 96744, 96758, 96772, 96776, 96784, 96798, 96800, 96828, 96832, 96888, 97008, 97030, 97036, 97048, 97072, 97086, 97120, 97148, 97166, 97180, 97208, 97220, 97224, 97232, 97246, 97254, 97260, 97326, 97330, 97332, 97358, 97372, 97378, 97380, 97384, 97398, 97422, 97436, 97464, 97474, 97476, 97480, 97488, 97502, 97510, 97516, 97550, 97564, 97592, 97648, 97666, 97668, 97672, 97680, 97694, 97696, 97724, 97734, 97740, 97752, 97774, 97830, 97836, 97850, 97862, 97868, 97880, 97902, 97906, 97908, 97926, 97932, 97944, 97968, 97998, 98012, 98018, 98020, 98024, 98038, 98618, 98674, 98676, 98838, 98854, 98874, 98892, 98904, 98926, 98930, 98932, 98968, 99006, 99042, 99044, 99048, 99062, 99166, 99194, 99246, 99286, 99350, 99366, 99372, 99386, 99398, 99416, 99438, 99442, 99444, 99462, 99504, 99518, 99534, 99548, 99554, 99556, 99560, 99574, 99590, 99596, 99608, 99632, 99646, 99680, 99708, 99726, 99740, 99768, 99778, 99780, 99784, 99792, 99806, 99814, 99820, 99834, 99858, 99860, 99874, 99880, 99894, 99906, 99920, 99934, 99962, 99970, 99972, 99976, 99984, 99998, 100000, 100028, 100038, 100044, 100056, 100078, 100082, 100084, 100142, 100174, 100188, 100246, 100262, 100268, 100306, 100308, 100390, 100396, 100410, 100422, 100428, 100440, 100462, 100466, 100468, 100486, 100504, 100528, 100542, 100558, 100572, 100578, 100580, 100584, 100598, 100620, 100656, 100670, 100704, 100732, 100750, 100792, 100802, 100808, 100816, 100830, 100838, 100844, 100858, 100888, 100912, 100926, 100960, 100988, 101056, 101112, 101148, 101176, 101232, 101246, 101250, 101252, 101256, 101264, 101278, 101280, 101308, 101318, 101324, 101336, 101358, 101362, 101364, 101410, 101412, 101416, 101430, 101442, 101448, 101456, 101470, 101478, 101498, 101506, 101508, 101520, 101534, 101536, 101564, 101580, 101618, 101620, 101636, 101640, 101648, 101662, 101664, 101692, 101696, 101752, 101766, 101784, 101838, 101858, 101860, 101864, 101934, 101938, 101940, 101966, 101980, 101986, 101988, 101992, 102030, 102044, 102072, 102082, 102084, 102088, 102096, 102138, 102166, 102182, 102188, 102214, 102220, 102232, 102254, 102282, 102290, 102292, 102306, 102308, 102312, 102326, 102444, 102458, 102470, 102476, 102488, 102514, 102516, 102534, 102552, 102576, 102590, 102606, 102620, 102626, 102632, 102646, 102662, 102668, 102704, 102718, 102752, 102780, 102798, 102812, 102840, 102850, 102856, 102864, 102878, 102886, 102892, 102906, 102936, 102974, 103008, 103036, 103104, 103160, 103224, 103280, 103294, 103298, 103300, 103312, 103326, 103328, 103356, 103366, 103372, 103384, 103406, 103410, 103412, 103472, 103486, 103520, 103548, 103616, 103672, 103920, 103992, 104048, 104062, 104160, 104188, 104194, 104196, 104200, 104208, 104224, 104252, 104256, 104312, 104326, 104332, 104344, 104368, 104382, 104398, 104412, 104418, 104420, 104424, 104482, 104484, 104514, 104520, 104528, 104542, 104550, 104570, 104578, 104580, 104592, 104606, 104608, 104636, 104652, 104690, 104692, 104706, 104712, 104734, 104736, 104764, 104768, 104824, 104838, 104856, 104910, 104930, 104932, 104936, 104968, 104976, 104990, 104992, 105020, 105024, 105080, 105200, 105240, 105278, 105312, 105372, 105410, 105412, 105416, 105424, 105446, 105518, 105524, 105550, 105564, 105570, 105572, 105576, 105614, 105628, 105656, 105666, 105672, 105680, 105702, 105722, 105742, 105756, 105784, 105840, 105854, 105858, 105860, 105864, 105872, 105888, 105932, 105970, 105972, 106006, 106022, 106028, 106054, 106060, 106072, 106100, 106118, 106124, 106136, 106160, 106174, 106190, 106210, 106212, 106216, 106250, 106258, 106260, 106274, 106276, 106280, 106306, 106308, 106312, 106320, 106334, 106348, 106394, 106414, 106418, 106420, 106566, 106572, 106610, 106612, 106630, 106636, 106648, 106672, 106686, 106722, 106724, 106728, 106742, 106758, 106764, 106776, 106800, 106814, 106848, 106876, 106894, 106908, 106936, 106946, 106948, 106952, 106960, 106974, 106982, 106988, 107032, 107056, 107070, 107104, 107132, 107200, 107256, 107292, 107320, 107376, 107390, 107394, 107396, 107400, 107408, 107422, 107424, 107452, 107462, 107468, 107480, 107502, 107506, 107508, 107544, 107568, 107582, 107616, 107644, 107712, 107768, 108016, 108060, 108088, 108144, 108158, 108256, 108284, 108290, 108292, 108296, 108304, 108318, 108320, 108348, 108352, 108408, 108422, 108428, 108440, 108464, 108478, 108494, 108508, 108514, 108516, 108520, 108592, 108640, 108668, 108736, 108792, 109040, 109536, 109680, 109694, 109792, 109820, 110016, 110072, 110084, 110088, 110096, 110112, 110140, 110144, 110200, 110320, 110342, 110348, 110360, 110384, 110398, 110432, 110460, 110478, 110492, 110520, 110532, 110536, 110544, 110558, 110658, 110686, 110714, 110722, 110724, 110728, 110736, 110750, 110752, 110780, 110796, 110834, 110836, 110850, 110852, 110856, 110864, 110878, 110880, 110908, 110912, 110968, 110982, 111000, 111054, 111074, 111076, 111080, 111108, 111112, 111120, 111134, 111136, 111164, 111168, 111224, 111344, 111372, 111422, 111456, 111516, 111554, 111556, 111560, 111568, 111590, 111632, 111646, 111648, 111676, 111680, 111736, 111856, 112096, 112152, 112224, 112252, 112320, 112440, 112514, 112516, 112520, 112528, 112542, 112544, 112588, 112686, 112718, 112732, 112782, 112796, 112824, 112834, 112836, 112840, 112848, 112870, 112890, 112910, 112924, 112952, 113008, 113022, 113026, 113028, 113032, 113040, 113054, 113056, 113100, 113138, 113140, 113166, 113180, 113208, 113264, 113278, 113376, 113404, 113416, 113424, 113440, 113468, 113472, 113560, 113614, 113634, 113636, 113640, 113686, 113702, 113708, 113734, 113740, 113752, 113778, 113780, 113798, 113804, 113816, 113840, 113854, 113870, 113890, 113892, 113896, 113926, 113932, 113944, 113968, 113982, 114016, 114044, 114076, 114114, 114116, 114120, 114128, 114150, 114170, 114194, 114196, 114210, 114212, 114216, 114242, 114244, 114248, 114256, 114270, 114278, 114306, 114308, 114312, 114320, 114334, 114336, 114364, 114380, 114420, 114458, 114478, 114482, 114484, 114510, 114524, 114530, 114532, 114536, 114842, 114866, 114868, 114970, 114994, 114996, 115042, 115044, 115048, 115062, 115130, 115226, 115250, 115252, 115278, 115292, 115298, 115300, 115304, 115318, 115342, 115394, 115396, 115400, 115408, 115422, 115430, 115436, 115450, 115478, 115494, 115514, 115526, 115532, 115570, 115572, 115738, 115758, 115762, 115764, 115790, 115804, 115810, 115812, 115816, 115830, 115854, 115868, 115896, 115906, 115912, 115920, 115934, 115942, 115948, 115962, 115996, 116024, 116080, 116094, 116098, 116100, 116104, 116112, 116126, 116128, 116156, 116166, 116172, 116184, 116206, 116210, 116212, 116246, 116262, 116268, 116282, 116294, 116300, 116312, 116334, 116338, 116340, 116358, 116364, 116376, 116400, 116414, 116430, 116444, 116450, 116452, 116456, 116498, 116500, 116514, 116520, 116534, 116546, 116548, 116552, 116560, 116574, 116582, 116588, 116602, 116654, 116694, 116714, 116762, 116782, 116786, 116788, 116814, 116828, 116834, 116836, 116840, 116854, 116878, 116892, 116920, 116930, 116936, 116944, 116958, 116966, 116972, 116986, 117006, 117048, 117104, 117118, 117122, 117124, 117136, 117150, 117152, 117180, 117190, 117196, 117208, 117230, 117234, 117236, 117304, 117360, 117374, 117472, 117500, 117506, 117508, 117512, 117520, 117536, 117564, 117568, 117624, 117638, 117644, 117656, 117680, 117694, 117710, 117724, 117730, 117732, 117736, 117750, 117782, 117798, 117804, 117818, 117830, 117848, 117874, 117876, 117894, 117936, 117950, 117966, 117986, 117988, 117992, 118022, 118028, 118040, 118064, 118078, 118112, 118140, 118172, 118210, 118212, 118216, 118224, 118238, 118246, 118266, 118306, 118312, 118338, 118352, 118366, 118374, 118394, 118402, 118404, 118408, 118416, 118430, 118432, 118460, 118476, 118514, 118516, 118574, 118578, 118580, 118606, 118620, 118626, 118628, 118632, 118678, 118694, 118700, 118730, 118738, 118740, 118830, 118834, 118836, 118862, 118876, 118882, 118884, 118888, 118902, 118926, 118940, 118968, 118978, 118980, 118984, 118992, 119006, 119014, 119020, 119034, 119068, 119096, 119152, 119166, 119170, 119172, 119176, 119184, 119198, 119200, 119228, 119238, 119244, 119256, 119278, 119282, 119284, 119324, 119352, 119408, 119422, 119520, 119548, 119554, 119556, 119560, 119568, 119582, 119584, 119612, 119616, 119672, 119686, 119692, 119704, 119728, 119742, 119758, 119772, 119778, 119780, 119784, 119798, 119920, 119934, 120032, 120060, 120256, 120312, 120324, 120328, 120336, 120352, 120384, 120440, 120560, 120582, 120588, 120600, 120624, 120638, 120672, 120700, 120718, 120732, 120760, 120770, 120772, 120776, 120784, 120798, 120806, 120812, 120870, 120876, 120890, 120902, 120908, 120920, 120946, 120948, 120966, 120972, 120984, 121008, 121022, 121038, 121058, 121060, 121064, 121078, 121100, 121112, 121136, 121150, 121184, 121212, 121244, 121282, 121284, 121288, 121296, 121318, 121338, 121356, 121368, 121392, 121406, 121440, 121468, 121536, 121592, 121656, 121730, 121732, 121736, 121744, 121758, 121760, 121804, 121842, 121844, 121890, 121922, 121924, 121928, 121936, 121950, 121958, 121978, 121986, 121988, 121992, 122000, 122014, 122016, 122044, 122060, 122098, 122100, 122116, 122120, 122128, 122142, 122144, 122172, 122176, 122232, 122246, 122264, 122318, 122338, 122340, 122344, 122414, 122418, 122420, 122446, 122460, 122466, 122468, 122472, 122510, 122524, 122552, 122562, 122564, 122568, 122576, 122598, 122618, 122646, 122662, 122668, 122694, 122700, 122712, 122738, 122740, 122762, 122770, 122772, 122786, 122788, 122792, 123018, 123026, 123028, 123042, 123044, 123048, 123062, 123098, 123146, 123154, 123156, 123170, 123172, 123176, 123190, 123202, 123204, 123208, 123216, 123238, 123244, 123258, 123290, 123314, 123316, 123402, 123410, 123412, 123426, 123428, 123432, 123446, 123458, 123464, 123472, 123486, 123494, 123500, 123514, 123522, 123524, 123528, 123536, 123552, 123580, 123590, 123596, 123608, 123630, 123634, 123636, 123674, 123698, 123700, 123740, 123746, 123748, 123752, 123834, 123914, 123922, 123924, 123938, 123944, 123958, 123970, 123976, 123984, 123998, 124006, 124012, 124026, 124034, 124036, 124048, 124062, 124064, 124092, 124102, 124108, 124120, 124142, 124146, 124148, 124162, 124164, 124168, 124176, 124190, 124192, 124220, 124224, 124280, 124294, 124300, 124312, 124336, 124350, 124366, 124380, 124386, 124388, 124392, 124406, 124442, 124462, 124466, 124468, 124494, 124508, 124514, 124520, 124558, 124572, 124600, 124610, 124612, 124616, 124624, 124646, 124666, 124694, 124710, 124716, 124730, 124742, 124748, 124760, 124786, 124788, 124818, 124820, 124834, 124836, 124840, 124854, 124946, 124948, 124962, 124964, 124968, 124982, 124994, 124996, 125000, 125008, 125022, 125030, 125036, 125050, 125058, 125060, 125064, 125072, 125086, 125088, 125116, 125126, 125132, 125144, 125166, 125170, 125172, 125186, 125188, 125192, 125200, 125216, 125244, 125248, 125304, 125318, 125324, 125336, 125360, 125374, 125390, 125404, 125410, 125412, 125416, 125430, 125444, 125448, 125456, 125472, 125504, 125560, 125680, 125702, 125708, 125720, 125744, 125758, 125792, 125820, 125838, 125852, 125880, 125890, 125892, 125896, 125904, 125918, 125926, 125932, 125978, 125998, 126002, 126004, 126030, 126044, 126050, 126052, 126056, 126094, 126108, 126136, 126146, 126148, 126152, 126160, 126182, 126202, 126222, 126236, 126264, 126320, 126334, 126338, 126340, 126344, 126352, 126366, 126368, 126412, 126450, 126452, 126486, 126502, 126508, 126522, 126534, 126540, 126552, 126574, 126578, 126580, 126598, 126604, 126616, 126640, 126654, 126670, 126684, 126690, 126692, 126696, 126738, 126754, 126756, 126760, 126774, 126786, 126788, 126792, 126800, 126814, 126822, 126828, 126842, 126894, 126898, 126900, 126934, 127126, 127142, 127148, 127162, 127178, 127186, 127188, 127254, 127270, 127276, 127290, 127302, 127308, 127320, 127342, 127346, 127348, 127370, 127378, 127380, 127394, 127396, 127400, 127450, 127510, 127526, 127532, 127546, 127558, 127576, 127598, 127602, 127604, 127622, 127628, 127640, 127664, 127678, 127694, 127708, 127714, 127716, 127720, 127734, 127754, 127762, 127764, 127778, 127784, 127810, 127812, 127816, 127824, 127838, 127846, 127866, 127898, 127918, 127922, 127924, 128022, 128038, 128044, 128058, 128070, 128076, 128088, 128110, 128114, 128116, 128134, 128140, 128152, 128176, 128190, 128206, 128220, 128226, 128228, 128232, 128246, 128262, 128268, 128280, 128304, 128318, 128352, 128380, 128398, 128412, 128440, 128450, 128452, 128456, 128464, 128478, 128486, 128492, 128506, 128522, 128530, 128532, 128546, 128548, 128552, 128566, 128578, 128580, 128584, 128592, 128606, 128614, 128634, 128642, 128644, 128648, 128656, 128670, 128672, 128700, 128716, 128754, 128756, 128794, 128814, 128818, 128820, 128846, 128860, 128866, 128868, 128872, 128886, 128918, 128934, 128940, 128954, 128978, 128980, 129178, 129198, 129202, 129204, 129238, 129258, 129306, 129326, 129330, 129332, 129358, 129372, 129378, 129380, 129384, 129398, 129430, 129446, 129452, 129466, 129482, 129490, 129492, 129562, 129582, 129586, 129588, 129614, 129628, 129634, 129636, 129640, 129654, 129678, 129692, 129720, 129730, 129732, 129736, 129744, 129758, 129766, 129772, 129814, 129830, 129836, 129850, 129862, 129868, 129880, 129902, 129906, 129908, 129930, 129938, 129940, 129954, 129956, 129960, 129974, 130010];
ZXing.PDF417.PDF417Common.CODEWORD_TABLE = [2627, 1819, 2622, 2621, 1813, 1812, 2729, 2724, 2723, 2779, 2774, 2773, 902, 896, 908, 868, 865, 861, 859, 2511, 873, 871, 1780, 835, 2493, 825, 2491, 842, 837, 844, 1764, 1762, 811, 810, 809, 2483, 807, 2482, 806, 2480, 815, 814, 813, 812, 2484, 817, 816, 1745, 1744, 1742, 1746, 2655, 2637, 2635, 2626, 2625, 2623, 2628, 1820, 2752, 2739, 2737, 2728, 2727, 2725, 2730, 2785, 2783, 2778, 2777, 2775, 2780, 787, 781, 747, 739, 736, 2413, 754, 752, 1719, 692, 689, 681, 2371, 678, 2369, 700, 697, 694, 703, 1688, 1686, 642, 638, 2343, 631, 2341, 627, 2338, 651, 646, 643, 2345, 654, 652, 1652, 1650, 1647, 1654, 601, 599, 2322, 596, 2321, 594, 2319, 2317, 611, 610, 608, 606, 2324, 603, 2323, 615, 614, 612, 1617, 1616, 1614, 1612, 616, 1619, 1618, 2575, 2538, 2536, 905, 901, 898, 909, 2509, 2507, 2504, 870, 867, 864, 860, 2512, 875, 872, 1781, 2490, 2489, 2487, 2485, 1748, 836, 834, 832, 830, 2494, 827, 2492, 843, 841, 839, 845, 1765, 1763, 2701, 2676, 2674, 2653, 2648, 2656, 2634, 2633, 2631, 2629, 1821, 2638, 2636, 2770, 2763, 2761, 2750, 2745, 2753, 2736, 2735, 2733, 2731, 1848, 2740, 2738, 2786, 2784, 591, 588, 576, 569, 566, 2296, 1590, 537, 534, 526, 2276, 522, 2274, 545, 542, 539, 548, 1572, 1570, 481, 2245, 466, 2242, 462, 2239, 492, 485, 482, 2249, 496, 494, 1534, 1531, 1528, 1538, 413, 2196, 406, 2191, 2188, 425, 419, 2202, 415, 2199, 432, 430, 427, 1472, 1467, 1464, 433, 1476, 1474, 368, 367, 2160, 365, 2159, 362, 2157, 2155, 2152, 378, 377, 375, 2166, 372, 2165, 369, 2162, 383, 381, 379, 2168, 1419, 1418, 1416, 1414, 385, 1411, 384, 1423, 1422, 1420, 1424, 2461, 802, 2441, 2439, 790, 786, 783, 794, 2409, 2406, 2403, 750, 742, 738, 2414, 756, 753, 1720, 2367, 2365, 2362, 2359, 1663, 693, 691, 684, 2373, 680, 2370, 702, 699, 696, 704, 1690, 1687, 2337, 2336, 2334, 2332, 1624, 2329, 1622, 640, 637, 2344, 634, 2342, 630, 2340, 650, 648, 645, 2346, 655, 653, 1653, 1651, 1649, 1655, 2612, 2597, 2595, 2571, 2568, 2565, 2576, 2534, 2529, 2526, 1787, 2540, 2537, 907, 904, 900, 910, 2503, 2502, 2500, 2498, 1768, 2495, 1767, 2510, 2508, 2506, 869, 866, 863, 2513, 876, 874, 1782, 2720, 2713, 2711, 2697, 2694, 2691, 2702, 2672, 2670, 2664, 1828, 2678, 2675, 2647, 2646, 2644, 2642, 1823, 2639, 1822, 2654, 2652, 2650, 2657, 2771, 1855, 2765, 2762, 1850, 1849, 2751, 2749, 2747, 2754, 353, 2148, 344, 342, 336, 2142, 332, 2140, 345, 1375, 1373, 306, 2130, 299, 2128, 295, 2125, 319, 314, 311, 2132, 1354, 1352, 1349, 1356, 262, 257, 2101, 253, 2096, 2093, 274, 273, 267, 2107, 263, 2104, 280, 278, 275, 1316, 1311, 1308, 1320, 1318, 2052, 202, 2050, 2044, 2040, 219, 2063, 212, 2060, 208, 2055, 224, 221, 2066, 1260, 1258, 1252, 231, 1248, 229, 1266, 1264, 1261, 1268, 155, 1998, 153, 1996, 1994, 1991, 1988, 165, 164, 2007, 162, 2006, 159, 2003, 2000, 172, 171, 169, 2012, 166, 2010, 1186, 1184, 1182, 1179, 175, 1176, 173, 1192, 1191, 1189, 1187, 176, 1194, 1193, 2313, 2307, 2305, 592, 589, 2294, 2292, 2289, 578, 572, 568, 2297, 580, 1591, 2272, 2267, 2264, 1547, 538, 536, 529, 2278, 525, 2275, 547, 544, 541, 1574, 1571, 2237, 2235, 2229, 1493, 2225, 1489, 478, 2247, 470, 2244, 465, 2241, 493, 488, 484, 2250, 498, 495, 1536, 1533, 1530, 1539, 2187, 2186, 2184, 2182, 1432, 2179, 1430, 2176, 1427, 414, 412, 2197, 409, 2195, 405, 2193, 2190, 426, 424, 421, 2203, 418, 2201, 431, 429, 1473, 1471, 1469, 1466, 434, 1477, 1475, 2478, 2472, 2470, 2459, 2457, 2454, 2462, 803, 2437, 2432, 2429, 1726, 2443, 2440, 792, 789, 785, 2401, 2399, 2393, 1702, 2389, 1699, 2411, 2408, 2405, 745, 741, 2415, 758, 755, 1721, 2358, 2357, 2355, 2353, 1661, 2350, 1660, 2347, 1657, 2368, 2366, 2364, 2361, 1666, 690, 687, 2374, 683, 2372, 701, 698, 705, 1691, 1689, 2619, 2617, 2610, 2608, 2605, 2613, 2593, 2588, 2585, 1803, 2599, 2596, 2563, 2561, 2555, 1797, 2551, 1795, 2573, 2570, 2567, 2577, 2525, 2524, 2522, 2520, 1786, 2517, 1785, 2514, 1783, 2535, 2533, 2531, 2528, 1788, 2541, 2539, 906, 903, 911, 2721, 1844, 2715, 2712, 1838, 1836, 2699, 2696, 2693, 2703, 1827, 1826, 1824, 2673, 2671, 2669, 2666, 1829, 2679, 2677, 1858, 1857, 2772, 1854, 1853, 1851, 1856, 2766, 2764, 143, 1987, 139, 1986, 135, 133, 131, 1984, 128, 1983, 125, 1981, 138, 137, 136, 1985, 1133, 1132, 1130, 112, 110, 1974, 107, 1973, 104, 1971, 1969, 122, 121, 119, 117, 1977, 114, 1976, 124, 1115, 1114, 1112, 1110, 1117, 1116, 84, 83, 1953, 81, 1952, 78, 1950, 1948, 1945, 94, 93, 91, 1959, 88, 1958, 85, 1955, 99, 97, 95, 1961, 1086, 1085, 1083, 1081, 1078, 100, 1090, 1089, 1087, 1091, 49, 47, 1917, 44, 1915, 1913, 1910, 1907, 59, 1926, 56, 1925, 53, 1922, 1919, 66, 64, 1931, 61, 1929, 1042, 1040, 1038, 71, 1035, 70, 1032, 68, 1048, 1047, 1045, 1043, 1050, 1049, 12, 10, 1869, 1867, 1864, 1861, 21, 1880, 19, 1877, 1874, 1871, 28, 1888, 25, 1886, 22, 1883, 982, 980, 977, 974, 32, 30, 991, 989, 987, 984, 34, 995, 994, 992, 2151, 2150, 2147, 2146, 2144, 356, 355, 354, 2149, 2139, 2138, 2136, 2134, 1359, 343, 341, 338, 2143, 335, 2141, 348, 347, 346, 1376, 1374, 2124, 2123, 2121, 2119, 1326, 2116, 1324, 310, 308, 305, 2131, 302, 2129, 298, 2127, 320, 318, 316, 313, 2133, 322, 321, 1355, 1353, 1351, 1357, 2092, 2091, 2089, 2087, 1276, 2084, 1274, 2081, 1271, 259, 2102, 256, 2100, 252, 2098, 2095, 272, 269, 2108, 266, 2106, 281, 279, 277, 1317, 1315, 1313, 1310, 282, 1321, 1319, 2039, 2037, 2035, 2032, 1203, 2029, 1200, 1197, 207, 2053, 205, 2051, 201, 2049, 2046, 2043, 220, 218, 2064, 215, 2062, 211, 2059, 228, 226, 223, 2069, 1259, 1257, 1254, 232, 1251, 230, 1267, 1265, 1263, 2316, 2315, 2312, 2311, 2309, 2314, 2304, 2303, 2301, 2299, 1593, 2308, 2306, 590, 2288, 2287, 2285, 2283, 1578, 2280, 1577, 2295, 2293, 2291, 579, 577, 574, 571, 2298, 582, 581, 1592, 2263, 2262, 2260, 2258, 1545, 2255, 1544, 2252, 1541, 2273, 2271, 2269, 2266, 1550, 535, 532, 2279, 528, 2277, 546, 543, 549, 1575, 1573, 2224, 2222, 2220, 1486, 2217, 1485, 2214, 1482, 1479, 2238, 2236, 2234, 2231, 1496, 2228, 1492, 480, 477, 2248, 473, 2246, 469, 2243, 490, 487, 2251, 497, 1537, 1535, 1532, 2477, 2476, 2474, 2479, 2469, 2468, 2466, 2464, 1730, 2473, 2471, 2453, 2452, 2450, 2448, 1729, 2445, 1728, 2460, 2458, 2456, 2463, 805, 804, 2428, 2427, 2425, 2423, 1725, 2420, 1724, 2417, 1722, 2438, 2436, 2434, 2431, 1727, 2444, 2442, 793, 791, 788, 795, 2388, 2386, 2384, 1697, 2381, 1696, 2378, 1694, 1692, 2402, 2400, 2398, 2395, 1703, 2392, 1701, 2412, 2410, 2407, 751, 748, 744, 2416, 759, 757, 1807, 2620, 2618, 1806, 1805, 2611, 2609, 2607, 2614, 1802, 1801, 1799, 2594, 2592, 2590, 2587, 1804, 2600, 2598, 1794, 1793, 1791, 1789, 2564, 2562, 2560, 2557, 1798, 2554, 1796, 2574, 2572, 2569, 2578, 1847, 1846, 2722, 1843, 1842, 1840, 1845, 2716, 2714, 1835, 1834, 1832, 1830, 1839, 1837, 2700, 2698, 2695, 2704, 1817, 1811, 1810, 897, 862, 1777, 829, 826, 838, 1760, 1758, 808, 2481, 1741, 1740, 1738, 1743, 2624, 1818, 2726, 2776, 782, 740, 737, 1715, 686, 679, 695, 1682, 1680, 639, 628, 2339, 647, 644, 1645, 1643, 1640, 1648, 602, 600, 597, 595, 2320, 593, 2318, 609, 607, 604, 1611, 1610, 1608, 1606, 613, 1615, 1613, 2328, 926, 924, 892, 886, 899, 857, 850, 2505, 1778, 824, 823, 821, 819, 2488, 818, 2486, 833, 831, 828, 840, 1761, 1759, 2649, 2632, 2630, 2746, 2734, 2732, 2782, 2781, 570, 567, 1587, 531, 527, 523, 540, 1566, 1564, 476, 467, 463, 2240, 486, 483, 1524, 1521, 1518, 1529, 411, 403, 2192, 399, 2189, 423, 416, 1462, 1457, 1454, 428, 1468, 1465, 2210, 366, 363, 2158, 360, 2156, 357, 2153, 376, 373, 370, 2163, 1410, 1409, 1407, 1405, 382, 1402, 380, 1417, 1415, 1412, 1421, 2175, 2174, 777, 774, 771, 784, 732, 725, 722, 2404, 743, 1716, 676, 674, 668, 2363, 665, 2360, 685, 1684, 1681, 626, 624, 622, 2335, 620, 2333, 617, 2330, 641, 635, 649, 1646, 1644, 1642, 2566, 928, 925, 2530, 2527, 894, 891, 888, 2501, 2499, 2496, 858, 856, 854, 851, 1779, 2692, 2668, 2665, 2645, 2643, 2640, 2651, 2768, 2759, 2757, 2744, 2743, 2741, 2748, 352, 1382, 340, 337, 333, 1371, 1369, 307, 300, 296, 2126, 315, 312, 1347, 1342, 1350, 261, 258, 250, 2097, 246, 2094, 271, 268, 264, 1306, 1301, 1298, 276, 1312, 1309, 2115, 203, 2048, 195, 2045, 191, 2041, 213, 209, 2056, 1246, 1244, 1238, 225, 1234, 222, 1256, 1253, 1249, 1262, 2080, 2079, 154, 1997, 150, 1995, 147, 1992, 1989, 163, 160, 2004, 156, 2001, 1175, 1174, 1172, 1170, 1167, 170, 1164, 167, 1185, 1183, 1180, 1177, 174, 1190, 1188, 2025, 2024, 2022, 587, 586, 564, 559, 556, 2290, 573, 1588, 520, 518, 512, 2268, 508, 2265, 530, 1568, 1565, 461, 457, 2233, 450, 2230, 446, 2226, 479, 471, 489, 1526, 1523, 1520, 397, 395, 2185, 392, 2183, 389, 2180, 2177, 410, 2194, 402, 422, 1463, 1461, 1459, 1456, 1470, 2455, 799, 2433, 2430, 779, 776, 773, 2397, 2394, 2390, 734, 728, 724, 746, 1717, 2356, 2354, 2351, 2348, 1658, 677, 675, 673, 670, 667, 688, 1685, 1683, 2606, 2589, 2586, 2559, 2556, 2552, 927, 2523, 2521, 2518, 2515, 1784, 2532, 895, 893, 890, 2718, 2709, 2707, 2689, 2687, 2684, 2663, 2662, 2660, 2658, 1825, 2667, 2769, 1852, 2760, 2758, 142, 141, 1139, 1138, 134, 132, 129, 126, 1982, 1129, 1128, 1126, 1131, 113, 111, 108, 105, 1972, 101, 1970, 120, 118, 115, 1109, 1108, 1106, 1104, 123, 1113, 1111, 82, 79, 1951, 75, 1949, 72, 1946, 92, 89, 86, 1956, 1077, 1076, 1074, 1072, 98, 1069, 96, 1084, 1082, 1079, 1088, 1968, 1967, 48, 45, 1916, 42, 1914, 39, 1911, 1908, 60, 57, 54, 1923, 50, 1920, 1031, 1030, 1028, 1026, 67, 1023, 65, 1020, 62, 1041, 1039, 1036, 1033, 69, 1046, 1044, 1944, 1943, 1941, 11, 9, 1868, 7, 1865, 1862, 1859, 20, 1878, 16, 1875, 13, 1872, 970, 968, 966, 963, 29, 960, 26, 23, 983, 981, 978, 975, 33, 971, 31, 990, 988, 985, 1906, 1904, 1902, 993, 351, 2145, 1383, 331, 330, 328, 326, 2137, 323, 2135, 339, 1372, 1370, 294, 293, 291, 289, 2122, 286, 2120, 283, 2117, 309, 303, 317, 1348, 1346, 1344, 245, 244, 242, 2090, 239, 2088, 236, 2085, 2082, 260, 2099, 249, 270, 1307, 1305, 1303, 1300, 1314, 189, 2038, 186, 2036, 183, 2033, 2030, 2026, 206, 198, 2047, 194, 216, 1247, 1245, 1243, 1240, 227, 1237, 1255, 2310, 2302, 2300, 2286, 2284, 2281, 565, 563, 561, 558, 575, 1589, 2261, 2259, 2256, 2253, 1542, 521, 519, 517, 514, 2270, 511, 533, 1569, 1567, 2223, 2221, 2218, 2215, 1483, 2211, 1480, 459, 456, 453, 2232, 449, 474, 491, 1527, 1525, 1522, 2475, 2467, 2465, 2451, 2449, 2446, 801, 800, 2426, 2424, 2421, 2418, 1723, 2435, 780, 778, 775, 2387, 2385, 2382, 2379, 1695, 2375, 1693, 2396, 735, 733, 730, 727, 749, 1718, 2616, 2615, 2604, 2603, 2601, 2584, 2583, 2581, 2579, 1800, 2591, 2550, 2549, 2547, 2545, 1792, 2542, 1790, 2558, 929, 2719, 1841, 2710, 2708, 1833, 1831, 2690, 2688, 2686, 1815, 1809, 1808, 1774, 1756, 1754, 1737, 1736, 1734, 1739, 1816, 1711, 1676, 1674, 633, 629, 1638, 1636, 1633, 1641, 598, 1605, 1604, 1602, 1600, 605, 1609, 1607, 2327, 887, 853, 1775, 822, 820, 1757, 1755, 1584, 524, 1560, 1558, 468, 464, 1514, 1511, 1508, 1519, 408, 404, 400, 1452, 1447, 1444, 417, 1458, 1455, 2208, 364, 361, 358, 2154, 1401, 1400, 1398, 1396, 374, 1393, 371, 1408, 1406, 1403, 1413, 2173, 2172, 772, 726, 723, 1712, 672, 669, 666, 682, 1678, 1675, 625, 623, 621, 618, 2331, 636, 632, 1639, 1637, 1635, 920, 918, 884, 880, 889, 849, 848, 847, 846, 2497, 855, 852, 1776, 2641, 2742, 2787, 1380, 334, 1367, 1365, 301, 297, 1340, 1338, 1335, 1343, 255, 251, 247, 1296, 1291, 1288, 265, 1302, 1299, 2113, 204, 196, 192, 2042, 1232, 1230, 1224, 214, 1220, 210, 1242, 1239, 1235, 1250, 2077, 2075, 151, 148, 1993, 144, 1990, 1163, 1162, 1160, 1158, 1155, 161, 1152, 157, 1173, 1171, 1168, 1165, 168, 1181, 1178, 2021, 2020, 2018, 2023, 585, 560, 557, 1585, 516, 509, 1562, 1559, 458, 447, 2227, 472, 1516, 1513, 1510, 398, 396, 393, 390, 2181, 386, 2178, 407, 1453, 1451, 1449, 1446, 420, 1460, 2209, 769, 764, 720, 712, 2391, 729, 1713, 664, 663, 661, 659, 2352, 656, 2349, 671, 1679, 1677, 2553, 922, 919, 2519, 2516, 885, 883, 881, 2685, 2661, 2659, 2767, 2756, 2755, 140, 1137, 1136, 130, 127, 1125, 1124, 1122, 1127, 109, 106, 102, 1103, 1102, 1100, 1098, 116, 1107, 1105, 1980, 80, 76, 73, 1947, 1068, 1067, 1065, 1063, 90, 1060, 87, 1075, 1073, 1070, 1080, 1966, 1965, 46, 43, 40, 1912, 36, 1909, 1019, 1018, 1016, 1014, 58, 1011, 55, 1008, 51, 1029, 1027, 1024, 1021, 63, 1037, 1034, 1940, 1939, 1937, 1942, 8, 1866, 4, 1863, 1, 1860, 956, 954, 952, 949, 946, 17, 14, 969, 967, 964, 961, 27, 957, 24, 979, 976, 972, 1901, 1900, 1898, 1896, 986, 1905, 1903, 350, 349, 1381, 329, 327, 324, 1368, 1366, 292, 290, 287, 284, 2118, 304, 1341, 1339, 1337, 1345, 243, 240, 237, 2086, 233, 2083, 254, 1297, 1295, 1293, 1290, 1304, 2114, 190, 187, 184, 2034, 180, 2031, 177, 2027, 199, 1233, 1231, 1229, 1226, 217, 1223, 1241, 2078, 2076, 584, 555, 554, 552, 550, 2282, 562, 1586, 507, 506, 504, 502, 2257, 499, 2254, 515, 1563, 1561, 445, 443, 441, 2219, 438, 2216, 435, 2212, 460, 454, 475, 1517, 1515, 1512, 2447, 798, 797, 2422, 2419, 770, 768, 766, 2383, 2380, 2376, 721, 719, 717, 714, 731, 1714, 2602, 2582, 2580, 2548, 2546, 2543, 923, 921, 2717, 2706, 2705, 2683, 2682, 2680, 1771, 1752, 1750, 1733, 1732, 1731, 1735, 1814, 1707, 1670, 1668, 1631, 1629, 1626, 1634, 1599, 1598, 1596, 1594, 1603, 1601, 2326, 1772, 1753, 1751, 1581, 1554, 1552, 1504, 1501, 1498, 1509, 1442, 1437, 1434, 401, 1448, 1445, 2206, 1392, 1391, 1389, 1387, 1384, 359, 1399, 1397, 1394, 1404, 2171, 2170, 1708, 1672, 1669, 619, 1632, 1630, 1628, 1773, 1378, 1363, 1361, 1333, 1328, 1336, 1286, 1281, 1278, 248, 1292, 1289, 2111, 1218, 1216, 1210, 197, 1206, 193, 1228, 1225, 1221, 1236, 2073, 2071, 1151, 1150, 1148, 1146, 152, 1143, 149, 1140, 145, 1161, 1159, 1156, 1153, 158, 1169, 1166, 2017, 2016, 2014, 2019, 1582, 510, 1556, 1553, 452, 448, 1506, 1500, 394, 391, 387, 1443, 1441, 1439, 1436, 1450, 2207, 765, 716, 713, 1709, 662, 660, 657, 1673, 1671, 916, 914, 879, 878, 877, 882, 1135, 1134, 1121, 1120, 1118, 1123, 1097, 1096, 1094, 1092, 103, 1101, 1099, 1979, 1059, 1058, 1056, 1054, 77, 1051, 74, 1066, 1064, 1061, 1071, 1964, 1963, 1007, 1006, 1004, 1002, 999, 41, 996, 37, 1017, 1015, 1012, 1009, 52, 1025, 1022, 1936, 1935, 1933, 1938, 942, 940, 938, 935, 932, 5, 2, 955, 953, 950, 947, 18, 943, 15, 965, 962, 958, 1895, 1894, 1892, 1890, 973, 1899, 1897, 1379, 325, 1364, 1362, 288, 285, 1334, 1332, 1330, 241, 238, 234, 1287, 1285, 1283, 1280, 1294, 2112, 188, 185, 181, 178, 2028, 1219, 1217, 1215, 1212, 200, 1209, 1227, 2074, 2072, 583, 553, 551, 1583, 505, 503, 500, 513, 1557, 1555, 444, 442, 439, 436, 2213, 455, 451, 1507, 1505, 1502, 796, 763, 762, 760, 767, 711, 710, 708, 706, 2377, 718, 715, 1710, 2544, 917, 915, 2681, 1627, 1597, 1595, 2325, 1769, 1749, 1747, 1499, 1438, 1435, 2204, 1390, 1388, 1385, 1395, 2169, 2167, 1704, 1665, 1662, 1625, 1623, 1620, 1770, 1329, 1282, 1279, 2109, 1214, 1207, 1222, 2068, 2065, 1149, 1147, 1144, 1141, 146, 1157, 1154, 2013, 2011, 2008, 2015, 1579, 1549, 1546, 1495, 1487, 1433, 1431, 1428, 1425, 388, 1440, 2205, 1705, 658, 1667, 1664, 1119, 1095, 1093, 1978, 1057, 1055, 1052, 1062, 1962, 1960, 1005, 1003, 1000, 997, 38, 1013, 1010, 1932, 1930, 1927, 1934, 941, 939, 936, 933, 6, 930, 3, 951, 948, 944, 1889, 1887, 1884, 1881, 959, 1893, 1891, 35, 1377, 1360, 1358, 1327, 1325, 1322, 1331, 1277, 1275, 1272, 1269, 235, 1284, 2110, 1205, 1204, 1201, 1198, 182, 1195, 179, 1213, 2070, 2067, 1580, 501, 1551, 1548, 440, 437, 1497, 1494, 1490, 1503, 761, 709, 707, 1706, 913, 912, 2198, 1386, 2164, 2161, 1621, 1766, 2103, 1208, 2058, 2054, 1145, 1142, 2005, 2002, 1999, 2009, 1488, 1429, 1426, 2200, 1698, 1659, 1656, 1975, 1053, 1957, 1954, 1001, 998, 1924, 1921, 1918, 1928, 937, 934, 931, 1879, 1876, 1873, 1870, 945, 1885, 1882, 1323, 1273, 1270, 2105, 1202, 1199, 1196, 1211, 2061, 2057, 1576, 1543, 1540, 1484, 1481, 1478, 1491, 1700];
ZXing.PDF417.PDF417Common.getBitCountSum = function (moduleBitCount) {
    var bitCountSum = 0;
    for (var $i16 = 0, $l16 = moduleBitCount.length, count = moduleBitCount[$i16]; $i16 < $l16; $i16++, count = moduleBitCount[$i16]) {
        bitCountSum += count;
    }
    return bitCountSum;
};
ZXing.PDF417.PDF417Common.toIntArray = function (list) {
    if (!list) {
        return ZXing.PDF417.PDF417Common.EMPTY_INT_ARRAY;
    }
    return list;
};
ZXing.PDF417.PDF417Common.getCodeword = function (symbol) {
    var i = ZXing.PDF417.PDF417Common.SYMBOL_TABLE.indexOf((symbol & 262143));
    if (i < 0) {
        return -1;
    }
    return (ZXing.PDF417.PDF417Common.CODEWORD_TABLE[i] - 1) % ZXing.PDF417.PDF417Common.NUMBER_OF_CODEWORDS;
};


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

ZXing.PDF417.Internal.PDF417DetectorResult = function (bits, points) {
    this.Bits = null;
    this.Points = null;
    this.Bits = bits;
    this.Points = points;
};


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

ZXing.PDF417.Internal.EC.ModulusPoly = function (field, coefficients) {
    this.field = null;
    this.coefficients = null;
    if (coefficients.length == 0) {
        throw new Error();
    }
    this.field = field;
    var coefficientsLength = coefficients.length;
    if (coefficientsLength > 1 && coefficients[0] == 0) {
        var firstNonZero = 1;
        while (firstNonZero < coefficientsLength && coefficients[firstNonZero] == 0) {
            firstNonZero++;
        }
        if (firstNonZero == coefficientsLength) {
            this.coefficients = new Int32Array([0]);
        }
        else {
            this.coefficients = new Int32Array(coefficientsLength - firstNonZero);
            ArrayCopy(coefficients, firstNonZero, this.coefficients, 0, this.coefficients.length);
        }
    }
    else {
        this.coefficients = coefficients;
    }
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.get_Coefficients = function () {
    return this.coefficients;
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.get_Degree = function () {
    return this.coefficients.length - 1;
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.get_isZero = function () {
    return this.coefficients[0] == 0;
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.getCoefficient = function (degree) {
    return this.coefficients[this.coefficients.length - 1 - degree];
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.evaluateAt = function (a) {
    if (a == 0) {
        return this.getCoefficient(0);
    }
    var size = this.coefficients.length;
    var result = 0;
    if (a == 1) {
        for (var $i11 = 0, $t11 = this.coefficients, $l11 = $t11.length, coefficient = $t11[$i11]; $i11 < $l11; $i11++, coefficient = $t11[$i11]) {
            result = this.field.add(result, coefficient);
        }
        return result;
    }
    result = this.coefficients[0];
    for (var i = 1; i < size; i++) {
        result = this.field.add(this.field.multiply(a, result), this.coefficients[i]);
    }
    return result;
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.add = function (other) {
    if (this.field != other.field) {
        throw new Error("ModulusPolys do not have same ModulusGF field");
    }
    if (this.get_isZero()) {
        return other;
    }
    if (other.get_isZero()) {
        return this;
    }
    var smallerCoefficients = this.coefficients;
    var largerCoefficients = other.coefficients;
    if (smallerCoefficients.length > largerCoefficients.length) {
        var temp = smallerCoefficients;
        smallerCoefficients = largerCoefficients;
        largerCoefficients = temp;
    }
    var sumDiff = new Int32Array(largerCoefficients.length);
    var lengthDiff = largerCoefficients.length - smallerCoefficients.length;
    //System.Array.Copy(largerCoefficients, 0, sumDiff, 0, lengthDiff);
    ArrayCopy(largerCoefficients, 0, sumDiff, 0, lengthDiff);
    for (var i = lengthDiff; i < largerCoefficients.length; i++) {
        sumDiff[i] = this.field.add(smallerCoefficients[i - lengthDiff], largerCoefficients[i]);
    }
    return new ZXing.PDF417.Internal.EC.ModulusPoly(this.field, sumDiff);
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.subtract = function (other) {
    if (this.field != other.field) {
        throw new Error("ModulusPolys do not have same ModulusGF field");
    }
    if (other.get_isZero()) {
        return this;
    }
    return this.add(other.getNegative());
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.multiply = function (other) {
    if (this.field != other.field) {
        throw new Error("ModulusPolys do not have same ModulusGF field");
    }
    if (this.get_isZero() || other.get_isZero()) {
        return this.field.Zero;
    }
    var aCoefficients = this.coefficients;
    var aLength = aCoefficients.length;
    var bCoefficients = other.coefficients;
    var bLength = bCoefficients.length;
    var product = new Int32Array(aLength + bLength - 1);
    for (var i = 0; i < aLength; i++) {
        var aCoeff = aCoefficients[i];
        for (var j = 0; j < bLength; j++) {
            product[i + j] = this.field.add(product[i + j], this.field.multiply(aCoeff, bCoefficients[j]));
        }
    }
    return new ZXing.PDF417.Internal.EC.ModulusPoly(this.field, product);
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.getNegative = function () {
    var size = this.coefficients.length;
    var negativeCoefficients = new Int32Array(size);
    for (var i = 0; i < size; i++) {
        negativeCoefficients[i] = this.field.subtract(0, this.coefficients[i]);
    }
    return new ZXing.PDF417.Internal.EC.ModulusPoly(this.field, negativeCoefficients);
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.multiply = function (scalar) {
    if (scalar == 0) {
        return this.field.Zero;
    }
    if (scalar == 1) {
        return this;
    }
    var size = this.coefficients.length;
    var product = new Int32Array(size);
    for (var i = 0; i < size; i++) {
        product[i] = this.field.multiply(this.coefficients[i], scalar);
    }
    return new ZXing.PDF417.Internal.EC.ModulusPoly(this.field, product);
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.multiplyByMonomial = function (degree, coefficient) {
    if (degree < 0) {
        throw new Error();
    }
    if (coefficient == 0) {
        return this.field.Zero;
    }
    var size = this.coefficients.length;
    var product = new Int32Array(size + degree);
    for (var i = 0; i < size; i++) {
        product[i] = this.field.multiply(this.coefficients[i], coefficient);
    }
    return new ZXing.PDF417.Internal.EC.ModulusPoly(this.field, product);
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.divide = function (other) {
    if (this.field != other.field) {
        throw new Error("ModulusPolys do not have same ModulusGF field");
    }
    if (other.get_isZero()) {
        throw new Error();
    }
    var quotient = this.field.Zero;
    var remainder = this;
    var denominatorLeadingTerm = other.getCoefficient(other.get_Degree());
    var inverseDenominatorLeadingTerm = this.field.inverse(denominatorLeadingTerm);
    while (remainder.get_Degree() >= other.get_Degree() && !remainder.get_isZero()) {
        var degreeDifference = remainder.get_Degree() - other.get_Degree();
        var scale = this.field.multiply(remainder.getCoefficient(remainder.get_Degree()), inverseDenominatorLeadingTerm);
        var term = other.multiplyByMonomial(degreeDifference, scale);
        var iterationQuotient = this.field.buildMonomial(degreeDifference, scale);
        quotient = quotient.add(iterationQuotient);
        remainder = remainder.subtract(term);
    }
    return [quotient, remainder];
};
ZXing.PDF417.Internal.EC.ModulusPoly.prototype.toString = function () {
    var result = "";
    for (var degree = this.get_Degree() ; degree >= 0; degree--) {
        var coefficient = this.getCoefficient(degree);
        if (coefficient != 0) {
            if (coefficient < 0) {
                result += " - ";
                coefficient = -coefficient;
            }
            else {
                if (result.length > 0) {
                    result += " + ";
                }
            }
            if (degree == 0 || coefficient != 1) {
                result += coefficient;
            }
            if (degree != 0) {
                if (degree == 1) {
                    result += "x";
                }
                else {
                    result += "x^";
                    result += degree;
                }
            }
        }
    }
    return result;
};


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

ZXing.PDF417.Internal.EC.ModulusGF = function (modulus, generator) {
    this.expTable = null;
    this.logTable = null;
    this.modulus = 0;
    this.Zero = null;
    this.One = null;
    this.modulus = modulus;
    this.expTable = new Int32Array(modulus);
    this.logTable = new Int32Array(modulus);
    var x = 1;
    for (var i = 0; i < modulus; i++) {
        this.expTable[i] = x;
        x = (x * generator) % modulus;
    }
    for (i = 0; i < modulus - 1; i++) {
        this.logTable[this.expTable[i]] = i;
    }
    this.Zero = new ZXing.PDF417.Internal.EC.ModulusPoly(this, new Int32Array([0]));
    this.One = new ZXing.PDF417.Internal.EC.ModulusPoly(this, new Int32Array([1]));
};
ZXing.PDF417.Internal.EC.ModulusGF.PDF417_GF = new ZXing.PDF417.Internal.EC.ModulusGF(ZXing.PDF417.PDF417Common.NUMBER_OF_CODEWORDS, 3);
ZXing.PDF417.Internal.EC.ModulusGF.prototype.buildMonomial = function (degree, coefficient) {
    if (degree < 0) {
        throw new Error();
    }
    if (coefficient == 0) {
        return this.Zero;
    }
    var coefficients = new Int32Array(degree + 1);
    coefficients[0] = coefficient;
    return new ZXing.PDF417.Internal.EC.ModulusPoly(this, coefficients);
};
ZXing.PDF417.Internal.EC.ModulusGF.prototype.add = function (a, b) {
    return (a + b) % this.modulus;
};
ZXing.PDF417.Internal.EC.ModulusGF.prototype.subtract = function (a, b) {
    return (this.modulus + a - b) % this.modulus;
};
ZXing.PDF417.Internal.EC.ModulusGF.prototype.exp = function (a) {
    return this.expTable[a];
};
ZXing.PDF417.Internal.EC.ModulusGF.prototype.log = function (a) {
    if (a == 0) {
        throw new Error();
    }
    return this.logTable[a];
};
ZXing.PDF417.Internal.EC.ModulusGF.prototype.inverse = function (a) {
    if (a == 0) {
        throw new Error();
    }
    return this.expTable[this.modulus - this.logTable[a] - 1];
};
ZXing.PDF417.Internal.EC.ModulusGF.prototype.multiply = function (a, b) {
    if (a == 0 || b == 0) {
        return 0;
    }
    return this.expTable[(this.logTable[a] + this.logTable[b]) % (this.modulus - 1)];
};
ZXing.PDF417.Internal.EC.ModulusGF.prototype.get_Size = function () {
    return this.modulus;
};


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

ZXing.PDF417.Internal.EC.ErrorCorrection = function () {
    this.field = null;
    this.field = ZXing.PDF417.Internal.EC.ModulusGF.PDF417_GF;
};
ZXing.PDF417.Internal.EC.ErrorCorrection.prototype.decode = function (received, numECCodewords, erasures, errorLocationsCount) {
    var poly = new ZXing.PDF417.Internal.EC.ModulusPoly(this.field, received);
    var S = new Int32Array(numECCodewords);
    var error = false;
    errorLocationsCount.Value = 0;
    for (var i = numECCodewords; i > 0; i--) {
        var eval = poly.evaluateAt(this.field.exp(i));
        S[numECCodewords - i] = eval;
        if (eval != 0) {
            error = true;
        }
    }
    if (!error) {
        return true;
    }
    var knownErrors = this.field.One;
    if (erasures != null) {
        for (var $i10 = 0, $l10 = erasures.length, erasure = erasures[$i10]; $i10 < $l10; $i10++, erasure = erasures[$i10]) {
            var b = this.field.exp(received.length - 1 - erasure);
            var term = new ZXing.PDF417.Internal.EC.ModulusPoly(this.field, new Int32Array([this.field.subtract(0, b), 1]));
            knownErrors = knownErrors.multiply(term);
        }
    }
    var syndrome = new ZXing.PDF417.Internal.EC.ModulusPoly(this.field, S);
    var sigmaOmega = this.runEuclideanAlgorithm(this.field.buildMonomial(numECCodewords, 1), syndrome, numECCodewords);
    if (sigmaOmega == null) {
        return false;
    }
    var sigma = sigmaOmega[0];
    var omega = sigmaOmega[1];
    if (sigma == null || omega == null) {
        return false;
    }
    var errorLocations = this.findErrorLocations(sigma);
    if (errorLocations == null) {
        return false;
    }
    var errorMagnitudes = this.findErrorMagnitudes(omega, sigma, errorLocations);
    for (i = 0; i < errorLocations.length; i++) {
        var position = received.length - 1 - this.field.log(errorLocations[i]);
        if (position < 0) {
            return false;
        }
        received[position] = this.field.subtract(received[position], errorMagnitudes[i]);
    }
    errorLocationsCount.Value = errorLocations.length;
    return true;
};
ZXing.PDF417.Internal.EC.ErrorCorrection.prototype.runEuclideanAlgorithm = function (a, b, R) {
    if (a.get_Degree() < b.get_Degree()) {
        var temp = a;
        a = b;
        b = temp;
    }
    var rLast = a;
    var r = b;
    var tLast = this.field.Zero;
    var t = this.field.One;
    while (r.get_Degree() >= R / 2) {
        var rLastLast = rLast;
        var tLastLast = tLast;
        rLast = r;
        tLast = t;
        if (rLast.get_isZero()) {
            return null;
        }
        r = rLastLast;
        var q = this.field.Zero;
        var denominatorLeadingTerm = rLast.getCoefficient(rLast.get_Degree());
        var dltInverse = this.field.inverse(denominatorLeadingTerm);
        while (r.get_Degree() >= rLast.get_Degree() && !r.get_isZero()) {
            var degreeDiff = r.get_Degree() - rLast.get_Degree();
            var scale = this.field.multiply(r.getCoefficient(r.get_Degree()), dltInverse);
            q = q.add(this.field.buildMonomial(degreeDiff, scale));
            r = r.subtract(rLast.multiplyByMonomial(degreeDiff, scale));
        }
        t = q.multiply(tLast).subtract(tLastLast).getNegative();
    }
    var sigmaTildeAtZero = t.getCoefficient(0);
    if (sigmaTildeAtZero == 0) {
        return null;
    }
    var inverse = this.field.inverse(sigmaTildeAtZero);
    var sigma = t.multiply(inverse);
    var omega = r.multiply(inverse);
    return [sigma, omega];
};
ZXing.PDF417.Internal.EC.ErrorCorrection.prototype.findErrorLocations = function (errorLocator) {
    var numErrors = errorLocator.get_Degree();
    var result = new Int32Array(numErrors);
    var e = 0;
    for (var i = 1; i < this.field.get_Size() && e < numErrors; i++) {
        if (errorLocator.evaluateAt(i) == 0) {
            result[e] = this.field.inverse(i);
            e++;
        }
    }
    if (e != numErrors) {
        return null;
    }
    return result;
};
ZXing.PDF417.Internal.EC.ErrorCorrection.prototype.findErrorMagnitudes = function (errorEvaluator, errorLocator, errorLocations) {
    var errorLocatorDegree = errorLocator.get_Degree();
    var formalDerivativeCoefficients = new Int32Array(errorLocatorDegree);
    for (var i = 1; i <= errorLocatorDegree; i++) {
        formalDerivativeCoefficients[errorLocatorDegree - i] = this.field.multiply(i, errorLocator.getCoefficient(i));
    }
    var formalDerivative = new ZXing.PDF417.Internal.EC.ModulusPoly(this.field, formalDerivativeCoefficients);
    var s = errorLocations.length;
    var result = new Int32Array(s);
    for (i = 0; i < s; i++) {
        var xiInverse = this.field.inverse(errorLocations[i]);
        var numerator = this.field.subtract(0, errorEvaluator.evaluateAt(xiInverse));
        var denominator = this.field.inverse(formalDerivative.evaluateAt(xiInverse));
        result[i] = this.field.multiply(numerator, denominator);
    }
    return result;
};


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

ZXing.PDF417.Internal.BarcodeMetadata = function (columnCount, rowCountUpperPart, rowCountLowerPart, errorCorrectionLevel) {
    this.ColumnCount = 0;
    this.ErrorCorrectionLevel = 0;
    this.RowCountUpper = 0;
    this.RowCountLower = 0;
    this.RowCount = 0;
    this.ColumnCount = columnCount;
    this.ErrorCorrectionLevel = errorCorrectionLevel;
    this.RowCountUpper = rowCountUpperPart;
    this.RowCountLower = rowCountLowerPart;
    this.RowCount = rowCountLowerPart + rowCountUpperPart;
};


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

ZXing.PDF417.Internal.BarcodeValue = function () {
    this.values = {};
};

ZXing.PDF417.Internal.BarcodeValue.prototype.setValue = function (value) {
    value = Math.floor(value);
    var confidence = this.values.hasOwnProperty(value) ? this.values[value] : 0;
    confidence++;
    this.values[value] = confidence;
};

ZXing.PDF417.Internal.BarcodeValue.prototype.getValue = function () {
    var maxConfidence = -1;
    var result = [];
    for (var key in this.values) {
        if (this.values.hasOwnProperty(key)) {
            var entry = this.values[key];
            if (entry > maxConfidence) {
                maxConfidence = entry;
                result.splice(0);
                result.push(parseInt(key));
            }
            else if (entry == maxConfidence) {
                result.push(parseInt(key));
            }
        }
    }
    return result;
};
ZXing.PDF417.Internal.BarcodeValue.prototype.getConfidence = function (barcodeValue) {
    return typeof this.values[barcodeValue] != 'undefined' ? this.values[barcodeValue] : 0;
};


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

ZXing.PDF417.Internal.BoundingBox = function (image, topLeft, bottomLeft, topRight, bottomRight) {
    this.image = null;
    this.TopLeft = null;
    this.TopRight = null;
    this.BottomLeft = null;
    this.BottomRight = null;
    this.MinX = 0;
    this.MaxX = 0;
    this.MinY = 0;
    this.MaxY = 0;
    this.image = image;
    this.TopLeft = topLeft;
    this.TopRight = topRight;
    this.BottomLeft = bottomLeft;
    this.BottomRight = bottomRight;
    this.calculateMinMaxValues();
};
ZXing.PDF417.Internal.BoundingBox.Create = function (image, topLeft, bottomLeft, topRight, bottomRight) {
    if (arguments.length > 1) {
        if ((!topLeft && !topRight) || (!bottomLeft && !bottomRight) || (topLeft && !bottomLeft) || (topRight && !bottomRight)) {
            return null;
        }
        return new ZXing.PDF417.Internal.BoundingBox(image, topLeft, bottomLeft, topRight, bottomRight);
    } else {
        return ZXing.PDF417.Internal.BoundingBox.CreateBoxed(image);
    }
};
ZXing.PDF417.Internal.BoundingBox.CreateBoxed = function (box) {
    return new ZXing.PDF417.Internal.BoundingBox(box.image, box.TopLeft, box.BottomLeft, box.TopRight, box.BottomRight);
};
ZXing.PDF417.Internal.BoundingBox.merge = function (leftBox, rightBox) {
    if (!leftBox)
        return rightBox;
    if (!rightBox)
        return leftBox;
    return new ZXing.PDF417.Internal.BoundingBox(leftBox.image, leftBox.TopLeft, leftBox.BottomLeft, rightBox.TopRight, rightBox.BottomRight);
};
ZXing.PDF417.Internal.BoundingBox.prototype.addMissingRows = function (missingStartRows, missingEndRows, isLeft) {
    var newTopLeft = this.TopLeft;
    var newBottomLeft = this.BottomLeft;
    var newTopRight = this.TopRight;
    var newBottomRight = this.BottomRight;
    if (missingStartRows > 0) {
        var top = isLeft ? this.TopLeft : this.TopRight;
        var newMinY = top.y - missingStartRows;
        if (newMinY < 0) {
            newMinY = 0;
        }
        var newTop = new ZXing.ResultPoint(top.x, newMinY);
        if (isLeft) {
            newTopLeft = newTop;
        }
        else {
            newTopRight = newTop;
        }
    }
    if (missingEndRows > 0) {
        var bottom = isLeft ? this.BottomLeft : this.BottomRight;
        var newMaxY = bottom.y + missingEndRows;
        if (newMaxY >= this.image.get_Height()) {
            newMaxY = this.image.get_Height() - 1;
        }
        var newBottom = new ZXing.ResultPoint(bottom.x, newMaxY);
        if (isLeft) {
            newBottomLeft = newBottom;
        }
        else {
            newBottomRight = newBottom;
        }
    }
    this.calculateMinMaxValues();
    return new ZXing.PDF417.Internal.BoundingBox(this.image, newTopLeft, newBottomLeft, newTopRight, newBottomRight);
};
ZXing.PDF417.Internal.BoundingBox.prototype.calculateMinMaxValues = function () {
    if (!this.TopLeft) {
        this.TopLeft = new ZXing.ResultPoint(0, this.TopRight.y);
        this.BottomLeft = new ZXing.ResultPoint(0, this.BottomRight.y);
    } else if (!this.TopRight) {
        this.TopRight = new ZXing.ResultPoint(this.image.width - 1, this.TopLeft.y);
        this.BottomRight = new ZXing.ResultPoint(this.image.width - 1, this.TopLeft.y);
    }
    this.MinX = Math.min(this.TopLeft.x, this.BottomLeft.x);
    this.MaxX = Math.max(this.TopRight.x, this.BottomRight.x);
    this.MinY = Math.min(this.TopLeft.y, this.TopRight.y);
    this.MaxY = Math.max(this.BottomLeft.y, this.BottomRight.y);
};
ZXing.PDF417.Internal.BoundingBox.prototype.SetBottomRight = function (bottomRight) {
    this.BottomRight = bottomRight;
    this.calculateMinMaxValues();
};


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
    ZXing.PDF417.Internal.DecodedBitStreamParser.EXP900[i] = ZXing.PDF417.Internal.DecodedBitStreamParser.EXP900[i - 1].multiply(nineHundred);
}
ZXing.PDF417.Internal.DecodedBitStreamParser.decode = function (codewords, ecLevel) {
    var result = "";
    var codeIndex = 1;
    var code = codewords[codeIndex++];
    var resultMetadata = new ZXing.PDF417.PDF417ResultMetadata();
    var p1 = null;
    while (codeIndex < codewords[0]) {
        switch (code) {
            case 900:
                p1 = { mode: code, codewords: codewords, codeIndex: codeIndex, result: result };
                codeIndex = ZXing.PDF417.Internal.DecodedBitStreamParser.textCompaction(p1);
                result = p1.result;
                break;
            case 901:
            case 924:
                p1 = { mode: code, codewords: codewords, codeIndex: codeIndex, result: result };
                codeIndex = ZXing.PDF417.Internal.DecodedBitStreamParser.byteCompaction(p1);
                result = p1.result;
                break;
            case 913:
                result += (codewords[codeIndex++]);
                break;
            case 902:
                p1 = { mode: code, codewords: codewords, codeIndex: codeIndex, result: result };
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
                p1 = { mode: code, codewords: codewords, codeIndex: codeIndex, result: result };
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
    if (!result.length) {
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
    if (!s)
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
    var p1 = { textCompactionData: textCompactionData, byteCompactionData: byteCompactionData, length: index, result: result };
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
    var count = 0;
    var value = 0;
    var end = false;
    if (mode == 901) {
        count = 0;
        value = 0;
        var byteCompactedCodewords = new Int32Array(6);
        end = false;
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
                if ((count % 5 === 0) && (count > 0)) {
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
    } else if (mode == 924) {
        count = 0;
        value = 0;
        end = false;
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
                for (var j1 = 0; j1 < 6; ++j1) {
                    decodedBytes.push((value >> (8 * (5 - j1))));
                }
                value = 0;
                count = 0;
            }
        }
    }
    p.result += (String.fromCharCode.apply(null, decodedBytes));
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
        if (count % 15 === 0 || code === 902 || end) {
            if (count > 0) {
                var s = ZXing.PDF417.Internal.DecodedBitStreamParser.decodeBase900toBase10(numericCodewords, count);
                if (!s)
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
  } while (unadjustedCodewordCount > 0 && unadjustedCodewordCount < previousUnadjustedCount);
  return this.DetectionResultColumns;
};
ZXing.PDF417.Internal.DetectionResult.prototype.adjustIndicatorColumnRowNumbers = function (detectionResultColumn) {
  if (detectionResultColumn) {
    (detectionResultColumn instanceof ZXing.PDF417.Internal.DetectionResultRowIndicatorColumn || detectionResultColumn == null ? detectionResultColumn : (function () {
      throw new Error("InvalidCastException");
    }())).adjustCompleteIndicatorColumnRowNumbers(this.Metadata);
  }
};
ZXing.PDF417.Internal.DetectionResult.prototype.adjustRowNumbersMy = function () {
  var unadjustedCount = this.adjustRowNumbersByRow();
  if (unadjustedCount == 0) {
    return 0;
  }
  for(var barcodeColumn = 1; barcodeColumn < this.ColumnCount + 1; barcodeColumn++) {
    var codewords = this.DetectionResultColumns[barcodeColumn].Codewords;
    for(var codewordsRow = 0; codewordsRow < codewords.length; codewordsRow++) {
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
  for(var $i5 = 0, $l5 = otherCodewords.length, otherCodeword = otherCodewords[$i5]; $i5 < $l5; $i5++, otherCodeword = otherCodewords[$i5]) {
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
  for(var codewordsRow = 0; codewordsRow < LRIcodewords.length; codewordsRow++) {
    if (LRIcodewords[codewordsRow] != null && RRIcodewords[codewordsRow] != null && LRIcodewords[codewordsRow].RowNumber == RRIcodewords[codewordsRow].RowNumber) {
      for(var barcodeColumn = 1; barcodeColumn <= this.ColumnCount; barcodeColumn++) {
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
  for(var codewordsRow = 0; codewordsRow < codewords.length; codewordsRow++) {
    if (codewords[codewordsRow] == null) {
      continue;
    }
    var rowIndicatorRowNumber = codewords[codewordsRow].RowNumber;
    var invalidRowCounts = 0;
    for(var barcodeColumn = this.ColumnCount + 1; barcodeColumn > 0 && invalidRowCounts < 2; barcodeColumn--) {
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
  for(var codewordsRow = 0; codewordsRow < codewords.length; codewordsRow++) {
    if (codewords[codewordsRow] == null) {
      continue;
    }
    var rowIndicatorRowNumber = codewords[codewordsRow].RowNumber;
    var invalidRowCounts = 0;
    for(var barcodeColumn = 1; barcodeColumn < this.ColumnCount + 1 && invalidRowCounts < 2; barcodeColumn++) {
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
  for(var codewordsRow = 0; codewordsRow < rowIndicatorColumn.Codewords.length; codewordsRow++) {
    formatter += "CW {0}:".format(FormatInteger(codewordsRow, 3));
    for(var barcodeColumn = 0; barcodeColumn < this.ColumnCount + 2; barcodeColumn++) {
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
    for (row = rowHeights.length - 1; row >= 0; row--) {
        missingEndRows += maxRowHeight - rowHeights[row];
        if (rowHeights[row] > 0) {
            break;
        }
    }
    for (row = codewords.length - 1; missingEndRows > 0 && codewords[row] == null; row--) {
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
        var startColumn = startPoint.x;
        for (var imageRow = startPoint.y ; imageRow <= boundingBox.MaxY && imageRow >= boundingBox.MinY; imageRow += increment) {
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
            if (result != null) {
                result.AmbiguousValuesCount = ambiguousIndexValues.length;
                return result;
            }
        }
        catch ($$e1) {
        }
        if (ambiguousIndexCount.length == 0) {
            return null;
        }
        for (i = 0; i < ambiguousIndexCount.length; i++) {
            if (ambiguousIndexCount[i] < ambiguousIndexValues[i].length - 1) {
                ambiguousIndexCount[i]++;
                break;
            } else {
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
    return Math.max(Math.max(ZXing.PDF417.PDF417Reader.getMaxWidth(p[0], p[4]), ZXing.PDF417.PDF417Reader.getMaxWidth(p[6], p[2]) * Math.floor(ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD / ZXing.PDF417.PDF417Common.MODULES_IN_STOP_PATTERN)), Math.max(ZXing.PDF417.PDF417Reader.getMaxWidth(p[1], p[5]), ZXing.PDF417.PDF417Reader.getMaxWidth(p[7], p[3]) * Math.floor(ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD / ZXing.PDF417.PDF417Common.MODULES_IN_STOP_PATTERN)));
};
ZXing.PDF417.PDF417Reader.getMinCodewordWidth = function (p) {
    return Math.min(Math.min(ZXing.PDF417.PDF417Reader.getMinWidth(p[0], p[4]), ZXing.PDF417.PDF417Reader.getMinWidth(p[6], p[2]) * Math.floor(ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD / ZXing.PDF417.PDF417Common.MODULES_IN_STOP_PATTERN)), Math.min(ZXing.PDF417.PDF417Reader.getMinWidth(p[1], p[5]), ZXing.PDF417.PDF417Reader.getMinWidth(p[7], p[3]) * Math.floor(ZXing.PDF417.PDF417Common.MODULES_IN_CODEWORD / ZXing.PDF417.PDF417Common.MODULES_IN_STOP_PATTERN)));
};
ZXing.PDF417.PDF417Reader.prototype.reset = function () {
};

}, false);
}(window, window.Error, window.document, window.Uint8Array, window.Uint32Array, window.bigInt));

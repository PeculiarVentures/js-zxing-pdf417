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


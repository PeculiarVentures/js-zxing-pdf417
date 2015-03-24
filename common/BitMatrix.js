//
//Ported to JavaScript by Patrizio Bruno 2015
//  
//desertconsulting@gmail.com, https://github.com/PeculiarVentures/validatewallet.com
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
    this.bits = arguments.length == 4 ? bits : arguments.length == 3 ? rowSize : new Int32Array(this.rowSize * this.height);;
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
    for (var i = 0; i < bitsPos; i++) {
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
    if (value) {
        var offset = y * this.rowSize + (x >> 5);
        this.bits[offset] |= 1 << (x & 31);
    }
    else {
        var offset = y * this.rowSize + Math.floor((x / 32));
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
    for (var y = 0; y < this.height; y++) {
        var offset = y * this.rowSize;
        var row = mask.getRow(y, rowArray).get_Array();
        for (var x = 0; x < this.rowSize; x++) {
            this.bits[offset + x] ^= row[x];
        }
    }
};
ZXing.Common.BitMatrix.prototype.clear = function () {
    var max = this.bits.length;
    for (var i = 0; i < max; i++) {
        this.bits[i] = 0;
    }
};
ZXing.Common.BitMatrix.prototype.setRegion = function (left, top, width, height) {
    if (top < 0 || left < 0) {
        throw new Error("Left and top must be nonnegative");
    }
    if (height < 1 || width < 1) {
        throw new Error("Height and width must be at least 1");
    }
    var right = left + width;
    var bottom = top + height;
    if (bottom > this.height || right > this.width) {
        throw new Error("The region must fit inside the matrix");
    }
    for (var y = top; y < bottom; y++) {
        var offset = y * this.rowSize;
        for (var x = left; x < right; x++) {
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
    for (var x = 0; x < this.rowSize; x++) {
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
    for (var i = 0; i < (height + 1) / 2; i++) {
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
    for (var y = 0; y < this.height; y++) {
        for (var x32 = 0; x32 < this.rowSize; x32++) {
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
                    var bit = 31;
                    while ((theBits >> bit) == 0) {
                        bit--;
                    }
                    if ((x32 * 32 + bit) > right) {
                        right = x32 * 32 + bit;
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
    }
    ());
    if (this.width != other.width || this.height != other.height || this.rowSize != other.rowSize || this.bits.length != other.bits.length) {
        return false;
    }
    for (var i = 0; i < this.bits.length; i++) {
        if (this.bits[i] != other.bits[i]) {
            return false;
        }
    }
    return true;
};
ZXing.Common.BitMatrix.prototype.GetHashCode = function () {
    var hash = this.width;
    hash = 31 * hash + this.width;
    hash = 31 * hash + this.height;
    hash = 31 * hash + this.rowSize;
    for (var $i3 = 0, $t3 = this.bits, $l3 = $t3.length, bit = $t3[$i3]; $i3 < $l3; $i3++, bit = $t3[$i3]) {
        hash = 31 * hash + bit.GetHashCode();
    }
    return hash;
};
ZXing.Common.BitMatrix.prototype.toString = function () {
    return this.ToString("X ", "  ", "\n");
};
ZXing.Common.BitMatrix.prototype.ToString = function (setString, unsetString) {
    return this.ToString(setString, unsetString, '\n');
};
ZXing.Common.BitMatrix.prototype.ToString = function (setString, unsetString, lineSeparator) {
    var result = "";
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            result += (this.get_Item(x, y) ? setString : unsetString);
        }
        result += lineSeparator;
    }
    return result;
};
ZXing.Common.BitMatrix.prototype.Clone = function () {
    return new ZXing.Common.BitMatrix(this.width, this.height, this.rowSize, this.bits.slice(0));
};
ZXing.Common.BitMatrix.prototype.ToBitmap = function () {
    //return this.ToBitmap(64, null);
};
ZXing.Common.BitMatrix.prototype.ToBitmap = function (format, content) {
    //var writer = (function () {
    //    var $v1 = new ZXing.BarcodeWriter.ctor();
    //    $v1.set_Format(format);
    //    return $v1;
    //}).call(this);
    //return writer.Write$$String(content);
};


//
//  Ported to JavaScript by Patrizio Bruno 2015
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
    if (size > this.bits.length << 5) {
        var newBits = this.bits.slice(0);
        this.bits = newBits;
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
    for (var i = firstInt; i <= lastInt; i++) {
        var firstBit = i > firstInt ? 0 : start & 31;
        var lastBit = i < lastInt ? 31 : end & 31;
        var mask;
        if (firstBit == 0 && lastBit == 31) {
            mask = -1;
        } else {
            mask = 0;
            for (var j = firstBit; j <= lastBit; j++) {
                mask |= 1 << j;
            }
        }
        this.bits[i] |= mask;
    }
};
ZXing.Common.BitArray.prototype.clear = function () {
    var max = this.bits.length;
    for (var i = 0; i < max; i++) {
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
    for (var i = firstInt; i <= lastInt; i++) {
        var firstBit = i > firstInt ? 0 : start & 31;
        var lastBit = i < lastInt ? 31 : end & 31;
        var mask;
        if (firstBit == 0 && lastBit == 31) {
            mask = -1;
        } else {
            mask = 0;
            for (var j = firstBit; j <= lastBit; j++) {
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
    for (var numBitsLeft = numBits; numBitsLeft > 0; numBitsLeft--) {
        this.appendBit(((value >> (numBitsLeft - 1)) & 1) == 1);
    }
};
ZXing.Common.BitArray.prototype.appendBitArray = function (other) {
    var otherSize = other.size;
    this.ensureCapacity(this.size + otherSize);
    for (var i = 0; i < otherSize; i++) {
        this.appendBit(other.get_Item(i));
    }
};
ZXing.Common.BitArray.prototype.xor = function (other) {
    if (this.bits.length != other.bits.length) {
        throw new Error("Sizes don\'t match");
    }
    for (var i = 0; i < this.bits.length; i++) {
        this.bits[i] ^= other.bits[i];
    }
};
ZXing.Common.BitArray.prototype.toBytes = function (bitOffset, array, offset, numBytes) {
    for (var i = 0; i < numBytes; i++) {
        var theByte = 0;
        for (var j = 0; j < 8; j++) {
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
    for (var i = 0; i < oldBitsLen; i++) {
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
        for (var i = 0; i < 31 - leftOffset; i++)
            mask = (mask << 1) | 1;
        var currentInt = (newBits[0] >> leftOffset) & mask;
        for (var i = 1; i < oldBitsLen; i++) {
            var nextInt = newBits[i];
            currentInt |= nextInt << (32 - leftOffset);
            newBits[i - 1] = currentInt;
            currentInt = (nextInt >> leftOffset) & mask;
        }
        newBits[oldBitsLen - 1] = currentInt;
    }
    this.bits = newBits;
};
ZXing.Common.BitArray.makeArray = function (size) {
    var rv = [];
    rv.blockCopy(new Array((size + 31) >> 5), 0, 0, (size + 31) >> 5);
    return rv;
};
ZXing.Common.BitArray.prototype.Equals = function (o) {
    var other = o instanceof ZXing.Common.BitArray ? o : null;
    if (other == null)
        return false;
    if (this.size != other.size)
        return false;
    for (var index = 0; index < this.size; index++) {
        if (this.bits[index] != other.bits[index])
            return false;
    }
    return true;
};
ZXing.Common.BitArray.prototype.GetHashCode = function () {
    var hash = this.size;
    for (var $i2 = 0, $t2 = this.bits, $l2 = $t2.length, bit = $t2[$i2]; $i2 < $l2; $i2++, bit = $t2[$i2]) {
        hash = 31 * hash + bit.GetHashCode();
    }
    return hash;
};
ZXing.Common.BitArray.prototype.toString = function () {
    var result = "";
    for (var i = 0; i < this.size; i++) {
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


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
    for (var i = 0; i < modulus - 1; i++) {
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


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
        throw $CreateException(new System.ArgumentException.ctor(), new Error());
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
        throw $CreateException(new System.ArgumentException.ctor(), new Error());
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


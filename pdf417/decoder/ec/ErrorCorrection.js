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
    for (var i = 0; i < errorLocations.length; i++) {
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
    for (var i = 0; i < s; i++) {
        var xiInverse = this.field.inverse(errorLocations[i]);
        var numerator = this.field.subtract(0, errorEvaluator.evaluateAt(xiInverse));
        var denominator = this.field.inverse(formalDerivative.evaluateAt(xiInverse));
        result[i] = this.field.multiply(numerator, denominator);
    }
    return result;
};


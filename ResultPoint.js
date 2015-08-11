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


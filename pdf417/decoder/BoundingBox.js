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


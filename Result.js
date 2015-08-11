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


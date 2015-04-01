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
    if (rawBytes == null && text == null) {
        throw new Error();
    }
    this.RawBytes = rawBytes;
    this.Text = text;
    this.ByteSegments = byteSegments;
    this.ECLevel = ecLevel;
    this.StructuredAppendParity = typeof saParity == 'undefined' ? -1 : saParity;
    this.StructuredAppendSequenceNumber = typeof saSequence == 'undefined' ? -1 : saSequence;
};

ZXing.Common.DecoderResult.prototype.get_StructuredAppend = function () {
    return this.StructuredAppendParity >= 0 && this.StructuredAppendSequenceNumber >= 0;
};

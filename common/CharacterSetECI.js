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

ZXing.Common.CharacterSetECI = function (value, encodingName) {
    this.encodingName = null;
    ZXing.Common.ECI.call(this, value);
    this.encodingName = encodingName;
};
ZXing.Common.CharacterSetECI.prototype.get_EncodingName = function () {
    return this.encodingName;
};

ZXing.Common.CharacterSetECI.addCharacterSet = function (value, encodingNames) {
    if (Array.isArray(encodingNames)) {
        var eci = new ZXing.Common.CharacterSetECI(value, encodingNames[0]);
        ZXing.Common.CharacterSetECI.VALUE_TO_ECI[value] = eci;
        for (var $i4 = 0, $l4 = encodingNames.length, t = encodingNames[$i4]; $i4 < $l4; $i4++, t = encodingNames[$i4]) {
            ZXing.Common.CharacterSetECI.NAME_TO_ECI[t] = eci;
        }
    } else {
        var encodingName = encodingNames;
        var eci = new ZXing.Common.CharacterSetECI(value, encodingName);
        ZXing.Common.CharacterSetECI.VALUE_TO_ECI[value] = eci;
        ZXing.Common.CharacterSetECI.NAME_TO_ECI[encodingName.toUpperCase()] = eci;
    }
};

ZXing.Common.CharacterSetECI.VALUE_TO_ECI = null;
ZXing.Common.CharacterSetECI.NAME_TO_ECI = null;
ZXing.Common.CharacterSetECI.VALUE_TO_ECI = new Object();
ZXing.Common.CharacterSetECI.NAME_TO_ECI = new Object();
ZXing.Common.CharacterSetECI.addCharacterSet(0, "CP437");
ZXing.Common.CharacterSetECI.addCharacterSet(1, ["ISO-8859-1", "ISO8859_1"]);
ZXing.Common.CharacterSetECI.addCharacterSet(2, "CP437");
ZXing.Common.CharacterSetECI.addCharacterSet(3, ["ISO-8859-1", "ISO8859_1"]);
ZXing.Common.CharacterSetECI.addCharacterSet(4, ["ISO-8859-2", "ISO8859_2"]);
ZXing.Common.CharacterSetECI.addCharacterSet(5, ["ISO-8859-3", "ISO8859_3"]);
ZXing.Common.CharacterSetECI.addCharacterSet(6, ["ISO-8859-4", "ISO8859_4"]);
ZXing.Common.CharacterSetECI.addCharacterSet(7, ["ISO-8859-5", "ISO8859_5"]);
ZXing.Common.CharacterSetECI.addCharacterSet(8, ["ISO-8859-6", "ISO8859_6"]);
ZXing.Common.CharacterSetECI.addCharacterSet(9, ["ISO-8859-7", "ISO8859_7"]);
ZXing.Common.CharacterSetECI.addCharacterSet(10, ["ISO-8859-8", "ISO8859_8"]);
ZXing.Common.CharacterSetECI.addCharacterSet(11, ["ISO-8859-9", "ISO8859_9"]);
ZXing.Common.CharacterSetECI.addCharacterSet(12, ["ISO-8859-4", "ISO-8859-10", "ISO8859_10"]);
ZXing.Common.CharacterSetECI.addCharacterSet(13, ["ISO-8859-11", "ISO8859_11"]);
ZXing.Common.CharacterSetECI.addCharacterSet(15, ["ISO-8859-13", "ISO8859_13"]);
ZXing.Common.CharacterSetECI.addCharacterSet(16, ["ISO-8859-1", "ISO-8859-14", "ISO8859_14"]);
ZXing.Common.CharacterSetECI.addCharacterSet(17, ["ISO-8859-15", "ISO8859_15"]);
ZXing.Common.CharacterSetECI.addCharacterSet(18, ["ISO-8859-3", "ISO-8859-16", "ISO8859_16"]);
ZXing.Common.CharacterSetECI.addCharacterSet(20, ["SJIS", "Shift_JIS"]);
ZXing.Common.CharacterSetECI.addCharacterSet(21, ["WINDOWS-1250", "CP1250"]);
ZXing.Common.CharacterSetECI.addCharacterSet(22, ["WINDOWS-1251", "CP1251"]);
ZXing.Common.CharacterSetECI.addCharacterSet(23, ["WINDOWS-1252", "CP1252"]);
ZXing.Common.CharacterSetECI.addCharacterSet(24, ["WINDOWS-1256", "CP1256"]);
ZXing.Common.CharacterSetECI.addCharacterSet(25, ["UTF-16BE", "UNICODEBIG"]);
ZXing.Common.CharacterSetECI.addCharacterSet(26, ["UTF-8", "UTF8"]);
ZXing.Common.CharacterSetECI.addCharacterSet(27, "US-ASCII");
ZXing.Common.CharacterSetECI.addCharacterSet(170, "US-ASCII");
ZXing.Common.CharacterSetECI.addCharacterSet(28, "BIG5");
ZXing.Common.CharacterSetECI.addCharacterSet(29, ["GB18030", "GB2312", "EUC_CN", "GBK"]);
ZXing.Common.CharacterSetECI.addCharacterSet(30, ["EUC-KR", "EUC_KR"]);
ZXing.Common.CharacterSetECI.getCharacterSetECIByValue = function (value) {
    if (value < 0 || value >= 900) {
        return null;
    }
    return ZXing.Common.CharacterSetECI.VALUE_TO_ECI[value];
};
ZXing.Common.CharacterSetECI.getCharacterSetECIByName = function (name) {
    return ZXing.Common.CharacterSetECI.NAME_TO_ECI[name.toUpperCase()];
};
$Inherit(ZXing.Common.CharacterSetECI, ZXing.Common.ECI);


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

ZXing.Common.ECI = function (value_Renamed) {
    this.value_Renamed = 0;
    this.value_Renamed = value_Renamed;
};
ZXing.Common.ECI.prototype.get_Value = function () {
    return this.value_Renamed;
};
ZXing.Common.ECI.getECIByValue = function (value_Renamed) {
    if (value_Renamed < 0 || value_Renamed > 999999) {
        throw new Error("Bad ECI value: " + value_Renamed);
    }
    if (value_Renamed < 900) {
        return ZXing.Common.CharacterSetECI.getCharacterSetECIByValue(value_Renamed);
    }
    return null;
};


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

ZXing.PDF417.Internal.BarcodeMetadata = function (columnCount, rowCountUpperPart, rowCountLowerPart, errorCorrectionLevel) {
    this.ColumnCount = 0;
    this.ErrorCorrectionLevel = 0;
    this.RowCountUpper = 0;
    this.RowCountLower = 0;
    this.RowCount = 0;
    this.ColumnCount = columnCount;
    this.ErrorCorrectionLevel = errorCorrectionLevel;
    this.RowCountUpper = rowCountUpperPart;
    this.RowCountLower = rowCountLowerPart;
    this.RowCount = rowCountLowerPart + rowCountUpperPart;
};


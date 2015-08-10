module.exports = function(grunt) {

  var config = {
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [
        'Gruntfile.js',
        '*.js',
        'pdf417/*.js',
        'pdf417/decoder/*.js',
        'pdf417/detector/*.js',
        'pdf417/decoder/ec/*.js',
        'common/*.js',
        'common/detector/*.js'
      ]
    },

    concat: {
      dist: {
        options: {
          banner: '(function(exports, Error, document, Uin8Array, Uint32Array, BigInteger, undefined){\ndocument.addEventListener("DOMContentLoaded", function() {\n',
          footer: "}, false);\n}(window, window.Error, window.document, window.Uint8Array, window.Uint32Array, window.bigInt));\n"
        },
        src: [
          'SupportClass.js',
          'ResultMetadataType.js',
          'BarcodeFormat.js',
          'Result.js',
          'DecodeHintType.js',
          'BinaryBitmap.js',
          'Binarizer.js',
          'ResultPoint.js',
          'LuminanceSource.js',
          'InvertedLuminanceSource.js',
          'BaseLuminanceSource.js',
          'BitmapLuminanceSource.js',
          'common/DecoderResult.js',
          'common/BitArray.js',
          'common/BitMatrix.js',
          'common/detector/MathUtils.js',
          'common/ECI.js',
          'common/CharacterSetECI.js',
          'common/GlobalHistogramBinarizer.js',
          'common/HybridBinarizer.js',
          'pdf417/PDF417ResultMetadata.js',
          'pdf417/PDF417Common.js',
          'pdf417/detector/PDF417DetectorResult.js',
          'pdf417/detector/Detector.js',
          'pdf417/decoder/ec/ModulusPoly.js',
          'pdf417/decoder/ec/ModulusGF.js',
          'pdf417/decoder/ec/ErrorCorrection.js',
          'pdf417/decoder/BarcodeMetadata.js',
          'pdf417/decoder/BarcodeValue.js',
          'pdf417/decoder/BoundingBox.js',
          'pdf417/decoder/Codeword.js',
          'pdf417/decoder/DecodedBitStreamParser.js',
          'pdf417/decoder/DetectionResult.js',
          'pdf417/decoder/DetectionResultColumn.js',
          'pdf417/decoder/DetectionResultRowIndicatorColumn.js',
          'pdf417/decoder/PDF417CodewordDecoder.js',
          'pdf417/decoder/PDF417ScanningDecoder.js',
          'pdf417/PDF417Reader.js'
        ],
        dest: 'dist/zxing-pdf417.js'
      }
    },

    uglify: {
      dist: {
        src: 'dist/zxing-pdf417.js',
        dest: 'dist/zxing-pdf417.min.js'
      }
    }
  };


  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [/*'jshint', */'concat', 'uglify']);
};

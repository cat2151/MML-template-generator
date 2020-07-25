angular.module('generatorApp', []);

angular.module('generatorApp')
.controller('generatorController', ['$scope', 'GeneratorService',
function($scope, GeneratorService) {
  $scope.middleText = "";
  $scope.generate = function() {
    if (!$scope.inputText) return;
    $scope.middleText = GeneratorService.getMiddleText($scope.inputText, $scope.inputFormat);
    $scope.generatedText = GeneratorService.generate($scope.middleText, $scope.compiler);
  };
}]);

angular.module('generatorApp')
.service('GeneratorService', [
function() {
  function getMiddleText(inputText, inputFormat) {
    if (inputFormat == "SiON") return sion();
    if (inputFormat == "ストトン") return sutoton();
    if (inputFormat == "AUTO") return auto();
    return "";
    function sion() {
      return inputText;
    }
    function sutoton() {
      return inputText.replace(/ド|ど/g, "c")
        .replace(/レ|れ/g, "d")
        .replace(/ミ|み/g, "e")
        .replace(/ファ|ふぁ/g, "f")
        .replace(/ソ|そ/g, "g")
        .replace(/ラ|ら/g, "a")
        .replace(/シ|し/g, "b")
        .replace(/ー/g, "^");
    }
    function auto() {
      if (inputText.search(/[どれみふぁそらしドレミファソラシー]/g) != -1) return sutoton();
      return sion();
    }
  }
  function generate(sionmml, compiler) {
    var inMmls = sionmml.split(";");
    var outMml = "";
    var ch = 0;
    outMml += genHead();
    angular.forEach(inMmls, function(inMml) {
      outMml += gen1ch(inMml, ch);
      ch++;
    });
    outMml += genTail();
    return outMml;
    function genHead() {
      if (compiler == "nsc") { // nsd.lib [イメージ] "#Code "../../bin/nsd.bin" bgm(0){ TR1 ceg }
        return "#Code " + '"' +"../../bin/nsd.bin" + '"' + " bgm(0) {\n";
      }
      if (compiler == "GBMC") { // GBMC [イメージ] "#mode 3"+改行+''A v15cder" [補足] 末尾rは音を止める用
        return "#@0 {0123456789ABCDEFFEDCBA9876543210}\n" + "#mode 3\n";
      }
      if (compiler == "HuSIC") { // [イメージ] "@WT0={～}"+改行+"A W0v31 cdg"
        return "@WT0={\n $13,$19,$1b,$18,$13,$0f,$10,$14,\n $1b,$1f,$1e,$19,$12,$0c,$0a,$0d,\n $12,$15,$13,$0d,$06,$01,$00,$04,\n $0b,$0f,$10,$0c,$07,$04,$06,$0c\n}\n";
      }
      if (compiler == "MGSC") { // [イメージ] "#opll_mode 0"+改行+"9 v15 @0 cde"
        return "#opll_mode 0\n";
      }
      return "";
    }
    function gen1ch(inMml, ch) {
      if (compiler == "mckc") { // [イメージ] "A v15cde"
        if (ch < 2) return getABC(ch) + " " + "v15" + inMml + "\n"; // AB : pulse
        if (ch == 2) return getABC(ch) + " " + inMml + "\n"; // C : triangle
      }
      if (compiler == "mmlc") { // ofgs2 [イメージ] "#TRACK 0,1\nl4cde\n;\n"
        return "#TRACK " + ch + "," + (ch + 1) + "\nl4" + inMml + "\n;\n";
      }
      if (compiler == "nsc") { // nsd.lib [イメージ] "#Code "../../bin/nsd.bin" bgm(0){ TR1 ceg }
        return "TR" + (ch + 1) + "\n" + inMml + "\n";
      }
      if (compiler == "note.x") { // [イメージ] "A @0v15cde"
        return getABC(ch) + " " + "@0v15" + inMml + "\n";
      }
      if (compiler == "NRTDRV") { // [イメージ] "A cde"
        return getABC(ch) + " " + "" + inMml + "\n";
      }
      if (compiler == "GBMC") { // [イメージ] "#mode 3"+改行+''A v15cder" [補足] 末尾rは音を止める用
        if (ch < 2) return "'" + getABC(ch) + " v15" + inMml + "r\n";
        if (ch == 2) return "'" + getABC(ch) + " @0v3" + inMml + "r\n";
      }
      if (compiler == "HuSIC") { // [イメージ] "@WT0={～}"+改行+"A W0v31cdg"
        return getABC(ch) + " " + "W0v31" + inMml + "\n";
      }
      if (compiler == "PicoMML") { // [イメージ] "@t1 cde"
        return "@t" + (ch + 1) + " " + inMml + "\n";
      }
      if (compiler == "sakura") { // [イメージ] "トラック1 c"
        return "トラック" + (ch + 1) + " " + inMml + "\n";
      }
      if (compiler == "MGSC") { // [イメージ] "#opll_mode 0"+改行+"9 v15 @0 cde"
        return "" + "9abcdefgh".substr(ch, 1) + " v15@0" + inMml + "\n";
      }
      return "";
    }
    function genTail() {
      if (compiler == "nsc") { // nsd.lib [イメージ] "#Code "../../bin/nsd.bin" bgm(0){ TR1 ceg }
        return "}\n";
      }
      return "";
    }
    function getABC(ch) {
      return String.fromCharCode(65 + ch);
    }
  }
  return {
    getMiddleText: getMiddleText,
    generate: generate
  };
}]);

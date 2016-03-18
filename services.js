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
    angular.forEach(inMmls, function(inMml) {
      outMml += gen1ch(inMml, ch);
      ch++;
    });
    return outMml;
    function gen1ch(inMml, ch) {
      if (compiler == "mckc") { // [イメージ] "A v15cde"
        if (ch < 2) return getABC(ch) + " " + "v15" + inMml + "\n"; // AB : pulse
        if (ch == 2) return getABC(ch) + " " + inMml + "\n"; // C : triangle
      }
      if (compiler == "note.x") { // [イメージ] "A @0v15cde"
        return getABC(ch) + " " + "@0v15" + inMml + "\n";
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

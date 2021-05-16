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

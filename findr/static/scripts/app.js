var app = angular.module('app-findr', ['ngRoute']);
app.fn = {
    isNullOrEmptyStr: function(value) {
        if (value !== undefined || value !== null) {
            return (String(value).trim().length === 0);
        }
        return true;
    }
}

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {controller: 'HomeCtrl', templateUrl: "_home.html"})
        .otherwise({redirectTo: '/'});
}]);

app.controller('HomeCtrl', ['$scope', function($scope) {
    $scope.findr = {entry:'', error:''};
    $scope.isAccountNumber = function(entry) {
        if (!app.fn.isNullOrEmptyStr(entry)) {
            var longPattern = /^[0-9]{2}\/[0-9]{2}\/[0-9]{2}\/[0-9]{4}-01$/;
            if (/^[0-9]{10}-01$/.test(entry) || longPattern.test(entry))
                return true;
        }
        return false;
    };
    $scope.validateEntry = function(entry) {
        if (!app.fn.isNullOrEmptyStr(entry)) {
            if ($scope.isAccountNumber(entry)) 
                return true;
            
            if (/^[0-9]{7,12}$/.test(entry) || /^[a-zA-Z][0-9]{6,11}$/.test(entry))
                return true;
        }
        return false;
    };

    // todo: handle form submit
    $scope.handleSubmit = function() {
        var entry = $scope.findr.entry;
        $scope.findr.error = '';
        if (!app.fn.isNullOrEmptyStr(entry)) {
            if (!$scope.validateEntry($scope.findr.entry)) {
                $scope.findr.error = 'Invalid account or meter number provided.';
            }
        }
    }
}]);
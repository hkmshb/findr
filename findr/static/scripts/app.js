var app = angular.module('app-findr', ['ngRoute', 'ngResource']);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider){
    $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $routeProvider
        .when('/', {controller: 'HomeCtrl', templateUrl: "_home.html"})
        .when('/result', {controller: 'ResultCtrl', templateUrl: "_result.html"})
        .otherwise({redirectTo: '/'});
}]);

app.factory('Account', ['$resource', function($resource){
    return $resource(urlRoot + 'lookup/:key', {key: '@key'});
}]);

app.factory('AccountLoader', ['Account', '$q', function(Account, $q) {
    return function(key) {
        var delay = $q.defer();
        Account.get({key: key}, function(acct) {
            delay.resolve(acct);
        }, function() {
            delay.reject('Unable to fetch account: ' + code);
        });
        return delay.promise;
    };
}]);

app.filter('phoneNumber', function() {
    return function(value) {
        if (value !== undefined || value !== null) {
            if (angular.isString(value) && value !== "NULL") {
                return value;
            }
        }
        return "-";
    };
});

app.service('findrService', ['AccountLoader', function(AccountLoader){
    var cache = {};
    return {
        isNullOrEmptyStr: function(value) {
            if (value !== undefined || value !== null) {
                return (String(value).trim().length === 0);
            }
            return true;
        },
        isAccountNumber: function(value) {
            if (!this.isNullOrEmptyStr(value)) {
                var longPattern = /^[0-9]{2}\/[0-9]{2}\/[0-9]{2}\/[0-9]{4}-01$/;
                if (/^[0-9]{10}-01$/.test(value) || longPattern.test(value))
                    return true;
            }
            return false;
        },
        isValidEntry: function(value) {
            if (!this.isNullOrEmptyStr(value)) {
                if (this.isAccountNumber(value)) 
                    return true;
                
                if (/^[0-9]{7,12}$/.test(value) || /^[a-zA-Z][0-9]{6,11}$/.test(value))
                    return true;
            }
            return false;
        },
        getAccountByNumber: function(acctno) {
            console.log(new AccountLoader(acctno));
        }, 
        getAccountByMeter: function(meterno) {
            console.log(new AccountLoader(meterno));
        },
        getAccount: function(params) {
            throw new Error('Yet to be implemented.')
        },
        getCache: function() { return cache; },
        setCache: function(value) { cache=value; }
    };
}]);

app.controller('HomeCtrl', ['$scope', '$location', 'findrService', 
function($scope, $location, findrService) {
    $scope.findr = {entry:'', error:''};
    $scope.handleSubmit = function() {
        var entry = $scope.findr.entry;
        $scope.findr.error = '';
        if (!findrService.isNullOrEmptyStr(entry)) {
            if (!findrService.isValidEntry(entry)) {
                $scope.findr.error = 'Invalid account or meter number provided.';
            } else {
                findrService.setCache($scope.findr);
                $location.path('/result');
            }
        }
    }
}]);

app.controller('ResultCtrl', ['$scope', '$location', 'findrService', 'AccountLoader',
function($scope, $location, findrService, AccountLoader) {
    $scope.findr = findrService.getCache();
    $scope.displayAccount = function() {
        var entry = $scope.findr.entry;
        if (findrService.isValidEntry(entry)) {
            var plain = entry.replace(/\//g, '');
            AccountLoader(plain).then(function(account){
                $scope.account = account;
            }, function(reason) {
                $scope.findr.error = reason;
            });
        }
    }
    $scope.handleSubmit = function() { 
        var entry = $scope.findr.entry;
        $scope.findr.error = '';
        if (!findrService.isNullOrEmptyStr(entry)) {
            if (!findrService.isValidEntry(entry)) {
                $scope.findr.error = 'Invalid account or meter number provided.';
                $scope.account = {};
            } else {
                findrService.setCache($scope.findr);
                $scope.displayAccount()
            }
        }
    }
    $scope.displayAccount();
}]);

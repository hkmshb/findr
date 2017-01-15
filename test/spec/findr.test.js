'use strict';

describe('Controllers', function() {
    var $scope, ctrl;
    
    // indicate module
    beforeEach(module('app-findr'));

    // HomeCtrl unit-tests
    describe('HomeCtrl', function() {
        var $scope, ctrl;
        beforeEach(inject(function($controller, $rootScope) {
            $scope = $rootScope.$new();
            ctrl = $controller('HomeCtrl', {
                $scope: $scope
            });
        }));

        // isAccountNumber Tests
        it('isAccountNumber: should fail for empty value', function(){
            var result = $scope.isAccountNumber('');
            expect(result).toEqual(false);
        });
        it('isAccountNumber: should fail for account no with invalid format', function() {
            var result = $scope.isAccountNumber('32/33/21/000-01');
            expect(result).toEqual(false);
        });

        it('isAccountNumber: should fail for account no with invalid format_2', function() {
            var result = $scope.isAccountNumber('323/3/21/0001-01');
            expect(result).toEqual(false);
        });

        it('isAccountNumber: should fail for account no with invalid format_3', function() {
            var result = $scope.isAccountNumber('32/33/21/0001-02');
            expect(result).toEqual(false);
        });

        it('isAccountNumber: should pass for account no with valid slashed format', function() {
            var result = $scope.isAccountNumber('32/33/21/0001-01');
            expect(result).toEqual(true);
        });

        it('isAccountNumber: should pass for account no without slashes', function() {
            var result = $scope.isAccountNumber('3233210001-01');
            expect(result).toEqual(true);
        });

        // other Tests
        it('validateEntry: should fail for empty value', function() {
            var result = $scope.validateEntry('');
            expect(result).toEqual(false);
        });

        it('validateEntry: should fail for all alphabet value', function() {
            var result = $scope.validateEntry('account');
            expect(result).toEqual(false);
        });

        it('validateEntry: should fail for values considered meter but has slash', function() {
            var result = $scope.validateEntry('323321/0001');
            expect(result).toEqual(false);
        });

        it('validateEntry: should fail for values considered meter but has hypen', function() {
            var result = $scope.validateEntry('323321-0001');
            expect(result).toEqual(false);
        });

        it('validateEntry: should fail for values considered meter but has short length', function() {
            var result = $scope.validateEntry('323321');
            expect(result).toEqual(false);
        });

        it('validateEntry: should pass for valid account no value', function() {
            var result = $scope.validateEntry('3233210011-01');
            expect(result).toEqual(true);
        });

        it('validateEntry: should pass for non-acctno, non-all-alpha 8-digit suppossed meter no value', function() {
            var result = $scope.validateEntry('32332199');
            expect(result).toEqual(true);
        });

        it('validateEntry: should pass for non-acctno, non-all-alpha 8-alphanum suppossed meter no value', function() {
            var result = $scope.validateEntry('b9332199');
            expect(result).toEqual(true);
        });

        // handle submit
        it('handleSubmit: should ignore processing blank entries', function() {
            $scope.findr.entry = '   ';
            $scope.handleSubmit();
            expect($scope.findr.error).toEqual('');
        });

        it('handleSubmit: should set message for invalid entry', function() {
            $scope.findr.entry = '32/298273'
            $scope.handleSubmit();
            expect($scope.findr.error).toEqual('Invalid account or meter number provided.')
        });
    });
});
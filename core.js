var userModule = angular.module('userModule', []);

userModule.controller('mainController', function($scope, $http) {
    $scope.restData = {};

    //This is where you're calling the get 
        $http.get('http://localhost:1234/restaurants')
            .success(function(data) {
                $scope.restaurants = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    

    //This is where you're calling the post 
    $scope.addRest = function() {
        $http.post('http://localhost:1234/restaurants', angular.toJson($scope.restData)) 
            .success(function(data) {
                $scope.restData = {}; //clear the user data after the response 
                $scope.restaurants = $scope.restaurants.concat([data]); //add the user data to our scope variable 
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

});
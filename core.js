var restModule = angular.module('restModule', []);

restModule.controller('mainController', function($scope, $http) {
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
                $scope.restaurants = $scope.restaurants.concat([data]); //add the data to our scope variable 
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


    $scope.deleteRest = function(id){ 
        console.log(id);
        $http.delete('http://localhost:1234/restaurants/' + id)
            .success(function(data){
                console.log(data);

            })
            .error(function(data){
                console.log('Error: ' + data);
            })
    };

    $scope.editRest = function(id){
        console.log(id);
        $http.get('http://localhost:1234/restaurants/' + id)
            .success(function(data){
                $scope.restData = data;
                console.log(data);
            })
            .error(function(data){
                console.log('Error: ' + data);
            });
    };

    $scope.updateRest = function(){
        console.log($scope.restData._id);
        $http.put('http://localhost:1234/restaurants/' + $scope.restData._id, angular.toJson($scope.restData))
            .success(function(data){
                console.log(data);
            })
            .error(function(data){
                console.log('Error: ' + data);
            })
    };

    $scope.deselect = function() {
        $scope.restData = {};
    }

});
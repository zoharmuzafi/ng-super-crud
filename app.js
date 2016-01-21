var app = angular.module('bookApp', ['ngRoute', 'ngResource']);

app.factory("Book", ['$resource', function($resource){
	return $resource("https://super-crud.herokuapp.com/books/:id", {id:'@_id'}, {
		query: {
    	isArray: true,
    	transformResponse: function(data) { return angular.fromJson(data).books; 
    	}
    },
    update: { 
    	method: 'PUT'
    	}
	});
}]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'templates/index.html',
		controller: 'bookIndexCtrl'
	})
	.when('/books/:id', {
		templateUrl: 'templates/show.html',
		controller: 'bookShowCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});

	$locationProvider
  .html5Mode({
    enabled: true,
    requireBase: false
  });
}]);

app.controller('bookIndexCtrl', ['$scope', '$routeParams', 'Book', function($scope, $routeParams, Book){
	$scope.test = "test book index ctrl";
	$scope.books = Book.query();
	$scope.addBook = function(){
		Book.save($scope.book); 
		$scope.books.push($scope.book);
		$scope.book={};
	};
}]);

app.controller('bookShowCtrl', ['$scope', '$routeParams', '$location', 'Book', function($scope, $routeParams, $location, Book){
	$scope.test = "test book show ctrl";
	var bookId = $routeParams.id;
  $scope.book = Book.get({id: bookId});

  $scope.deleteBook = function(){
		Book.delete({id: bookId});
		$location.path('/');
	};

  $scope.editBook = function(){
		console.log(bookId);
		Book.update({id: bookId}, $scope.editbook, function(data){
			$location.path('/');
		});
	};

}]);
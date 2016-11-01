var app = angular.module('BookSwapApp', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl'
			})
			.state('books', {
				url: '/books/{id}',
				templateUrl: '/books.html',
				controller: 'BooksCtrl'
			});
		$urlRouterProvider.otherwise('home');
	}
]);

app.factory('books', [function() {
	var o = {
		books: []
	};
	return o;
}]);

app.controller('MainCtrl', ['$scope', 'books', function($scope, books) {
	$scope.books = books.books;
	$scope.addBook = function() {
		if((!$scope.title || $scope.title === '') ||
			(!$scope.author || $scope.author === '')) {
			return;
		}
		$scope.books.push(
			{
				title: $scope.title,
				author: $scope.author,
				favorites: 0,
				available: true,
				watchlist: false,
				comments: [
					{author: 'Nagi', body: 'Great book!', favorites: 0},
					{author: 'Igan', body: 'Sounds boring as heck my dude', favorites: 0}
				]
			}
		);
		$scope.title = '';
		$scope.author = '';
	};
	$scope.incrFav = function(book) {
		book.favorites += 1;
	}
}]);
app.controller('BooksCtrl', ['$scope', '$stateParams', 'books',
	function($scope, $stateParams, books) {
		$scope.book = books.books[$stateParams.id];
		$scope.addComment = function() {
		if($scope.body === '') { return; }
		$scope.book.comments.push({
			body: $scope.body,
			author: 'user',
			favorites: 0
		});
		$scope.body = '';
	}
}]);
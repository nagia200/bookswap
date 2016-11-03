var app = angular.module('BookSwapApp', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl',
				resolve: {
					bookPromise: ['books', function(books) {
						return books.getAll(); }]
				}
			})
			.state('books', {
				url: '/books/{id}',
				templateUrl: '/books.html',
				controller: 'BooksCtrl',
				resolve: {
					book: ['$stateParams', 'books', function($stateParams, books) {
						return books.get($stateParams.id);
					}]
				}
			})
			.state('login', {
				url: '/login',
				templateUrl: '/login.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'auth', function($state, auth) {
					if(auth.isLoggedIn()) {
						$state.go('home');
					}
				}]
			})
			.state('register', {
				url: '/register',
				templateUrl: '/register.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'auth', function($state, auth) {
					if(auth.isLoggedIn()) {
						$state.go('home');
					}
				}]
			});
		$urlRouterProvider.otherwise('home');
	}
]);

/* Books service */
app.factory('books', ['$http', 'auth', function($http, auth) {
	var o = {
		books: []
	};
	// Load posts
	o.getAll = function() {
		return $http.get('/books').success(function(data) {
			angular.copy(data, o.books);
		});
	};
	// Create new posts
	o.create = function(book) {
		return $http.post('/books', book, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function(data) {
			o.books.push(data);
		});
	};
	// "Favorite-ing" books
	o.favorite = function(book) {
		return $http.put('/books/', + book._id + '/favorite', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function(data) {
			book.favorites += 1;
		});
	};
	// Get single book from server
	o.get = function(id) {
		return $http.get('/books/' + id).then(function(res) {
			return res.data;
		});
	};
	// Create new comment
	o.addComment = function(id, comment) {
		return $http.post('/books/' + id + '/comments', comment, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		});
	};
	// "Favorite-ing" comments
	o.favoriteComment = function(book, comment) {
		return $http.put('/books/' + book._id + '/comments/' + comment._id + '/favorite', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function(data) {
				comment.favorites += 1;
			});
	};
	// Delete book
	o.deleteBook = function(book) {
		return $http.delete('/books/' + book._id, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		});
	};
	return o;
}]);

/* Authentication service */
app.factory('auth', ['$http', '$window', function($http, $window) {
	var auth = {};
	auth.saveToken = function(token) {
		$window.localStorage['bookswap-token'] = token;
	};
	auth.getToken = function() {
		return $window.localStorage['bookswap-token'];
	};
	auth.isLoggedIn = function() {
		var token = auth.getToken();
		if(token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > (Date.now() / 1000);
		}
		else {
			return false;
		}
	};
	auth.currentUser = function() {
		if(auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.username;
		}
	};
	auth.register = function(user){
		return $http.post('/register', user).success(function(data){
	    	auth.saveToken(data.token);
		});
	};
	auth.logIn = function(user) {
		return $http.post('/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};
	auth.logOut = function() {
		$window.localStorage.removeItem('bookswap-token');
	};
	return auth;
}]);

/* Controllers */
app.controller('MainCtrl', ['$scope', 'books', 'auth', function($scope, books, auth) {
	$scope.books = books.books;
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.addBook = function() {
		if((!$scope.title || $scope.title === '') ||
			(!$scope.author || $scope.author === '')) {
			return;
		}
		books.create({
			title: $scope.title,
			author: $scope.author,
			favorites: 0,
			available: true,
			watchlist: false,
			comments: []
		});
		$scope.title = '';
		$scope.author = '';
	};
	$scope.incrFav = function(book) {
		books.favorite(book);
	};
	$scope.deleteBook = function(book) {
		books.deleteBook(book);
	};
}]);
app.controller('BooksCtrl', ['$scope', 'books', 'book', 'auth',
	function($scope, books, book, auth) {
		$scope.book = book;
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.addComment = function() {
			if($scope.body === '') { return; }
			books.addComment(book._id, {
				body: $scope.body,
				author: 'user',
				favorites: 0
			}).success(function(comment) {
				$scope.book.comments.push(comment);
			});
			$scope.body = '';
		};
	$scope.incrFav = function(comment) {
		books.favoriteComment(book, comment);
	};
}]);
app.controller('AuthCtrl', ['$scope', '$state', 'auth', 
	function($scope, $state, auth) {
		$scope.user = {};
		$scope.register = function() {
			auth.register($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function() {
				$state.go('home');
			});
		};
		$scope.logIn = function() {
			auth.logIn($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function() {
				$state.go('home');
			});
		};
}]);
app.controller('NavCtrl', ['$scope', 'auth',
	function($scope, auth) {
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.logOut = auth.logOut;
}]);
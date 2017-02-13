'use strict';

// Food service used for communicating with the food REST endpoints
angular.module('food').factory('FoodAdmin', ['$resource',
	function($resource) {
		return $resource('admin/foods/:foodId', {
			foodId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('FoodItem', ['$resource',
	function($resource) {
		return $resource('admin/foods/:foodId/items/:itemId', {
			foodId: '@categoryId',
			itemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('FoodUser', ['$resource',
	function($resource) {
		return $resource('foods/', {});
	}
]).factory('Food', ['$resource',
	function($resource) {
		return $resource('admin/foods/:foodId', {
			foodId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

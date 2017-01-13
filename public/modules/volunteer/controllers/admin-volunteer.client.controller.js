(function() {
	'use strict';

	angular.module('volunteer').controller('VolunteerAdminController', VolunteerAdminController);

	/* @ngInject */
	function VolunteerAdminController($window, $stateParams, $state, Authentication, VolunteerAdmin, VolunteerUser) {
		var self = this;

		// This provides Authentication context
		self.authentication = Authentication;

		// Verify if user has admin role, redirect to home otherwise
		if (self.authentication.user.roles.indexOf('admin') < 0) $state.go('root');

		// Add plugins into datatable
		self.dtOptions = {
			dom: 'Tlfrtip',
			tableTools: {
				sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
				aButtons: ['copy', 'xls']
			}
		};

		// Find a list of volunteers
		self.find = function() {
			self.volunteer = VolunteerAdmin.query();
		};

		// Find existing volunteer
		self.findOne = function() {
			self.volunteer = VolunteerAdmin.get({
				volunteerId: $stateParams.volunteerId
			}, function(volunteer) {
				self.volunteer.dateOfBirth = new Date(volunteer.dateOfBirth);
			});
		};

		// Create a new volunteer
		self.createNewVolunteer = function() {
			console.log('new volunteer')
			var volunteer = new VolunteerUser({
				lastName: "test",
				firstName: "testing",
				email: 'test@test.com',
				manualAdd: true
			});

			volunteer.$save(function(u, putResponseHeaders) {
			console.log('returned data',u._id);
			alert('pause')
			console.log(putResponseHeaders);
			}, function(errorResponse) {
				self.errorItem = errorResponse.data.message;
			});
		};

		// Update existing volunteer
		self.update = function(updateType) {
			var volunteer = self.volunteer;

			if (updateType === 'Driver') {
				volunteer.driver = true;
			} else if (updateType === 'Inactive') {
				volunteer.status = updateType;
				volunteer.driver = false;
			} else {
				volunteer.status = updateType;
			}

			volunteer.$update(function() {
				// Redirect after save
				$state.go('root.listVolunteers');
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Delete volunteer
		self.delete = function(volunteer) {
			if ($window.confirm('Are you sure?')) {
				volunteer.$delete(function() {
					$state.go('root.listVolunteers', null, { reload: true });
				}, function(errorResponse) {
					self.error = errorResponse.data.message;
				});
			}
		};
	}
})();

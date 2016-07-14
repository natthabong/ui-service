'use strict';

angular.module('scfApp').factory('NewduedateGroupService', ['$http', '$q', 'blockUI', NewduedateGroupServices]);

function NewduedateGroupServices($http, $q, blockUI){
	return {
		getDocumentsGroupbyDuedate: getDocumentsGroupbyDuedate,
	}

	function getDocumentsGroupbyDuedate(listDocumentModel){
		var deffered = $q.defer();
		var searchBlock = blockUI.instances.get('search-block');
		searchBlock.start();
		$http({
			url: 'js/app/dashboard/documentGroupbyDuedate_maker.json',
			method: 'GET'
		}).then(function(response){
			searchBlock.stop();
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	}
}
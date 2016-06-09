'use strict';

angular.module('scfApp').factory('ListTransactionService', ['$http', '$q', ListTransactionServices]);

function ListTransactionServices($http, $q){
	return {
		getSponsors: getSponsors,
		getTransactionStatusGroups: getTransactionStatusGroups,
		getTransactionDocument: getTransactionDocument,
		buildCSVFile: buildCSVFile,
		getCSVFile: getCSVFile
	}
	
	function getSponsors(){
		var deffered = $q.defer();
		$http.post('api/list-transaction/sponsors/get').then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	};
	
	function getTransactionStatusGroups(){
		var deffered = $q.defer();
		$http.post('api/list-transaction/transaction-status-group/get').then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;		
	};

	function getTransactionDocument(listTransactionModel){
		var deffered = $q.defer();
		$http({
			url: 'api/list-transaction/search',
			method: 'POST',
			data: listTransactionModel
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	}
	
	function buildCSVFile(listTransactionModel){
//		var deffered = $q.defer();
//		$http({
//			url: 'api/list-transaction/buildCSVFile',
//			method: 'POST',
//			data: listTransactionModel
//		}).then(function(response){
//			deffered.resolve(response);
//		}).catch(function(response){
//			deffered.reject(response);
//		});	
//		return deffered;
		var filename = '';
        $http({
			url: 'api/list-transaction/buildCSVFile',
			method: 'POST',
			data: listTransactionModel
		}).then(function(response){
			 console.log(response);
        }).catch(function(response){
            console.log('response');
        });
   

	}
	
	function getCSVFile(fileName){
//		var deffered = $q.defer();
//		$http({
//			url: 'api/list-transaction/getCSVFile',
//			method: 'GET',
//			data: fileName
//		}).then(function(response){
//			deffered.resolve(response);
//		}).catch(function(response){
//			deffered.reject(response);
//		});	
//		return deffered;
		
		if (!window.ActiveXObject) {	
			console.log('name : '+filename);
			var save = document.createElement('a');
			save.href = 'api/list-transaction/getCSVFile?csvFileName='+filename;
			save.target = '_blank';
			save.download = 'data.csv' || fileURL;
			var evt = document.createEvent('MouseEvents');
			evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
			save.dispatchEvent(evt);
			(window.URL || window.webkitURL).revokeObjectURL(save.href);
		} else if ( !! window.ActiveXObject && document.execCommand)     {
			// for IE
			var _window = window.open(fileURL, "_blank");
			_window.document.close();
			_window.document.execCommand('SaveAs', true, fileName || fileURL);
			_window.close();
		}
	}
}
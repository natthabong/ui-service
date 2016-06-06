describe('scf-common-service client paging', function(){
    beforeEach(module('scfApp'));
    var SCFCommonService;
    
    beforeEach(inject(['SCFCommonService', function(service){
        SCFCommonService = service;
    }]));
    
    it('Data size: 20, records perpage: 10, current page: 0 should return data list: 10, totalPages: 2, number: 0, size:10', function(){
        
        SCFCommonService.clientPagination(documentList, recordPerpage, currentPage);
    });
});
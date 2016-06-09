describe('scf-common-service client paging', function(){
    beforeEach(module('scfApp'));
    var SCFCommonService;
    
    beforeEach(inject(['SCFCommonService', function(service){
        SCFCommonService = service;
    }]));
    
    var datalists = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                     '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                     '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', 
                     '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
                     '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', 
                     '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'];
    it('Have dataList: 60 and set records perpage: 10  current page: 0 should return data list: 10, totalPages: 6, number: 0, size:10', function(){
        var recordPerpage = 10;
        var currentPage = 0;
        var dataResult = SCFCommonService.clientPagination(datalists, recordPerpage, currentPage);
        
        expect(dataResult.content.length).toEqual(10);
        expect(dataResult.content).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
        expect(dataResult.totalPages).toEqual(6);
        expect(dataResult.size).toEqual(10);
        expect(dataResult.number).toEqual(0);
        expect(dataResult.totalElements).toEqual(60);
    });
    
    it('Have dataList: 60 and set records perpage: 10  current page: 1 should return data list: 10, totalPages: 6, number: 1, size:10', function(){
        var recordPerpage = 10;
        var currentPage = 1;
        var dataResult = SCFCommonService.clientPagination(datalists, recordPerpage, currentPage);
        
        expect(dataResult.content.length).toEqual(10);
        expect(dataResult.content).toEqual(['11', '12', '13', '14', '15', '16', '17', '18', '19', '20']);
        expect(dataResult.totalPages).toEqual(6);
        expect(dataResult.size).toEqual(10);
        expect(dataResult.number).toEqual(1);
        expect(dataResult.totalElements).toEqual(60);
    });
    
    it('Have dataList: 60 and set records perpage: 10  current page: 2 should return data list: 10, totalPages: 6, number: 2, size:10', function(){
        var recordPerpage = 10;
        var currentPage = 2;
        var dataResult = SCFCommonService.clientPagination(datalists, recordPerpage, currentPage);
        
        expect(dataResult.content.length).toEqual(10);
        expect(dataResult.content).toEqual(['21', '22', '23', '24', '25', '26', '27', '28', '29', '30']);
        expect(dataResult.totalPages).toEqual(6);
        expect(dataResult.size).toEqual(10);
        expect(dataResult.number).toEqual(2);
        expect(dataResult.totalElements).toEqual(60);
    });
    
    it('Have dataList: 60 and set records perpage: 20  current page: 0 should return data list: 20, totalPages: 3, number: 0, size:20', function(){
        var recordPerpage = 20;
        var currentPage = 0;
        var dataResult = SCFCommonService.clientPagination(datalists, recordPerpage, currentPage);
        
        expect(dataResult.content.length).toEqual(20);
        expect(dataResult.content).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']);
        expect(dataResult.totalPages).toEqual(3);
        expect(dataResult.size).toEqual(20);
        expect(dataResult.number).toEqual(0);
        expect(dataResult.totalElements).toEqual(60);
    });
    
    it('Have dataList: 9 and set records perpage: 10  current page: 0 should return data list: 9, totalPages: 1, number: 0, size:9', function(){
        
        var datas = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var recordPerpage = 10;
        var currentPage = 0;
        var dataResult = SCFCommonService.clientPagination(datas, recordPerpage, currentPage);
        
        expect(dataResult.content.length).toEqual(9);
        expect(dataResult.content).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
        expect(dataResult.totalPages).toEqual(1);
        expect(dataResult.size).toEqual(10);
        expect(dataResult.number).toEqual(0);
        expect(dataResult.totalElements).toEqual(9);
    });
    
    it('Have dataList: 11 and set records perpage: 10  current page: 0 should return data list: 10, totalPages: 2, number: 0, size:10', function(){
        
        var datas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
        var recordPerpage = 10;
        var currentPage = 0;
        var dataResult = SCFCommonService.clientPagination(datas, recordPerpage, currentPage);
        
        expect(dataResult.content.length).toEqual(10);
        expect(dataResult.content).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
        expect(dataResult.totalPages).toEqual(2);
        expect(dataResult.size).toEqual(10);
        expect(dataResult.number).toEqual(0);
        expect(dataResult.totalElements).toEqual(11);
    });
    
    it('Have dataList: 16 and set records perpage: 5  current page: 1 should return data list: 5, totalPages: 4, number: 1, size:5', function(){
        
        var datas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
        var recordPerpage = 5;
        var currentPage = 1;
        var dataResult = SCFCommonService.clientPagination(datas, recordPerpage, currentPage);
        
        expect(dataResult.content.length).toEqual(5);
        expect(dataResult.content).toEqual(['6', '7', '8', '9', '10']);
        expect(dataResult.totalPages).toEqual(4);
        expect(dataResult.size).toEqual(5);
        expect(dataResult.number).toEqual(1);
        expect(dataResult.totalElements).toEqual(16);
    });
    
    it('Have dataList: 16 and set records perpage: 5  current page: 3 should return data list: 1, totalPages: 4, number: 3, size:5', function(){
        
        var datas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
        var recordPerpage = 5;
        var currentPage = 3;
        var dataResult = SCFCommonService.clientPagination(datas, recordPerpage, currentPage);
        
        expect(dataResult.content.length).toEqual(1);
        expect(dataResult.content).toEqual(['16']);
        expect(dataResult.totalPages).toEqual(4);
        expect(dataResult.size).toEqual(5);
        expect(dataResult.number).toEqual(3);
        expect(dataResult.totalElements).toEqual(16);
    });
});
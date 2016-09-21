describe('scf-common-service client paging', function(){
	beforeEach(module('scfApp'));
    var SCFCommonService;
    
    beforeEach(inject(['SCFCommonService', function(service){
        SCFCommonService = service;
    }]));
	
	it('Have amount 1,000 should return 1.0k', function(){
        var amount = 1000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('1.0k');
    });
	
	it('Have amount 900 should return 900', function(){
        var amount = 900;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('900');
    });
	
	it('Have amount 800 should return 800', function(){
        var amount = 800;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('800');
    });
	
	it('Have amount 1,100 is string should should convert string to number and return 1.1k', function(){
        var amount = '1100';
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('1.1k');
    });
	
	it('Have amount 10,000 is string should should convert string to number and return 10k', function(){
        var amount = 10000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('10.0k');
    });
	
	it('Have amount 10,100 is string should should convert string to number and return 10.1k', function(){
        var amount = 10100;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('10.1k');
    });
	
	it('Have amount 29,100 is string should should convert string to number and return 29.1k', function(){
        var amount = 29100;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('29.1k');
    });
	
	it('Have amount 100,000 is string should should convert string to number and return 100k', function(){
        var amount = 100000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('100k');
    });
	
	it('Have amount 1,000,000 is string should should convert string to number and return 1.0M', function(){
        var amount = 1000000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('1.0M');
    });
	
	it('Have amount 1,100,000 is string should should convert string to number and return 1.1M', function(){
        var amount = 1100000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('1.1M');
    });
	
	it('Have amount 10,100,000 is string should should convert string to number and return 10.1M', function(){
        var amount = 10100000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('10.1M');
    });
	
	it('Have amount 28,991,029,248 is string should should convert string to number and return 29.0G', function(){
        var amount = 28991029248;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('29.0G');
    });
	
	it('Have amount 28,991,029,248 is string should should convert string to number and return 29.0G', function(){
        var amount = 28991029248;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('29.0G');
    });
	
	it('Have amount 1,100,000 is string should should convert string to number and return -1.1M', function(){
        var amount = -1100000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('-1.1M');
    });
	
	it('Have amount 1,000,000,000,000 is string should should convert string to number and return 1.0T', function(){
        var amount = 1000000000000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('1.0T');
    });
	
	it('Have amount 100,600,000 is string should should convert string to number and return 101M', function(){
        var amount = 100600000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('101M');
    });
	
	it('Have amount 606,000 is string should should convert string to number and return 606k', function(){
        var amount = 606000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('606k');
    });
});
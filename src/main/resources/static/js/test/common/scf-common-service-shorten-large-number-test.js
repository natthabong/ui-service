describe('scf-common-service client paging', function(){
	beforeEach(module('scfApp'));
    var SCFCommonService;
    
    beforeEach(inject(['SCFCommonService', function(service){
        SCFCommonService = service;
    }]));
	
	it('Have amount 1,000 should return 1k', function(){
        var amount = 1000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('1k').toEqual(dataResult);
    });
	
	it('Have amount 900 should return 900', function(){
        var amount = 900;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('900').toEqual(dataResult);
    });
	
	it('Have amount 800 should return 800', function(){
        var amount = 800;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('800').toEqual(dataResult);
    });
	
	it('Have amount 1,100 is string should should convert string to number and return 1.1k', function(){
        var amount = '1100';
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('1.1k').toEqual(dataResult);
    });
	
	it('Have amount 10,000 is string should should convert string to number and return 10k', function(){
        var amount = 10000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('10k').toEqual(dataResult);
    });
	
	it('Have amount 10,100 is string should should convert string to number and return 10.1k', function(){
        var amount = 10100;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('10.1k').toEqual(dataResult);
    });
	
	it('Have amount 29,100 is string should should convert string to number and return 29.1k', function(){
        var amount = 29100;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('29.1k').toEqual(dataResult);
    });
	
	it('Have amount 100,000 is string should should convert string to number and return 100k', function(){
        var amount = 100000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('100k').toEqual(dataResult);
    });
	
	it('Have amount 1,000,000 is string should should convert string to number and return 1M', function(){
        var amount = 1000000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('1M').toEqual(dataResult);
    });
	
	it('Have amount 1,100,000 is string should should convert string to number and return 1.1M', function(){
        var amount = 1100000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('1.1M').toEqual(dataResult);
    });
	
	it('Have amount 10,100,000 is string should should convert string to number and return 10.1M', function(){
        var amount = 10100000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('10.1M').toEqual(dataResult);
    });
	
	it('Have amount 28,991,029,248 is string should should convert string to number and return 29G', function(){
        var amount = 28991029248;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('29G').toEqual(dataResult);
    });
	
	it('Have amount 28,491,029,248 is string should should convert string to number and return 28.5G', function(){
        var amount = 28491029248;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('28.5G').toEqual(dataResult);
    });
    
    it('Have amount 28,391,029,248 is string should should convert string to number and return 28.4G', function(){
        var amount = 28391029248;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('28.4G').toEqual(dataResult);
    });

	
	it('Have amount 1,000,000,000,000 is string should should convert string to number and return 1T', function(){
        var amount = 1000000000000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('1T');
    });
	
	it('Have amount 100,600,000 is string should should convert string to number and return 101M', function(){
        var amount = 100600000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('101M').toEqual(dataResult);
    });
	
	it('Have amount 606,000 is string should should convert string to number and return 606k', function(){
        var amount = 606000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect(dataResult).toEqual('606k');
    });
    
    it('Have amount 656,800 is string should should convert string to number and return 657k', function(){
        var amount = 656800;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('657k').toEqual(dataResult);
    });
    
    it('Have amount 677,000 is string should should convert string to number and return 677k', function(){
        var amount = 677000;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('677k').toEqual(dataResult);
    });
    
    it('Have amount 77,800 is string should should convert string to number and return 77.8k', function(){
        var amount = 77800;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('77.8k').toEqual(dataResult);
    }); 
    
    it('Have amount 100,800 is string should should convert string to number and return 101k', function(){
        var amount = 100800;
        var dataResult = SCFCommonService.shortenLargeNumber(amount);
        
        expect('101k').toEqual(dataResult);
    });
});
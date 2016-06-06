describe('scf-component splite page render text', function() {
    beforeEach(module('scfApp'));

    /*    var $controller;

        beforeEach(inject(function(_$controller_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $controller = _$controller_;
        }));*/

    var SCFCommonService;

    beforeEach(inject(['SCFCommonService', function(service) {
        SCFCommonService = service;
    }]));

    it('pageSize=10 currentPage=0 totalPage=1 totalRecord=9 should display 1-9 of 9', function() {
        var expectedResult =  SCFCommonService.splitePage(10, 0, 9);		
		expect(expectedResult).toEqual('1 - 9 of 9');
    });
	
	it('pageSize=10 currentPage=0 totalPage=1 totalRecord=10 should display 1-10 of 10', function() {
        var expectedResult =  SCFCommonService.splitePage(10, 0, 10);		
		expect(expectedResult).toEqual('1 - 10 of 10');
    });
	
	it('pageSize=10 currentPage=0 totalPage=2 totalRecord=15 should display 1-10 of 15', function() {
        var expectedResult =  SCFCommonService.splitePage(10, 0, 15);		
		expect(expectedResult).toEqual('1 - 10 of 15');
    });
	
	it('pageSize=10 currentPage=1 totalPage=2 totalRecord=15 should display 11-15 of 15', function() {
        var expectedResult =  SCFCommonService.splitePage(10, 1, 15);		
		expect(expectedResult).toEqual('11 - 15 of 15');
    });
	
	it('pageSize=10 currentPage=0 totalPage=2 totalRecord=20 should display 1-10 of 20', function() {
        var expectedResult =  SCFCommonService.splitePage(10, 0, 20);		
		expect(expectedResult).toEqual('1 - 10 of 20');
    });
	
	it('pageSize=10 currentPage=1 totalPage=2 totalRecord=20 should display 11-20 of 20', function() {
        var expectedResult =  SCFCommonService.splitePage(10, 1, 20);		
		expect(expectedResult).toEqual('11 - 20 of 20');
    });
	
	it('pageSize=10 currentPage=0 totalPage=3 totalRecord=21 should display 1-10 of 21', function() {
        var expectedResult =  SCFCommonService.splitePage(10, 0, 21);		
		expect(expectedResult).toEqual('1 - 10 of 21');
    });
	
	it('pageSize=10 currentPage=1 totalPage=3 totalRecord=21 should display 11-20 of 21', function() {
        var expectedResult =  SCFCommonService.splitePage(10, 1, 21);		
		expect(expectedResult).toEqual('11 - 20 of 21');
    });
	
	it('pageSize=10 currentPage=2 totalPage=3 totalRecord=21 should display 21-21 of 21', function() {
        var expectedResult =  SCFCommonService.splitePage(10, 2, 21);		
		expect(expectedResult).toEqual('21 - 21 of 21');
    });
	
	it('pageSize=20 currentPage=0 totalPage=2 totalRecord=21 should display 1-20 of 21', function() {
        var expectedResult =  SCFCommonService.splitePage(20, 0, 21);		
		expect(expectedResult).toEqual('1 - 20 of 21');
    });
	
	it('pageSize=20 currentPage=1 totalPage=2 totalRecord=21 should display 21-21 of 21', function() {
        var expectedResult =  SCFCommonService.splitePage(20, 1, 21);		
		expect(expectedResult).toEqual('21 - 21 of 21');
    });
	
	it('pageSize=10 currentPage=1 totalPage=2 totalRecord=21 should display 11-20 of 21', function() {
        var expectedResult =  SCFCommonService.splitePage(10, 1, 21);		
		expect(expectedResult).toEqual('11 - 20 of 21');
    });
	
	it('pageSize=50 currentPage=0 totalPage=1 totalRecord=21 should display 1-21 of 21', function() {
        var expectedResult =  SCFCommonService.splitePage(50, 0, 21);		
		expect(expectedResult).toEqual('1 - 21 of 21');
    });
});
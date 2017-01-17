describe('Filter: documentDateRuleType', function() {
	beforeEach(module('scfApp'));
	var	$filter;

	beforeEach(inject(function(_$filter_) {
		$filter = _$filter_;
	}));
	
	it('config documentDateStartPeriod and documentDateEndPeriod is null should return every date', function(){
		let creditterm = {'creditTermCode': '', 'documentDateType': 'EVERY_DAY',
				'documentDateStartPeriod': null, 'documentDateEndPeriod': null, 'startDateType': '',
				'startDayOfWeek': '', 'startDateOfMonth': '', 'startMonthType': '',
				'startNumberOfNextMonth': '', 'term': '', 'termType': '',
				'periodType': '',}
		
		let result = $filter('documentDateRuleType')(creditterm);
		
		expect(result).toEqual('every day');
	});
	
	it('config documentDateStartPeriod = 1 and documentDateEndPeriod = 15 should return 1st - 15th', function(){
		let creditterm = {'creditTermCode': '', 'documentDateType': 'RANGE',
				'documentDateStartPeriod': 1, 'documentDateEndPeriod': 15, 'startDateType': '',
				'startDayOfWeek': '', 'startDateOfMonth': '', 'startMonthType': '',
				'startNumberOfNextMonth': '', 'term': '', 'termType': '',
				'periodType': '',}
		
		let result = $filter('documentDateRuleType')(creditterm);
		
		expect('1st - 15th').toEqual(result);
	});
	
	it('config documentDateStartPeriod = 2 and documentDateEndPeriod = 15 should return 2nd - 15th', function(){
		let creditterm = {'creditTermCode': '', 'documentDateType': 'RANGE',
				'documentDateStartPeriod': 2, 'documentDateEndPeriod': 15, 'startDateType': '',
				'startDayOfWeek': '', 'startDateOfMonth': '', 'startMonthType': '',
				'startNumberOfNextMonth': '', 'term': '', 'termType': '',
				'periodType': '',}
		
		let result = $filter('documentDateRuleType')(creditterm);
		
		expect('2nd - 15th').toEqual(result);
	});
	
	it('config documentDateStartPeriod = 16 and documentDateEndPeriod = 99 should return 16th - end of month', function(){
		let creditterm = {'creditTermCode': '', 'documentDateType': 'RANGE',
				'documentDateStartPeriod': 16, 'documentDateEndPeriod': 99, 'startDateType': '',
				'startDayOfWeek': '', 'startDateOfMonth': '', 'startMonthType': '',
				'startNumberOfNextMonth': '', 'term': '', 'termType': '',
				'periodType': '',}
		
		let result = $filter('documentDateRuleType')(creditterm);
		
		expect('16th - end of month').toEqual(result);
	});
});
describe('Filter: creditterDocumentDate', function() {
	beforeEach(module('scfApp'));
	var	$filter;

	beforeEach(inject(function(_$filter_) {
		$filter = _$filter_;
	}));
	
	it('config documentDateStartPeriod and documentDateEndPeriod is null should return every date', function(){
		const creditterm = {'creditTermCode': '', 'documentDateType': 'EVERY_DAY',
				'documentDateStartPeriod': null, 'documentDateEndPeriod': null, 'startDateType': '',
				'startDayOfWeek': '', 'startDateOfMonth': '', 'startMonthType': '',
				'startNumberOfNextMonth': '', 'term': '', 'termType': '',
				'periodType': '',}
		
		result = $filter('credittermDocumentDate')(creditterm);
		
		expect(result).toEqual('every day');
	});
	
	it('config documentDateStartPeriod = 1 and documentDateEndPeriod = 15 is null should return every date', function(){
		const creditterm = {'creditTermCode': '', 'documentDateType': '',
				'documentDateStartPeriod': 1, 'documentDateEndPeriod': 15, 'startDateType': '',
				'startDayOfWeek': '', 'startDateOfMonth': '', 'startMonthType': '',
				'startNumberOfNextMonth': '', 'term': '', 'termType': '',
				'periodType': '',}
		
		result = $filter('credittermDocumentDate')(creditterm);
		
		expect(result).toEqual('1st - 15th');
	});
});
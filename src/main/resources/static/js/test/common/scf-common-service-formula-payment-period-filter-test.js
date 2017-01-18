describe('Filter: paymentPeriod', function() {
	beforeEach(module('scfApp'));
	var	$filter;
	
	beforeEach(inject(function(_$filter_) {
		$filter = _$filter_;
	}));
	
	it('config paymetnPeriod is  paymentPeriodType = DATE_OF_MONTH, dateOfMonth = 5 should return The 5th day of month', function(){
		let paymentPeriod = {'paymentPeriodType': 'DATE_OF_MONTH', 'dateOfMonth': 5, 'occurrenceWeek': null,
				'dayOfWeek': null}
		
		let result = $filter('paymentPeriod')(paymentPeriod);
		
		expect('The 5th day of month').toEqual(result);
	});
	
	it('config paymetnPeriod is  paymentPeriodType = DATE_OF_MONTH, dateOfMonth = 1 should return The 1st day of month', function(){
		let paymentPeriod = {'paymentPeriodType': 'DATE_OF_MONTH', 'dateOfMonth': 1, 'occurrenceWeek': null,
				'dayOfWeek': null}
		
		let result = $filter('paymentPeriod')(paymentPeriod);
		
		expect('The 1st day of month').toEqual(result);
	});
	
	it('config paymetnPeriod is  paymentPeriodType = DATE_OF_MONTH, dateOfMonth = 99 should return end of month', function(){
		let paymentPeriod = {'paymentPeriodType': 'DATE_OF_MONTH', 'dateOfMonth': 99, 'occurrenceWeek': null,
				'dayOfWeek': null}
		
		let result = $filter('paymentPeriod')(paymentPeriod);
		
		expect('end of month').toEqual(result);
	});
	
	it('config paymetnPeriod is  paymentPeriodType = DATE_OF_MONTH, dateOfMonth = 2 should return The 2nd day of month', function(){
		let paymentPeriod = {'paymentPeriodType': 'DATE_OF_MONTH', 'dateOfMonth': 2, 'occurrenceWeek': null,
				'dayOfWeek': null}
		
		let result = $filter('paymentPeriod')(paymentPeriod);
		
		expect('The 2nd day of month').toEqual(result);
	});
	
	it('config paymetnPeriod is  paymentPeriodType = DAY_OF_WEEK, dayOfWeek = MONDAY, occurrenceWeek = EVERY should return every monday', function(){
		let paymentPeriod = {'paymentPeriodType': 'DAY_OF_WEEK', 'dateOfMonth': null, 'occurrenceWeek': 'EVERY',
				'dayOfWeek': 'MONDAY'}
		
		let result = $filter('paymentPeriod')(paymentPeriod);
		
		expect('every monday of month').toEqual(result);
	});
	
	it('config paymetnPeriod is  paymentPeriodType = DAY_OF_WEEK, dayOfWeek = WEDNESDAY occurrenceWeek = EVERY should return every wednesday', function(){
		let paymentPeriod = {'paymentPeriodType': 'DAY_OF_WEEK', 'dateOfMonth': null, 'occurrenceWeek': 'EVERY',
				'dayOfWeek': 'WEDNESDAY'}
		
		let result = $filter('paymentPeriod')(paymentPeriod);
		
		expect('every wednesday of month').toEqual(result);
	});
	
	it('config paymetnPeriod is  paymentPeriodType = DAY_OF_WEEK, dayOfWeek = TUESDAY occurrenceWeek = LAST should return last tuesday', function(){
		let paymentPeriod = {'paymentPeriodType': 'DAY_OF_WEEK', 'dateOfMonth': null, 'occurrenceWeek': 'LAST',
				'dayOfWeek': 'TUESDAY'}
		
		let result = $filter('paymentPeriod')(paymentPeriod);
		
		expect('last tuesday of month').toEqual(result);
	});
	
	it('config paymetnPeriod is  paymentPeriodType = DAY_OF_WEEK, dayOfWeek = FRIDAY occurrenceWeek = SECOND should return second friday', function(){
		let paymentPeriod = {'paymentPeriodType': 'DAY_OF_WEEK', 'dateOfMonth': null, 'occurrenceWeek': 'SECOND',
				'dayOfWeek': 'FRIDAY'}
		
		let result = $filter('paymentPeriod')(paymentPeriod);
		
		expect('every second friday of month').toEqual(result);
	});
	
	it('config paymetnPeriod is  paymentPeriodType = EVERY_DAY, dayOfWeek = FRIDAY occurrenceWeek = SECOND should return every days', function(){
		let paymentPeriod = {'paymentPeriodType': 'EVERY_DAY', 'dateOfMonth': null, 'occurrenceWeek': null,
				'dayOfWeek': null}
		
		let result = $filter('paymentPeriod')(paymentPeriod);
		
		expect('every days').toEqual(result);
	});

	it('config paymetnPeriod is array 2 size should return every days, second friday', function(){
		let paymentPeriod = [{'paymentPeriodType': 'EVERY_DAY', 'dateOfMonth': null, 'occurrenceWeek': null,
				'dayOfWeek': null}, {'paymentPeriodType': 'DAY_OF_WEEK', 'dateOfMonth': null, 'occurrenceWeek': 'SECOND',
					'dayOfWeek': 'FRIDAY'}];
		
		let result = $filter('paymentPeriod')(paymentPeriod);
		
		expect('every days, every second friday of month').toEqual(result);
	});
});
describe('Filter: paymentPeriod', function() {
	beforeEach(module('scfApp'));
	var	$filter;
	
	beforeEach(inject(function(_$filter_) {
		$filter = _$filter_;
	}));
	

	it('config periodType = EVERY_PERIOD, paymentPeroid = null should return Every period', function(){

		let creditTerm = {'periodType':'EVERY_PERIOD', 'paymentPeriods':[]};
		let result = $filter('paymentPeriod')(creditTerm);
		expect('Every period').toEqual(result);
	});
	
	it('config paymetnPeriod is array 2 size should return every day, second friday', function(){
		let paymentPeriod = [{'paymentPeriodType': 'EVERY_DAY', 'dateOfMonth': null, 'occurrenceWeek': null,
			'dayOfWeek': null}, {'paymentPeriodType': 'DAY_OF_WEEK', 'dateOfMonth': null, 'occurrenceWeek': 'SECOND',
				'dayOfWeek': 'FRIDAY'}];		
		let creditTerm = {'periodType':'SPECIFIC', 'paymentPeriods':paymentPeriod};
		
		let result = $filter('paymentPeriod')(creditTerm);
		
		expect('every day, every second friday of month').toEqual(result);
	});	
	
	it('config periodType = EVERY_PERIOD, paymentPeroid = [] should return Every period', function(){
		
		let creditTerm = {'periodType':'EVERY_PERIOD', 'paymentPeriods':[]};
		
		let result = $filter('paymentPeriod')(creditTerm);
		
		expect('Every period').toEqual(result);
	});
});
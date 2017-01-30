describe('Filter: paymentDateFormula', function() {
	beforeEach(module('scfApp'));
	var	$filter;
	
	beforeEach(inject(function(_$filter_) {
		$filter = _$filter_;
	}));
	
	it('config creditterm is  startDateOfMonth=1, startDayOfWeek=null, startMonthType=CURRENT, term=60, termType=DAY  should return 1st of this month of Document date + 60 days', function(){
		let creditterm = { 'startDateOfMonth': 1, 'startDayOfWeek': null, 
				'startMonthType': 'CURRENT', 'term': 60, 'termType': 'DAY'}
		
		let result = $filter('paymentDateFormula')(creditterm);
		
		expect('1st of this month of Document date + 60 days').toEqual(result);
	});
	
	it('config creditterm is  startDateOfMonth=2, startDayOfWeek=null, startMonthType=CURRENT, term=45, termType=DAY  should return 2nd of this month of Document date + 45 days', function(){
		let creditterm = { 'startDateOfMonth': 2, 'startDayOfWeek': null, 
				'startMonthType': 'CURRENT', 'term': 45, 'termType': 'DAY'}
		
		let result = $filter('paymentDateFormula')(creditterm);
		
		expect('2nd of this month of Document date + 45 days').toEqual(result);
	});
	
	it('config creditterm is  startDateOfMonth=2, startDayOfWeek=null, startMonthType=CURRENT, term=45, termType=DAY  should return 2nd of this month of Document date + 45 days', function(){
		let creditterm = { 'startDateOfMonth': 2, 'startDayOfWeek': null, 
				'startMonthType': 'CURRENT', 'term': 45, 'termType': 'DAY'}
		
		let result = $filter('paymentDateFormula')(creditterm);
		
		expect('2nd of this month of Document date + 45 days').toEqual(result);
	});
	
	it('config creditterm is  startDateOfMonth=15, startDayOfWeek=MONDAY, startMonthType=NEXT, term=45, termType=DAY  should return next monday after 15th of Document date + 45 days', function(){
		let creditterm = { 'startDateOfMonth': 15, 'startDayOfWeek': 'MONDAY', 
				'startMonthType': 'NEXT', 'term': 45, 'termType': 'DAY'}
		
		let result = $filter('paymentDateFormula')(creditterm);
		
		expect('next monday after 15th of this month of Document date + 45 days').toEqual(result);
	});
	
	it('config creditterm is  startDateOfMonth=1, startDayOfWeek=TUESDAY, startMonthType=NEXT, term=8, termType=WEEK  should return next tuesday after 1st of Document date + 8 weeks', function(){
		let creditterm = { 'startDateOfMonth': 1, 'startDayOfWeek': 'TUESDAY', 
				'startMonthType': 'NEXT', 'term': 8, 'termType': 'WEEK'}
		
		let result = $filter('paymentDateFormula')(creditterm);
		
		expect('next tuesday after 1st of this month of Document date + 8 weeks').toEqual(result);
	});
	
	it('config creditterm is  startDateOfMonth=99, startDayOfWeek=FRIDAY, startMonthType=CURRENT, term=2, termType=WEEK  should return next tuesday after 1st of Document date + 8 weeks', function(){
		let creditterm = { 'startDateOfMonth': 99, 'startDayOfWeek': 'FRIDAY', 
				'startMonthType': 'CURRENT', 'term': 2, 'termType': 'WEEK'}
		
		let result = $filter('paymentDateFormula')(creditterm);
		
		expect('friday end of this month of Document date + 2 weeks').toEqual(result);
	});
	
	it('config creditterm is  startDateOfMonth=1, startDayOfWeek=null, startMonthType=NEXT, term=60, termType=DAY  should return 1st of next month of Document date + 60 days', function(){
		let creditterm = { 'startDateOfMonth': 1, 'startDayOfWeek': null, 
				'startMonthType': 'NEXT', 'term': 60, 'termType': 'DAY'}
		
		let result = $filter('paymentDateFormula')(creditterm);
		
		expect('1st of next month of Document date + 60 days').toEqual(result);
	});
	
	it('config creditterm is  startDateOfMonth=15, startDayOfWeek=MONDAY, startMonthType=NEXT, term=60, termType=DAY  should return 1st of next month of Document date + 60 days', function(){
		let creditterm = { 'startDateOfMonth': 15, 'startDayOfWeek': 'MONDAY', 
				'startMonthType': 'NEXT', 'term': 8, 'termType': 'WEEK', 'startDateType': 'AFTER_DOCUMENT_DATE'}
		
		let result = $filter('paymentDateFormula')(creditterm);
		
		expect('next monday after 15th of this month of Document date + 8 weeks').toEqual(result);
	});
	
});
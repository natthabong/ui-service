package gec.scf.web.loan;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/loan")
public class LoanController {

	@RequestMapping(path = "/create", method = RequestMethod.GET)
	public String createLoan() {
		return "loans/create";
	}

	@RequestMapping(path = "/create-validate", method = RequestMethod.GET)
	public String createValidateLoan() {
		return "loans/create-validate";
	}
}

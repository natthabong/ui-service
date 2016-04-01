package gec.scf.loan.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/loan")
public class LoanController {

	private static final String CREATE_LOAN_VIEW_NAME = "loans/create";

	@RequestMapping(path = "/create", method = RequestMethod.GET)
	public String createLoan(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CREATE_LOAN_VIEW_NAME.concat(" :: content");
		}
		return CREATE_LOAN_VIEW_NAME;
	}

	@RequestMapping(path = "/create-validate", method = RequestMethod.GET)
	public String createValidateLoan() {
		return "loans/create-validate";
	}
}

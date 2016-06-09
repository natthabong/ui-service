package gec.scf.transaction.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/create-transaction")
public class CreateTransactionController {

	private static final String CREATE_TRANSACTION_VIEW_NAME = "create-transactions/create";
	private static final String VALIDATE_AND_SUBMIT_TRANSACTION_VIEW_NAME = "create-transactions/validate-submit";

	@RequestMapping(method = RequestMethod.GET)
	public String createLoan(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CREATE_TRANSACTION_VIEW_NAME.concat(" :: content");
		}
		return CREATE_TRANSACTION_VIEW_NAME;
	}

	@RequestMapping(path = "/validate-submit", method = RequestMethod.GET)
	public String validateAndSubmitLoan(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VALIDATE_AND_SUBMIT_TRANSACTION_VIEW_NAME.concat(" :: content");
		}
		return VALIDATE_AND_SUBMIT_TRANSACTION_VIEW_NAME;
	}
	
	@RequestMapping(path="/button", method = RequestMethod.GET)
	public String buttonTemplate() {
		return "verify/button".concat(" :: content");
	}
}

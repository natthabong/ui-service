package gec.scf.transaction.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/payment")
public class CreatePaymentController {

	private static final String CREATE_PAYMENT = "transaction/payment/create";
	private static final String CREATE_PAYMENT_WOIP = "transaction/payment/create-woip";
	private static final String VALIDATE_SUBMIT = "transaction/payment/validate-submit";
	private static final String VALIDATE_SUBMIT_WIP = "transaction/payment/validate-submit-with-invoice";
	private static final String VALIDATE_SUBMIT_WOIP = "transaction/payment/validate-submit-without-invoice";

	@RequestMapping(path = "/create", method = RequestMethod.GET)
	public String createLoan(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CREATE_PAYMENT.concat(" :: content");
		}
		return CREATE_PAYMENT;
	}
	
	@RequestMapping(path = "/validate-submit", method = RequestMethod.GET)
	public String validateAndSubmit(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VALIDATE_SUBMIT.concat(" :: content");
		}
		return VALIDATE_SUBMIT;
	}

	@RequestMapping(path = "/create-woip", method = RequestMethod.GET)
	public String createWOIP(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CREATE_PAYMENT_WOIP.concat(" :: content");
		}
		return CREATE_PAYMENT_WOIP;
	}

	@RequestMapping(path = "/validate-submit-with-invoice", method = RequestMethod.GET)
	public String validateAndSubmitWithInvoice(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VALIDATE_SUBMIT_WIP.concat(" :: content");
		}
		return VALIDATE_SUBMIT_WIP;
	}
	
	@RequestMapping(path = "/validate-submit-without-invoice", method = RequestMethod.GET)
	public String validateAndSubmitWithoutInvoice(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VALIDATE_SUBMIT_WOIP.concat(" :: content");
		}
		return VALIDATE_SUBMIT_WOIP;
	}
	

}

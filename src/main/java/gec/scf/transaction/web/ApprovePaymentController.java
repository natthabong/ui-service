package gec.scf.transaction.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/payment-transaction")
public class ApprovePaymentController {
	private String APPROVE_PAYMENT_TRANSACTION = "transaction/payment/approve";

	@RequestMapping(path = "/approve", method = RequestMethod.GET)
	public String approveTransaction(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return APPROVE_PAYMENT_TRANSACTION.concat(" :: content");
		}
		return APPROVE_PAYMENT_TRANSACTION;
	}
}

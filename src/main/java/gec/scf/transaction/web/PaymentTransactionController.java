package gec.scf.transaction.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/payment-transaction")
public class PaymentTransactionController {

	private static final String PAYMENT_TRANSACTION = "transaction/payment/transaction";
	private static final String VIEW_PAYMENT_TRANSACTION = "payment-transaction/view";

	@RequestMapping(path = "/", method = RequestMethod.GET)
	public String paymentTransaction(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return PAYMENT_TRANSACTION.concat(" :: content");
		}
		return PAYMENT_TRANSACTION;
	}
	
	@RequestMapping(path = "/view", method = RequestMethod.GET)
	public String viewPaymentTransaction(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VIEW_PAYMENT_TRANSACTION.concat(" :: content");
		}
		return VIEW_PAYMENT_TRANSACTION;
	}

}

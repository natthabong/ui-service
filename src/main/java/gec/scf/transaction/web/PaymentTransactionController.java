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

	@RequestMapping(path = "/", method = RequestMethod.GET)
	public String paymentTransaction(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return PAYMENT_TRANSACTION.concat(" :: content");
		}
		return PAYMENT_TRANSACTION;
	}

}

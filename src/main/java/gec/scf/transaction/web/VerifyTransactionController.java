package gec.scf.transaction.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/verify-transaction")
public class VerifyTransactionController {
	private static final String VERIFY_TRANSACTION = "verify-transactions/verify";

	@RequestMapping(method = RequestMethod.GET)
	public String listTransaction(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VERIFY_TRANSACTION.concat(" :: content");
		}
		return VERIFY_TRANSACTION;
	}
}

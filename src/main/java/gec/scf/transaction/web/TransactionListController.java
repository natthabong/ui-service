package gec.scf.transaction.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/transaction-list")
public class TransactionListController {
	private static final String TRANSACTION_LIST = "transaction/loan/list";

	@RequestMapping(path = { "/customer-organize", "/partner-organize",
		"/my-organize" },method = RequestMethod.GET)
	public String transactionList(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return TRANSACTION_LIST.concat(" :: content");
		}
		return TRANSACTION_LIST;

	}
}

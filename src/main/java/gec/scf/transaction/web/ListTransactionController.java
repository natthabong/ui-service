package gec.scf.transaction.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/list-transaction")
public class ListTransactionController {
	private static final String LIST_TRANSACTION = "transaction/loan/list";

	@RequestMapping(path = { "/sponsor", "/supplier",
		"/bank" },method = RequestMethod.GET)
	public String listTransaction(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return LIST_TRANSACTION.concat(" :: content");
		}
		return LIST_TRANSACTION;

	}
}

package gec.scf.transaction.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/view-transaction")
public class ViewTransactionController {
	private static final String VIEW_TRANSACTION = "view-transactions/view";

	@RequestMapping(method = RequestMethod.GET)
	public String listTransaction(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VIEW_TRANSACTION.concat(" :: content");
		}
		return VIEW_TRANSACTION;
	}
}

package gec.scf.transaction.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class ViewTransactionController {
	private static final String VIEW_TRANSACTION = "transaction/loan/view";

	@RequestMapping(path = "/view-transaction", method = RequestMethod.GET)
	public String viewTransaction(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VIEW_TRANSACTION.concat(" :: content");
		}
		return VIEW_TRANSACTION;
	}
	
	@RequestMapping(path = "/adjust-status-transaction", method = RequestMethod.GET)
	public String adjustTransaction(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VIEW_TRANSACTION.concat(" :: content");
		}
		return VIEW_TRANSACTION;
	}
}

package gec.scf.monitor.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class TransactionTrackingController {

	private static final String TRANSACTION_TRACKING = "monitor/transaction-tracking";
	private static final String VIEW_TRANSACTION_TRACKING_MESSAGE = "monitor/view-transaction-tracking-message";

	@RequestMapping(path = {"/transaction-tracking"}, method = RequestMethod.GET)
	public String transactionTracking(@RequestHeader("X-Requested-With") String requestedWith) {
					
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return TRANSACTION_TRACKING.concat(" :: content");
		}
		return TRANSACTION_TRACKING;

	}

	@RequestMapping(path = {"/view-transaction-tracking-message"}, method = RequestMethod.GET)
	public String viewTransactionTrackingMessage(@RequestHeader("X-Requested-With") String requestedWith) {
					
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VIEW_TRANSACTION_TRACKING_MESSAGE.concat(" :: content");
		}
		return VIEW_TRANSACTION_TRACKING_MESSAGE;

	}
}

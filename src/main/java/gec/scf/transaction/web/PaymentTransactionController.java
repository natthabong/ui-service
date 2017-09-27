package gec.scf.transaction.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/payment-transaction")
public class PaymentTransactionController {

	private static final String MY_PAYMENT_TRANSACTION = "transaction/payment/my-transaction";
	private static final String PARTNER_PAYMENT_TRANSACTION = "transaction/payment/partner-transaction";
	private static final String ALL_PAYMENT_TRANSACTION = "transaction/payment/all-transaction";

	private static final String CRITERIA_SEARCH_COMPONENT = "transaction/payment/components/criteria-search-component";
	private static final String LIST_TRANSACTION_COMPONENT = "transaction/payment/components/list-transaction-component";
	private static final String RESULT_SUMMARY_COMPONENT = "transaction/payment/components/result-summary-component";

	private static final String VIEW_PAYMENT_TRANSACTION = "transaction/payment/view";
	private static final String VERIFY_PAYMENT_TRANSACTION = "transaction/payment/verify";
	private static final String APPROVE_PAYMENT_TRANSACTION = "transaction/payment/approve";

	@RequestMapping(path = "/partner", method = RequestMethod.GET)
	public String partnerPaymentTransaction(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return PARTNER_PAYMENT_TRANSACTION.concat(" :: content");
		}
		return PARTNER_PAYMENT_TRANSACTION;
	}

	@RequestMapping(path = "/my", method = RequestMethod.GET)
	public String myPaymentTransaction(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return MY_PAYMENT_TRANSACTION.concat(" :: content");
		}
		return MY_PAYMENT_TRANSACTION;
	}

	@RequestMapping(path = "/all", method = RequestMethod.GET)
	public String allPaymentTransaction(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return ALL_PAYMENT_TRANSACTION.concat(" :: content");
		}
		return ALL_PAYMENT_TRANSACTION;
	}

	@RequestMapping(path = "/components/criteria-search", method = RequestMethod.GET)
	public String criteriaSearchComponent(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CRITERIA_SEARCH_COMPONENT.concat(" :: content");
		}
		return CRITERIA_SEARCH_COMPONENT;
	}

	@RequestMapping(path = "/components/list-transaction", method = RequestMethod.GET)
	public String listTransactionComponent(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return LIST_TRANSACTION_COMPONENT.concat(" :: content");
		}
		return LIST_TRANSACTION_COMPONENT;
	}
	
	
	@RequestMapping(path = "/components/result-summary", method = RequestMethod.GET)
	public String resultSummaryComponent(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return RESULT_SUMMARY_COMPONENT.concat(" :: content");
		}
		return RESULT_SUMMARY_COMPONENT;
	}

	@RequestMapping(path = "/view", method = RequestMethod.GET)
	public String viewPaymentTransaction(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VIEW_PAYMENT_TRANSACTION.concat(" :: content");
		}
		return VIEW_PAYMENT_TRANSACTION;
	}

	@RequestMapping(path = "/verify", method = RequestMethod.GET)
	public String verifyTransaction(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VERIFY_PAYMENT_TRANSACTION.concat(" :: content");
		}
		return VERIFY_PAYMENT_TRANSACTION;
	}

	@RequestMapping(path = "/approve", method = RequestMethod.GET)
	public String approveTransaction(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return APPROVE_PAYMENT_TRANSACTION.concat(" :: content");
		}
		return APPROVE_PAYMENT_TRANSACTION;
	}

}

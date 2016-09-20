package gec.scf.dashboard.web;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import gec.scf.util.AjaxUtils;

@Controller
public class DashboardController {
	private static final String APPROVE_TRANSACTION_TODOLIST = "dashboard/approve-transaction-todolist";
	private static final String DASHBOARD_COMPOSITE = "dashboard/composite";
	private static final String CREDIT_INFORMATION = "dashboard/credit-information";
	private static String NEW_DUEDATE_GROUP = "dashboard/newduedate-group";
	private static String CREDIT_INFORMATION_SUMMARY = "dashboard/credit-information-summary";
	private static String TWELVE_MONTHS_CREDIT_MOVEMENT = "dashboard/twelve-months-credit-movement";
	private static String INTERNAL_STEP = "dashboard/internal-step";
	private String DASHBOARD_URL = "dashboard/dashboard-template";
	private static String TRANSACTION_TODOLIST = "dashboard/transaction-todolist";
	private static final String JOURNEY_NEW_DOCUMENT = "dashboard/transaction-journey/new-document";
	private static final String JOURNEY_WAIT_FOR_VERIFY = "dashboard/transaction-journey/wait-for-verify";
	private static final String JOURNEY_WAIT_FOR_APPROVE = "dashboard/transaction-journey/wait-for-approve";
	private static final String JOURNEY_FUTURE_DRAWDOWN = "dashboard/transaction-journey/future-drawdown";
	private static final String JOURNEY_RESULT = "dashboard/transaction-journey/result";

	@RequestMapping(path = "/newduedate-group")
	public String newduedateGroup(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return NEW_DUEDATE_GROUP.concat(" :: content");
		}
		return NEW_DUEDATE_GROUP;
	}

	@RequestMapping(path = "/credit-information")
	public String creditInformation(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CREDIT_INFORMATION.concat(" :: content");
		}
		return CREDIT_INFORMATION;
	}

	@RequestMapping(path = "/credit-information-piechart")
	public String creditInformationSummary(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CREDIT_INFORMATION_SUMMARY.concat(" :: content");
		}
		return CREDIT_INFORMATION_SUMMARY;
	}

	@RequestMapping(path = "/credit-information-12-months")
	public String twelveMonthsCreditMovement(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return TWELVE_MONTHS_CREDIT_MOVEMENT.concat(" :: content");
		}
		return TWELVE_MONTHS_CREDIT_MOVEMENT;
	}

	@RequestMapping(path = "/dashboard-composite")
	public String dashboardComposite(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return DASHBOARD_COMPOSITE.concat(" :: content");
		}
		return DASHBOARD_COMPOSITE;
	}

	@RequestMapping(path = "/internal-step")
	public String internalStep(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return INTERNAL_STEP.concat(" :: content");
		}
		return INTERNAL_STEP;
	}

	@RequestMapping(path = "/transaction-todolist")
	public String transactionTodolist(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return TRANSACTION_TODOLIST.concat(" :: content");
		}
		return TRANSACTION_TODOLIST;
	}

	@RequestMapping(path = "/dashboard")
	public String dashboard(HttpServletRequest req) {
		String requestedWith = req.getHeader("X-Requested-With");
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return DASHBOARD_URL.concat(" :: content");
		}
		return DASHBOARD_URL;
	}

	@RequestMapping(path = "/approve-transaction")
	public String approveTransactionTodoList(
			@RequestHeader("X-requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return APPROVE_TRANSACTION_TODOLIST.concat(" :: content");
		}
		return APPROVE_TRANSACTION_TODOLIST;
	}
	
	@RequestMapping(path="/journey-new-document")
	public String journeyNewDocument(@RequestHeader("X-requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return JOURNEY_NEW_DOCUMENT.concat(" :: content");
		}
		return JOURNEY_NEW_DOCUMENT;
	}
	
	@RequestMapping(path="/journey-wait-for-verify")
	public String journeyWaitForVerify(@RequestHeader("X-requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return JOURNEY_WAIT_FOR_VERIFY.concat(" :: content");
		}
		return JOURNEY_WAIT_FOR_VERIFY;
	}
	
	@RequestMapping(path="/journey-wait-for-approve")
	public String journeyWaitForApprove(@RequestHeader("X-requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return JOURNEY_WAIT_FOR_APPROVE.concat(" :: content");
		}
		return JOURNEY_WAIT_FOR_APPROVE;
	}
	
	@RequestMapping(path="/journey-future-drawdown")
	public String journeyFutureDrawdown(@RequestHeader("X-requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return JOURNEY_FUTURE_DRAWDOWN.concat(" :: content");
		}
		return JOURNEY_FUTURE_DRAWDOWN;
	}
	
	@RequestMapping(path="/journey-result")
	public String journeyResult(@RequestHeader("X-requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return JOURNEY_RESULT.concat(" :: content");
		}
		return JOURNEY_RESULT;
	}

}

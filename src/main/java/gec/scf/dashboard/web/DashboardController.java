package gec.scf.dashboard.web;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import gec.scf.util.AjaxUtils;

@Controller
public class DashboardController {
	private static final String APPROVE_TRANSACTION_TODOLIST = "dashboard/approve-transaction-todolist";
	private static String NEW_DUEDATE_GROUP = "dashboard/newduedate-group";
	private static String CREDIT_INFORMACTION = "dashboard/credit-information";
	private static String INTERNAL_STEP = "dashboard/internal-step";
	private String DASHBOARD_URL = "dashboard/dashboard-template";
	private static String TRANSACTION_TODOLIST = "dashboard/transaction-todolist";
	
	@RequestMapping(path="/newduedate-group")
	public String newduedateGroup(@RequestHeader("X-Requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return NEW_DUEDATE_GROUP.concat(" :: content");
		}
		return NEW_DUEDATE_GROUP;	
	}
	
	@RequestMapping(path="/credit-information")
	public String creditInformation(@RequestHeader("X-Requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CREDIT_INFORMACTION.concat(" :: content");
		}
		return CREDIT_INFORMACTION;	
	}
	
	@RequestMapping(path="/internal-step")
	public String internalStep(@RequestHeader("X-Requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return INTERNAL_STEP.concat(" :: content");
		}
		return INTERNAL_STEP;	
	}
	
	@RequestMapping(path="/transaction-todolist")
	public String transactionTodolist(@RequestHeader("X-Requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return TRANSACTION_TODOLIST.concat(" :: content");
		}
		return TRANSACTION_TODOLIST;	
	}
	
	@RequestMapping(path="/dashboard")
	public String dashboard(HttpServletRequest req){
		String requestedWith = req.getHeader("X-Requested-With");
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return DASHBOARD_URL.concat(" :: content");
		}
		return DASHBOARD_URL;		
	}
	
	@RequestMapping(path="/approve-transaction")
	public String approveTransactionTodoList(@RequestHeader("X-requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return APPROVE_TRANSACTION_TODOLIST.concat(" :: content");
		}
		return APPROVE_TRANSACTION_TODOLIST;
	}

}

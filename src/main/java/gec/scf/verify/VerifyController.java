package gec.scf.verify;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class VerifyController {
	private String CHECKER = "verify/verify_loan_list";
	private String APPROVER = "verify/approve_loan_list";
	private String APPROVER_DETAIL = "verify/approve_loan_detail";
	private String CHECKER_DETAIL = "verify/verify_loan_detail";

	// @PreAuthorize("isAuthenticated()")
	@RequestMapping(path = { "/verify/checker" }, method = RequestMethod.GET)
	public String checkerLoan(HttpServletRequest req) {
		String requestedWith = req.getHeader("X-Requested-With");
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CHECKER.concat(" :: content");
		}
		return CHECKER;
	}
	
	// @PreAuthorize("isAuthenticated()")
	@RequestMapping(path="/verify/checker/detail", method = RequestMethod.GET)
	public String checkerLoanDetail(HttpServletRequest req){
		String requestedWith = req.getHeader("X-Requested-With");
		if(AjaxUtils.isAjaxRequest(requestedWith)){
			return CHECKER_DETAIL.concat(" :: content");
		}
		return CHECKER_DETAIL;
	}
	// @PreAuthorize("isAuthenticated()")
		@RequestMapping(path = { "/verify/approve" }, method = RequestMethod.GET)
		public String approverLoan(HttpServletRequest req) {
			String requestedWith = req.getHeader("X-Requested-With");
			if (AjaxUtils.isAjaxRequest(requestedWith)) {
				return APPROVER.concat(" :: content");
			}
			return APPROVER;
		}
		
		// @PreAuthorize("isAuthenticated()")
		@RequestMapping(path="/verify/approve/detail", method = RequestMethod.GET)
		public String approveLoanDetail(HttpServletRequest req){
			String requestWith = req.getHeader("X-Requested-With");
			if(AjaxUtils.isAjaxRequest(requestWith)){
				return APPROVER_DETAIL.concat(" :: content");
			}			
			return APPROVER_DETAIL;
		}
}

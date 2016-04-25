package gec.scf.web.loan.request;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class LoanReqController {

	private String LOAN_REQUEST_RESULT_LIST = "loan/loan_information_list";
	private String LOAN_REQUEST_RESULT_DETAIL = "loan/loan_information_detail";
	
	//@PreAuthorize("isAuthenticated()")
	@RequestMapping(path="/loan/request/result/list", method = RequestMethod.GET)
	public String requestResultList(HttpServletRequest req){
		String requestedWith = req.getHeader("X-Requested-With");
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return LOAN_REQUEST_RESULT_LIST.concat(" :: content");
		}
		return LOAN_REQUEST_RESULT_LIST;		
	}
	
	//@PreAuthorize("isAuthenticated()")
	@RequestMapping(path="/laon/request/result/detail", method = RequestMethod.GET)
	public String requestResultDetail(HttpServletRequest req){
		String requestedWith = req.getHeader("X-Requested-With");
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return LOAN_REQUEST_RESULT_DETAIL.concat(" :: content");
		}
		return LOAN_REQUEST_RESULT_DETAIL;	
	}
}
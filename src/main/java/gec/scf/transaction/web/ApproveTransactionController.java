package gec.scf.transaction.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/approve-transaction")
public class ApproveTransactionController {
	private String APPROVE_TRANSACTION_VIEW_NAME = "approve-transaction/approve";
	
	@RequestMapping(path="/approve",method = RequestMethod.GET)
	public String approveTransaction(@RequestHeader("X-Requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return APPROVE_TRANSACTION_VIEW_NAME.concat(" :: content");
		}
		return APPROVE_TRANSACTION_VIEW_NAME;		
	}
}

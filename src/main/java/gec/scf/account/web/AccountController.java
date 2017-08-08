package gec.scf.account.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping(path = "/account")
public class AccountController {

	private static final String ACCOUNT_LIST = "account/accounts";

	@RequestMapping(method = RequestMethod.GET)
	public String documentList(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return ACCOUNT_LIST.concat(" :: content");
		}
		return ACCOUNT_LIST;
	}

}

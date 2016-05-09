package gec.scf.user;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class UserController {

	private String BANK_NEW_USER = "user/new";
	
	//@PreAuthorize("isAuthenticated()")
	@RequestMapping(path={"/user"}, method = RequestMethod.GET)
	public String bankNewUser(HttpServletRequest req) {
		String requestedWith = req.getHeader("X-Requested-With");
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return BANK_NEW_USER.concat(" :: content");
		}
		return BANK_NEW_USER;	
	}
}

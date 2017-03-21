package gec.scf.user;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class UserController {

	private String BANK_NEW_USER = "user/new";
	private String NEW_USER = "user/user";
	
	//@PreAuthorize("isAuthenticated()")
//	@RequestMapping(path={"/user"}, method = RequestMethod.GET)
//	public String bankNewUser(HttpServletRequest req) {
//		String requestedWith = req.getHeader("X-Requested-With");
//		if (AjaxUtils.isAjaxRequest(requestedWith)) {
//			return BANK_NEW_USER.concat(" :: content");
//		}
//		return BANK_NEW_USER;	
//	}
	
	@RequestMapping(path={"/user"}, method = RequestMethod.GET)
	public String newUser(HttpServletRequest req) {
		String requestedWith = req.getHeader("X-Requested-With");
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return NEW_USER.concat(" :: content");
		}
		return NEW_USER;	
	}
}

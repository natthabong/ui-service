package gec.scf.user;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class UserController {

	private String USER_NEW = "user/user";

	private String USER_LIST = "user/user-list";

	private String USER_ORGANIZE = "user/dialog-user-organize";

	@RequestMapping(path = { "/user/new" }, method = RequestMethod.GET)
	public String bankNewUser(HttpServletRequest req) {
		String requestedWith = req.getHeader("X-Requested-With");
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return USER_NEW.concat(" :: content");
		}
		return USER_NEW;
	}

	@RequestMapping(path = { "/user" }, method = RequestMethod.GET)
	public String userList(HttpServletRequest req) {
		String requestedWith = req.getHeader("X-Requested-With");
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return USER_LIST.concat(" :: content");
		}
		return USER_LIST;
	}

	@RequestMapping(path = { "/user-organize" }, method = RequestMethod.GET)
	public String userOrganize(HttpServletRequest req) {
		return USER_ORGANIZE;
	}
	
	@RequestMapping(path = { "/user/view"} , method = RequestMethod.GET)
	public String bankViewUser(HttpServletRequest request){
		String requestedWith = request.getHeader("X-Requested-With");
		if(AjaxUtils.isAjaxRequest(requestedWith)){
			return USER_NEW.concat(" :: content");
		}
		return USER_NEW;
	}
}

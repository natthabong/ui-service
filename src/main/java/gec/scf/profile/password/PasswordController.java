package gec.scf.profile.password;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class PasswordController {

	private static final String CHANGE_PASSWORD = "profile/change-password/password";
	private static final String CHANGE_PASSWORD_CONTENT = "profile/change-password/password-contents";
	private static final String CHANGE_PASSWORD_FORCE = "profile/change-password/password-force";;

	@RequestMapping(path = "/change-password", method = RequestMethod.GET)
	public String changePassword(@RequestHeader("X-Requested-With") String requestedWith,
			Model model) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CHANGE_PASSWORD.concat(" :: content");
		}
		return CHANGE_PASSWORD;
	}

	@RequestMapping(path = "/change-password/contents", method = RequestMethod.GET)
	public String contents() {
		return CHANGE_PASSWORD_CONTENT;
	}
	
	@RequestMapping(path = "/change-password/force", method = RequestMethod.GET)
	public String force() {
		return CHANGE_PASSWORD_FORCE;
	}
}

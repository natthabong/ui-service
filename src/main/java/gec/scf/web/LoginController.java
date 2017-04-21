package gec.scf.web;

import java.security.Principal;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import gec.scf.security.domain.BrowserInfo;

@Controller
public class LoginController {

	private String LOGIN_VIEW_NAME = "login";
	private String UNSUPPORT_BROWSER_VIEW_NAME = "unsupport-browser";
	@Value(value = "${scf.ui.header.fixed:true}")
	private boolean fixedHeader;

	public static boolean isAuthenticated() {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();

			return auth.isAuthenticated();
		} catch (Exception e) {
			return false;
		}
	}

	@RequestMapping(path = { "/login" }, method = RequestMethod.GET)
	public ModelAndView login(HttpServletRequest req, BrowserInfo browser, Principal principal) {
		String view = null;
		if ("CHROME".equals(browser.getName()) && (browser.getVersion() >= 40)) {
			view = LOGIN_VIEW_NAME;
		} else if ("IE".equals(browser.getName()) && (browser.getVersion() >= 9)) {
			view = LOGIN_VIEW_NAME;
		} else if ("FIREFOX".equals(browser.getName()) && (browser.getVersion() >=4)) {
			view = LOGIN_VIEW_NAME;
		}else if("EDGE".equals(browser.getName())){
			view = LOGIN_VIEW_NAME;
		}else {
			view = UNSUPPORT_BROWSER_VIEW_NAME;
		}
		return new ModelAndView(view, "fixedHeader", fixedHeader);
	}

}

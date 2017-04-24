package gec.scf.web;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

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
		String searchIE = "IE";
		String searchChrome = "CHROME";
		String searchFirefox = "FIREFOX";
		String searchEdge = "EDGE";
		if ((browser.getName().toLowerCase().indexOf(searchChrome.toLowerCase()) != -1) && (browser.getVersion() >= 53)) {
			view = LOGIN_VIEW_NAME;
		} else if ((browser.getName().toLowerCase().indexOf(searchIE.toLowerCase()) != -1) && (browser.getVersion() >=11)) {
			view = LOGIN_VIEW_NAME;
		} else if ((browser.getName().toLowerCase().indexOf(searchFirefox.toLowerCase()) != -1) && (browser.getVersion() >=45)) {
			view = LOGIN_VIEW_NAME;
		}else if((browser.getName().toLowerCase().indexOf(searchEdge.toLowerCase()) != -1)){
			view = LOGIN_VIEW_NAME;
		}else {
			view = UNSUPPORT_BROWSER_VIEW_NAME;
		}
		
		Map<String, Object> object = new HashMap<String, Object>();
		object.put("fixedHeader", fixedHeader);
		object.put("browserName", browser.getName());
		object.put("browserVersion", browser.getVersion());
		
		return new ModelAndView(view, object);
	}

}

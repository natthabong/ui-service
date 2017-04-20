package gec.scf.web;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class LoginController {

	private String LOGIN_VIEW_NAME = "login";
	private String UNSUPPORT_BROWSER_VIEW_NAME = "unsupport-browser";

	@Value(value = "${scf.ui.header.fixed:true}")
	private boolean fixedHeader;

	@RequestMapping(path = { "/login" }, method = RequestMethod.GET)
	public ModelAndView unsupportBrowser(HttpServletRequest req) {
		String view = null;
		boolean supportBrowser = true;

		if (supportBrowser) {
			view = LOGIN_VIEW_NAME;
		}
		else {
			view = UNSUPPORT_BROWSER_VIEW_NAME;
		}

		return new ModelAndView(view, "fixedHeader", fixedHeader);
	}

}

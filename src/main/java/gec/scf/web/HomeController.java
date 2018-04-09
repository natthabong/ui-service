package gec.scf.web;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import gec.scf.util.AjaxUtils;

@Controller
public class HomeController {

	private String HOME_VIEW_NAME = "index";

	@Value(value = "${scf.ui.header.fixed:true}")
	private boolean fixedHeader;
	
    @Value("${scf.product.version}")
    private String productVersion;

	@PreAuthorize("isAuthenticated()")
	@RequestMapping(path = { "/", "/home" }, method = RequestMethod.GET)
	public ModelAndView home(HttpServletRequest req) {
		String view = null;
		String requestedWith = req.getHeader("X-Requested-With");
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			view = HOME_VIEW_NAME.concat(" :: content");
		} else {
			view = HOME_VIEW_NAME;
		}
		return new ModelAndView(view, "fixedHeader", fixedHeader).addObject("productVersion", productVersion);
	}

}

package gec.scf.web;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class HomeController {
	private String HOME_VIEW_NAME = "index";
	
	@PreAuthorize("isAuthenticated()")
	@RequestMapping(path={"/", "/home"}, method = RequestMethod.GET)
	public String home(HttpServletRequest req) {
		String requestedWith = req.getHeader("X-Requested-With");
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return HOME_VIEW_NAME.concat(" :: content");
		}
		return HOME_VIEW_NAME;	
	}
	
	// Match everything without a suffix (so not a static resource)
//	@RequestMapping(value = "/{[path:[^\\.]*}")
//	public String prefix(){
//		return "forward:/";
//	}
}

package gec.scf.organize.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class OrganizeListController {

	private static final String ORGANIZE_LIST = "/organize/organize-list";

	@RequestMapping(path = "/organize-list", method = RequestMethod.GET)
	public String organizeList(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return ORGANIZE_LIST.concat(" :: content");
		}
		return ORGANIZE_LIST;
	}
}

package gec.scf.organization.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/organize-list")
public class OrganizationListController {

	private static final String ORGANIZE_LIST = "organize/organize-list";
	private static final String ORGANIZE_LIST_ALL_FUNDING = "organize/organize-list-all-funding";

	@RequestMapping(path = { "/sponsor", "/bank" }, method = RequestMethod.GET)
	public String organizeList(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return ORGANIZE_LIST.concat(" :: content");
		}
		return ORGANIZE_LIST;
	}

	@RequestMapping(path = { "/all-funding" }, method = RequestMethod.GET)
	public String organizeListGec(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return ORGANIZE_LIST_ALL_FUNDING.concat(" :: content");
		}
		return ORGANIZE_LIST_ALL_FUNDING;
	}

}

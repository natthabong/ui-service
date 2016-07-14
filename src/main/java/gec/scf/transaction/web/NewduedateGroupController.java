package gec.scf.transaction.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/newduedate-group")
public class NewduedateGroupController {
	private static final String NEWDUEDATE_GROUP = "dashboard/newduedate-group";
	
	@RequestMapping(method = RequestMethod.GET)
	public String newDueDateGroup(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return NEWDUEDATE_GROUP.concat(" :: content");
		}
		return NEWDUEDATE_GROUP;
	}
}

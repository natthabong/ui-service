package gec.scf.role.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class RoleController {

	private String ROLE_LIST = "role/role-list";

	@RequestMapping(path = {"/role"}, method = RequestMethod.GET)
	public String roleList(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return ROLE_LIST.concat(" :: content");
		}
		return ROLE_LIST;

	}
}
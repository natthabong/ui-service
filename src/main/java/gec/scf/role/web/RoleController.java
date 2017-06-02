package gec.scf.role.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class RoleController {

	private String ROLE_LIST = "role/role-list";
	private String NEW_ROLE = "role/role";
	private String EDIT_ROLE = "role/role";
	private String VIEW_ROLE = "role/role";

	@RequestMapping(path = {"/role"}, method = RequestMethod.GET)
	public String roleList(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return ROLE_LIST.concat(" :: content");
		}
		return ROLE_LIST;

	}
	
	@RequestMapping(path = {"/role/new"}, method = RequestMethod.GET)
	public String newRole(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return NEW_ROLE.concat(" :: content");
		}
		return NEW_ROLE;

	}
	
	@RequestMapping(path = {"/role/edit"}, method = RequestMethod.GET)
	public String editRole(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return EDIT_ROLE.concat(" :: content");
		}
		return EDIT_ROLE;

	}
	
	@RequestMapping(path = {"/role/view"}, method = RequestMethod.GET)
	public String viewRole(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VIEW_ROLE.concat(" :: content");
		}
		return VIEW_ROLE;

	}
}
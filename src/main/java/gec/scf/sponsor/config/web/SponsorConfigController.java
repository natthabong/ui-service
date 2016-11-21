package gec.scf.sponsor.config.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping(path = "/sponsor-configuration")
public class SponsorConfigController {

	private static String SPONSOR_CONFIGURATION = "/sponsor-configuration/sponsor-configuration-template";
	private static String PROFILE = "/sponsor-configuration/profile";
	private static String FILE_LAYOUTS = "/sponsor-configuration/file-layouts";
	private static String NEW_FILE_LAYOUT = "/sponsor-configuration/file-layouts/new-file-layout";
	
	private static String CUSTOMER_CODE_GROUPS = "/sponsor-configuration/customer-code-groups";

	@RequestMapping(method = RequestMethod.GET)
	public String sponsorConfiguration(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SPONSOR_CONFIGURATION.concat(" :: content");
		}
		return SPONSOR_CONFIGURATION;
	}

	@RequestMapping(path = "/profile", method = RequestMethod.GET)
	public String getProfile(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return PROFILE.concat(" :: content");
		}
		return PROFILE;
	}

	@RequestMapping(path = "/file-layouts", method = RequestMethod.GET)
	public String fileLayouts(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return FILE_LAYOUTS.concat(" :: content");
		}
		return FILE_LAYOUTS;
	}
	
	@RequestMapping(path = "/file-layouts/new-file-layout", method = RequestMethod.GET)
	public String newFileLayout(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return NEW_FILE_LAYOUT.concat(" :: content");
		}
		return NEW_FILE_LAYOUT;
	}

	@RequestMapping(path = "/customer-code-groups", method = RequestMethod.GET)
	public String customerCodeGroups(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CUSTOMER_CODE_GROUPS.concat(" :: content");
		}
		return CUSTOMER_CODE_GROUPS;
	}
}

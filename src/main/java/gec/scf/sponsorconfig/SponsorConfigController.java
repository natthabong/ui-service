package gec.scf.sponsorconfig;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class SponsorConfigController {
	private static String SPONSOR_CONFIGURATION = "/sponsor-configuration/sponsor-configuration-template";
	private static String FILE_LAYOUTS = "/sponsor-configuration/file-layouts";

	@RequestMapping(path = "/sponsor-configuration", method = RequestMethod.GET)
	public String sponsorConfiguration(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SPONSOR_CONFIGURATION.concat(" :: content");
		}
		return SPONSOR_CONFIGURATION;
	}
	
	@RequestMapping(path = "/file-layouts", method = RequestMethod.GET)
	public String fileLayouts(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return FILE_LAYOUTS.concat(" :: content");
		}
		return FILE_LAYOUTS;
	}
}

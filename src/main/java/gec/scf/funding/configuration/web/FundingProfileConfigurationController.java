package gec.scf.funding.configuration.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping(path = "/funding-configuration")
public class FundingProfileConfigurationController {

	private String SETTING_FUNDING_LOGO = "funding-profile/funding-logo/settings";

	@RequestMapping(path = { "/logo/settings" }, method = RequestMethod.GET)
	public String settingFundingLogo(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTING_FUNDING_LOGO.concat(" :: content");
		}
		return SETTING_FUNDING_LOGO;

	}

}

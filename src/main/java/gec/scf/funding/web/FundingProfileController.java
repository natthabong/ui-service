package gec.scf.funding.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class FundingProfileController {
	
	private String FUNDING_PROFILE_LIST = "funding-profile/funding-profile-list";
	
	@RequestMapping(path = {"/funding-profile"}, method = RequestMethod.GET)
	public String fundingProfileList(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return FUNDING_PROFILE_LIST.concat(" :: content");
		}
		return FUNDING_PROFILE_LIST;

	}

}

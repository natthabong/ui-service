package gec.scf.funding.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class FundingProfileController {
	
	private static final String FUNDING_PROFILE_LIST = "funding-profile/funding-profile-list";
	private static final String FUNDING_PROFILE_CONFIG = "funding-profile/funding-profile-configuration-template";
	private static final String FUNDING_PROFILE_INFO = "funding-profile/funding-profile-info/funding-profile-info";
	private static final String FUNDING_PROFILE_NOTIFICATION = "funding-profile/notification/notification";
	private static final String FUNDING_PROFILE_TXN_METHOD = "funding-profile/advance-approval-transaction-method/advance-approval-transaction-method";
	
	@RequestMapping(path = {"/funding-profile"}, method = RequestMethod.GET)
	public String fundingProfileList(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return FUNDING_PROFILE_LIST.concat(" :: content");
		}
		return FUNDING_PROFILE_LIST;

	}
	
	@RequestMapping(path = {"/funding-profile/configuration"}, method = RequestMethod.GET)
	public String fundingProfileConfiguration(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return FUNDING_PROFILE_CONFIG.concat(" :: content");
		}
		return FUNDING_PROFILE_CONFIG;

	}
	
	@RequestMapping(path = {"/funding-profile/funding-profile-info"}, method = RequestMethod.GET)
	public String fundingProfileInfo(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return FUNDING_PROFILE_INFO.concat(" :: content");
		}
		return FUNDING_PROFILE_INFO;

	}
	
	@RequestMapping(path = {"/funding-profile/notification"}, method = RequestMethod.GET)
	public String fundingProfileNotification(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return FUNDING_PROFILE_NOTIFICATION.concat(" :: content");
		}
		return FUNDING_PROFILE_NOTIFICATION;

	}
	
	@RequestMapping(path = {"/funding-profile/advance-approval-transaction-method"}, method = RequestMethod.GET)
	public String fundingProfileTxnMethod(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return FUNDING_PROFILE_TXN_METHOD.concat(" :: content");
		}
		return FUNDING_PROFILE_TXN_METHOD;

	}

}

package gec.scf.sponsor.config.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping(path = "/sponsor-configuration")
public class SponsorConfigController {

	private static String SPONSOR_CONFIGURATION = "sponsor-configuration/sponsor-configuration-template";
	private static String PROFILE = "sponsor-configuration/profile";
	private static String CHANNEL = "sponsor-configuration/channel-configs";
	private static String FILE_LAYOUTS = "sponsor-configuration/file-layouts";
	private static String SETTING_FILE_LAYOUT = "sponsor-configuration/file-layouts/settings";

	private static String CUSTOMER_CODE_GROUPS = "sponsor-configuration/customer-code-groups";

	private static String DOCUMENT_DISPLAY_CONFIGS = "sponsor-configuration/document-display-configs";
	private static String SETTINGS_DOCUMENT_DISPLAY = "sponsor-configuration/document-displays/settings";

	private static String PAYMENT_DATE_FORMULA = "sponsor-configuration/payment-date-formulas";
	private static String SETTINGS_PAYMENT_DATE_FORMULA = "sponsor-configuration/payment-date-formulas/settings";
	
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

	@RequestMapping(path = "/channel-configs", method = RequestMethod.GET)
	public String channelConfigs(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CHANNEL.concat(" :: content");
		}
		return CHANNEL;
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
			return SETTING_FILE_LAYOUT.concat(" :: content");
		}
		return SETTING_FILE_LAYOUT;
	}

	@RequestMapping(path = "/customer-code-groups", method = RequestMethod.GET)
	public String customerCodeGroups(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CUSTOMER_CODE_GROUPS.concat(" :: content");
		}
		return CUSTOMER_CODE_GROUPS;
	}

	@RequestMapping(path = "/display-document-configs", method = RequestMethod.GET)
	public String documentDisplayConfigs(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return DOCUMENT_DISPLAY_CONFIGS.concat(" :: content");
		}
		return DOCUMENT_DISPLAY_CONFIGS;
	}

	@RequestMapping(path = "/document-display/settings", method = RequestMethod.GET)
	public String settingFileLayout(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_DOCUMENT_DISPLAY.concat(" :: content");
		}
		return SETTINGS_DOCUMENT_DISPLAY;
	}

	@RequestMapping(path = "/payment-date-formulas", method = RequestMethod.GET)
	public String paymentDateFormulaConfigs(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return PAYMENT_DATE_FORMULA.concat(" :: content");
		}
		return PAYMENT_DATE_FORMULA;
	}

	@RequestMapping(path = "/payment-date-formulas/settings", method = RequestMethod.GET)
	public String settingPaymentDateFormula(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_PAYMENT_DATE_FORMULA.concat(" :: content");
		}
		return SETTINGS_PAYMENT_DATE_FORMULA;
	}
}

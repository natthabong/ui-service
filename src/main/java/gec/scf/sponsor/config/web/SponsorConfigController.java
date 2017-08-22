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
	private static String WORKFLOW = "sponsor-configuration/workflow/workflow";
	private static String SETUP_WORKFLOW = "sponsor-configuration/workflow/setup";
	
	private static String AP_IMPORT_CHANNEL = "sponsor-configuration/ap-document-config/channel-configs";
	private static String AP_FILE_LAYOUTS = "sponsor-configuration/ap-document-config/file-layouts";
	
	private static String SETTING_FILE_LAYOUT = "sponsor-configuration/file-layouts/settings";

	private static String AP_CUSTOMER_CODE_GROUPS = "sponsor-configuration/ap-document-config/customer-code-groups";
	private static String SETTINGS_CUSTOMER_CODE_GROUPS = "sponsor-configuration/customer-code-groups/settings";

	private static String AP_DOCUMENT_DISPLAY_CONFIGS = "sponsor-configuration/ap-document-config/document-display-configs";
	private static String AP_CREATE_TRANSACTION_DISPLAY_CONFIGS = "sponsor-configuration/ap-document-config/transaction-display-configs";
	private static String SETTINGS_DOCUMENT_DISPLAY = "sponsor-configuration/document-displays/settings";

	private static String AP_PAYMENT_DATE_FORMULA = "sponsor-configuration/ap-document-config/payment-date-formulas";
	private static String SETTINGS_PAYMENT_DATE_FORMULA = "sponsor-configuration/payment-date-formulas/settings";

	private static String AP_MAPPING_DATA = "sponsor-configuration/ap-document-config/mapping-data";
	
	private static String SETTINGS_ORGANIZE_LOGO = "sponsor-configuration/organize-logo/settings";

	private static String SETTINGS_IMPORT_CHANNEL = "sponsor-configuration/import-channels/settings";
	private static String SETTINGS_IMPORT_CHANNEL_FTP = "sponsor-configuration/import-channels/ftp-settings";

	@RequestMapping(method = RequestMethod.GET)
	public String sponsorConfiguration(@RequestHeader("X-Requested-With") String requestedWith) {
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
	public String channelConfigs(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_IMPORT_CHANNEL.concat(" :: content");
		}
		return AP_IMPORT_CHANNEL;
	}

	@RequestMapping(path = "/file-layouts", method = RequestMethod.GET)
	public String fileLayouts(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_FILE_LAYOUTS.concat(" :: content");
		}
		return AP_FILE_LAYOUTS;
	}

	@RequestMapping(path = "/file-layouts/new-file-layout", method = RequestMethod.GET)
	public String newFileLayout(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTING_FILE_LAYOUT.concat(" :: content");
		}
		return SETTING_FILE_LAYOUT;
	}

	@RequestMapping(path = "/customer-code-groups", method = RequestMethod.GET)
	public String customerCodeGroups(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_CUSTOMER_CODE_GROUPS.concat(" :: content");
		}
		return AP_CUSTOMER_CODE_GROUPS;
	}

	@RequestMapping(path = "/customer-code-groups/settings", method = RequestMethod.GET)
	public String customerCodeGroupsConfig(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_CUSTOMER_CODE_GROUPS.concat(" :: content");
		}
		return SETTINGS_CUSTOMER_CODE_GROUPS;
	}

	@RequestMapping(path = "/display-document-configs", method = RequestMethod.GET)
	public String documentDisplayConfigs(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_DOCUMENT_DISPLAY_CONFIGS.concat(" :: content");
		}
		return AP_DOCUMENT_DISPLAY_CONFIGS;
	}
	
	@RequestMapping(path = "/transaction-document-configs", method = RequestMethod.GET)
	public String transactionDisplayConfigs(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_CREATE_TRANSACTION_DISPLAY_CONFIGS.concat(" :: content");
		}
		return AP_CREATE_TRANSACTION_DISPLAY_CONFIGS;
	}

	@RequestMapping(path = "/document-display/settings", method = RequestMethod.GET)
	public String settingFileLayout(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_DOCUMENT_DISPLAY.concat(" :: content");
		}
		return SETTINGS_DOCUMENT_DISPLAY;
	}

	@RequestMapping(path = "/payment-date-formulas", method = RequestMethod.GET)
	public String paymentDateFormulaConfigs(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_PAYMENT_DATE_FORMULA.concat(" :: content");
		}
		return AP_PAYMENT_DATE_FORMULA;
	}

	@RequestMapping(path = "/payment-date-formulas/settings", method = RequestMethod.GET)
	public String settingPaymentDateFormula(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_PAYMENT_DATE_FORMULA.concat(" :: content");
		}
		return SETTINGS_PAYMENT_DATE_FORMULA;
	}

	@RequestMapping(path = "/mapping-data", method = RequestMethod.GET)
	public String mappingData(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_MAPPING_DATA.concat(" :: content");
		}
		return AP_MAPPING_DATA;
	}
	
	@RequestMapping(path = "/organize-logo/settings", method = RequestMethod.GET)
	public String settingOrganizeLogo(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_ORGANIZE_LOGO.concat(" :: content");
		}
		return SETTINGS_ORGANIZE_LOGO;
	}

	@RequestMapping(path = "/import-channels/settings", method = RequestMethod.GET)
	public String settingImportChannel(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_IMPORT_CHANNEL.concat(" :: content");
		}
		return SETTINGS_IMPORT_CHANNEL;
	}

	@RequestMapping(path = "/import-channels/ftp-settings", method = RequestMethod.GET)
	public String settingImportChannelFTP(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_IMPORT_CHANNEL_FTP.concat(" :: content");
		}
		return SETTINGS_IMPORT_CHANNEL_FTP;
	}

	@RequestMapping(path = "/workflow", method = RequestMethod.GET)
	public String getWorkflow(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return WORKFLOW.concat(" :: content");
		}
		return WORKFLOW;
	}

	@RequestMapping(path = "/workflow/setup", method = RequestMethod.GET)
	public String setupWorkflow(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETUP_WORKFLOW.concat(" :: content");
		}
		return SETUP_WORKFLOW;
	}
}

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

	private static String GENERAL_INFO = "sponsor-configuration/general-info/general-info";

	private static String WORKFLOW = "sponsor-configuration/workflow/workflow";
	private static String SETUP_WORKFLOW = "sponsor-configuration/workflow/setup";

	private static String BUYER_CODE = "sponsor-configuration/ar-document-config/buyer-code";
	private static String PRODUCT_TYPE = "sponsor-configuration/ar-document-config/product-type";

	private static String SUPPLIER_CODE = "sponsor-configuration/ap-document-config/supplier-code";

	private static String AP_IMPORT_CHANNEL = "sponsor-configuration/ap-document-config/channel-configs";
	private static String AR_IMPORT_CHANNEL = "sponsor-configuration/ar-document-config/channel-configs";
	private static String AR_IMPORT_CHANNEL_SETUP = "sponsor-configuration/import-channels/dialog-new-import-channel";

	private static String EXPORT_CHANNEL = "sponsor-configuration/export-channels/list";
	private static String EXPORT_CHANNEL_SETUP = "sponsor-configuration/export-channels/settings";

	private static String AR_IMPORT_LAYOUTS = "sponsor-configuration/ar-document-config/import-layouts";
	private static String AR_EXPORT_LAYOUTS = "sponsor-configuration/ar-document-config/export-layouts";
	// private static String AP_FILE_LAYOUTS =
	// "sponsor-configuration/ap-document-config/file-layouts";
	private static String AP_FILE_LAYOUTS = "sponsor-configuration/ap-document-config/import-layouts";

	private static String SETTING_FILE_LAYOUT = "sponsor-configuration/file-layouts/settings";

	private static String AP_CUSTOMER_CODE_GROUPS = "sponsor-configuration/ap-document-config/customer-code-groups";
	private static String SETTINGS_SUPPLIER_CODE_GROUPS = "sponsor-configuration/customer-code-groups/supplier-code-list/settings";
	private static String SETTINGS_BUYER_CODE_GROUPS = "sponsor-configuration/customer-code-groups/buyer-code-list/settings";

	private static String PRODUCT_TYPE_LIST = "sponsor-configuration/product-types/list";

	private static String AP_DOCUMENT_DISPLAY_CONFIGS = "sponsor-configuration/ap-document-config/document-display-configs";
	private static String AP_CREATE_TRANSACTION_DISPLAY_CONFIGS = "sponsor-configuration/ap-document-config/transaction-display-configs";

	private static String AP_CREATE_TRANSACTION_DISPLAY = "sponsor-configuration/ap-document-config/create-transaction-display";
	private static String AR_CREATE_TRANSACTION_DISPLAY = "sponsor-configuration/ar-document-config/create-transaction-display";
	private static String AR_DOCUMENT_DISPLAY = "sponsor-configuration/ar-document-config/document-display";

	private static String SETTINGS_DOCUMENT_DISPLAY = "sponsor-configuration/displays/document-displays/settings";
	private static String SETTINGS_CREATE_TRANSACTION_DISPLAY = "sponsor-configuration/displays/create-transaction-displays/settings";
	private static String SETUP_DISPLAY_FIELDS = "sponsor-configuration/displays/components/setup-display-fields";
	private static String VIEW_DOCUMENT_DISPLAY = "sponsor-configuration/displays/document-displays/view";
	private static String VIEW_CREATE_TRANSACTION_DISPLAY = "sponsor-configuration/displays/create-transaction-displays/view";

	private static String AP_PAYMENT_DATE_FORMULA = "sponsor-configuration/ap-document-config/payment-date-formulas";
	private static String SETTINGS_PAYMENT_DATE_FORMULA = "sponsor-configuration/payment-date-formulas/settings";

	private static String AP_MAPPING_DATA = "sponsor-configuration/ap-document-config/mapping-data";
	private static String AR_MAPPING_DATA = "sponsor-configuration/ar-document-config/mapping-data";

	private static String SETTINGS_ORGANIZE_LOGO = "sponsor-configuration/organize-logo/settings";

	private static String SETTINGS_IMPORT_CHANNEL = "sponsor-configuration/import-channels/settings";
	private static String SETTINGS_IMPORT_CHANNEL_FTP = "sponsor-configuration/import-channels/ftp-settings";
	private static String SETTINGS_EXPORT_CHANNEL_FTP = "sponsor-configuration/export-channels/ftp-settings";

	private static String EDIT_MAPPING_DATA = "sponsor-configuration/edit-mapping-data";

	private static String MAPPING_DATA_CODE = "sponsor-configuration/mapping-data-code/mapping-data-code";

	private static String SETTINGS_EXPORT_PAYMENT = "sponsor-configuration/export-payments/settings";

	@RequestMapping(path = "/create-transaction-display-configs", method = RequestMethod.GET)
	public String apCreateTransactionDisplay(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_CREATE_TRANSACTION_DISPLAY.concat(" :: content");
		}
		return AP_CREATE_TRANSACTION_DISPLAY;
	}

	@RequestMapping(path = "/ar-channel-configs", method = RequestMethod.GET)
	public String arChannelConfigs(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AR_IMPORT_CHANNEL.concat(" :: content");
		}
		return AR_IMPORT_CHANNEL;
	}

	@RequestMapping(path = "/ar-channel-setup", method = RequestMethod.GET)
	public String arChannelSetup(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AR_IMPORT_CHANNEL_SETUP.concat(" :: content");
		}
		return AR_IMPORT_CHANNEL_SETUP;
	}

	@RequestMapping(path = "/create-payment-display-configs", method = RequestMethod.GET)
	public String arCreateTransactionDisplay(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AR_CREATE_TRANSACTION_DISPLAY.concat(" :: content");
		}
		return AR_CREATE_TRANSACTION_DISPLAY;

	}

	@RequestMapping(path = "/document-display-configs", method = RequestMethod.GET)
	public String arDocumentDisplay(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AR_DOCUMENT_DISPLAY.concat(" :: content");
		}
		return AR_DOCUMENT_DISPLAY;

	}

	@RequestMapping(path = "/ar-file-layouts", method = RequestMethod.GET)
	public String arFileLayouts(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AR_IMPORT_LAYOUTS.concat(" :: content");
		}
		return AR_IMPORT_LAYOUTS;
	}

	@RequestMapping(path = "/ar-mapping-data", method = RequestMethod.GET)
	public String arMappingData(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AR_MAPPING_DATA.concat(" :: content");
		}
		return AR_MAPPING_DATA;
	}

	@RequestMapping(path = "/customer-code-groups/buyer-code-list/settings", method = RequestMethod.GET)
	public String buyerCodeGroupsConfig(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_BUYER_CODE_GROUPS.concat(" :: content");
		}
		return SETTINGS_BUYER_CODE_GROUPS;
	}

	@RequestMapping(path = "/buyer-code-list", method = RequestMethod.GET)
	public String buyerCodeList(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return BUYER_CODE.concat(" :: content");
		}
		return BUYER_CODE;
	}

	@RequestMapping(path = "/channel-configs", method = RequestMethod.GET)
	public String channelConfigs(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_IMPORT_CHANNEL.concat(" :: content");
		}
		return AP_IMPORT_CHANNEL;
	}

	@RequestMapping(path = "/customer-code-groups", method = RequestMethod.GET)
	public String customerCodeGroups(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_CUSTOMER_CODE_GROUPS.concat(" :: content");
		}
		return AP_CUSTOMER_CODE_GROUPS;
	}

	@RequestMapping(path = "/ap-document-display-configs", method = RequestMethod.GET)
	public String documentDisplayConfigs(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_DOCUMENT_DISPLAY_CONFIGS.concat(" :: content");
		}
		return AP_DOCUMENT_DISPLAY_CONFIGS;
	}

	@RequestMapping(path = "/mapping-data/edit", method = RequestMethod.GET)
	public String editMappingData(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return EDIT_MAPPING_DATA.concat(" :: content");
		}
		return EDIT_MAPPING_DATA;

	}

	@RequestMapping(path = "/export-channel-configs", method = RequestMethod.GET)
	public String exportChannel(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return EXPORT_CHANNEL.concat(" :: content");
		}

		return EXPORT_CHANNEL;
	}

	@RequestMapping(path = "/export-channel-configs/settings", method = RequestMethod.GET)
	public String exportChannelSetup(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return EXPORT_CHANNEL_SETUP.concat(" :: content");
		}
		return EXPORT_CHANNEL_SETUP;
	}

	@RequestMapping(path = "/export-layouts", method = RequestMethod.GET)
	public String exportLayouts(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AR_EXPORT_LAYOUTS.concat(" :: content");
		}
		return AR_EXPORT_LAYOUTS;
	}

	@RequestMapping(path = "/file-layouts", method = RequestMethod.GET)
	public String fileLayouts(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_FILE_LAYOUTS.concat(" :: content");
		}
		return AP_FILE_LAYOUTS;
	}

	@RequestMapping(path = "/general-info", method = RequestMethod.GET)
	public String getGeneralInfo(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return GENERAL_INFO.concat(" :: content");
		}
		return GENERAL_INFO;
	}

	@RequestMapping(path = "/profile", method = RequestMethod.GET)
	public String getProfile(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return PROFILE.concat(" :: content");
		}
		return PROFILE;
	}

	@RequestMapping(path = "/workflow", method = RequestMethod.GET)
	public String getWorkflow(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return WORKFLOW.concat(" :: content");
		}
		return WORKFLOW;
	}

	@RequestMapping(path = "/mapping-data", method = RequestMethod.GET)
	public String mappingData(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_MAPPING_DATA.concat(" :: content");
		}
		return AP_MAPPING_DATA;
	}

	@RequestMapping(path = "/file-layouts/new-file-layout", method = RequestMethod.GET)
	public String newFileLayout(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTING_FILE_LAYOUT.concat(" :: content");
		}
		return SETTING_FILE_LAYOUT;
	}

	@RequestMapping(path = "/mapping-data/code/new", method = RequestMethod.GET)
	public String newMappingDataCode(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return MAPPING_DATA_CODE.concat(" :: content");
		}
		return MAPPING_DATA_CODE;

	}

	@RequestMapping(path = "/payment-date-formulas", method = RequestMethod.GET)
	public String paymentDateFormulaConfigs(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_PAYMENT_DATE_FORMULA.concat(" :: content");
		}
		return AP_PAYMENT_DATE_FORMULA;
	}

	@RequestMapping(path = "/product-type-list", method = RequestMethod.GET)
	public String productType(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return PRODUCT_TYPE.concat(" :: content");
		}
		return PRODUCT_TYPE;
	}

	@RequestMapping(path = "/product-types", method = RequestMethod.GET)
	public String productTypeList(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return PRODUCT_TYPE_LIST.concat(" :: content");
		}
		return PRODUCT_TYPE_LIST;
	}

	@RequestMapping(path = "/create-transaction-displays/settings", method = RequestMethod.GET)
	public String settingCreateTransactionDisplay(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_CREATE_TRANSACTION_DISPLAY.concat(" :: content");
		}
		return SETTINGS_CREATE_TRANSACTION_DISPLAY;
	}

	@RequestMapping(path = "/export-channels/ftp-settings", method = RequestMethod.GET)
	public String settingExportChannelFTP(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_EXPORT_CHANNEL_FTP.concat(" :: content");
		}
		return SETTINGS_EXPORT_CHANNEL_FTP;
	}

	@RequestMapping(path = "/document-display/settings", method = RequestMethod.GET)
	public String settingFileLayout(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_DOCUMENT_DISPLAY.concat(" :: content");
		}
		return SETTINGS_DOCUMENT_DISPLAY;
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

	@RequestMapping(path = "/organize-logo/settings", method = RequestMethod.GET)
	public String settingOrganizeLogo(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_ORGANIZE_LOGO.concat(" :: content");
		}
		return SETTINGS_ORGANIZE_LOGO;
	}

	@RequestMapping(path = "/payment-date-formulas/settings", method = RequestMethod.GET)
	public String settingPaymentDateFormula(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_PAYMENT_DATE_FORMULA.concat(" :: content");
		}
		return SETTINGS_PAYMENT_DATE_FORMULA;
	}

	@RequestMapping(path = "/components/setup-display-fields", method = RequestMethod.GET)
	public String setupDisplayFields(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETUP_DISPLAY_FIELDS.concat(" :: content");
		}
		return SETUP_DISPLAY_FIELDS;
	}

	@RequestMapping(path = "/export-payments/settings", method = RequestMethod.GET)
	public String setupExportPayment(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_EXPORT_PAYMENT.concat(" :: content");
		}
		return SETTINGS_EXPORT_PAYMENT;
	}

	@RequestMapping(path = "/workflow/setup", method = RequestMethod.GET)
	public String setupWorkflow(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETUP_WORKFLOW.concat(" :: content");
		}
		return SETUP_WORKFLOW;
	}

	@RequestMapping(method = RequestMethod.GET)
	public String sponsorConfiguration(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SPONSOR_CONFIGURATION.concat(" :: content");
		}
		return SPONSOR_CONFIGURATION;
	}

	@RequestMapping(path = "/customer-code-groups/supplier-code-list/settings", method = RequestMethod.GET)
	public String supplierCodeGroupsConfig(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SETTINGS_SUPPLIER_CODE_GROUPS.concat(" :: content");
		}
		return SETTINGS_SUPPLIER_CODE_GROUPS;
	}

	@RequestMapping(path = "/supplier-code-list", method = RequestMethod.GET)
	public String supplierCodeList(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SUPPLIER_CODE.concat(" :: content");
		}
		return SUPPLIER_CODE;
	}

	@RequestMapping(path = "/transaction-document-configs", method = RequestMethod.GET)
	public String transactionDisplayConfigs(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return AP_CREATE_TRANSACTION_DISPLAY_CONFIGS.concat(" :: content");
		}
		return AP_CREATE_TRANSACTION_DISPLAY_CONFIGS;
	}

	@RequestMapping(path = "/document-display/view", method = RequestMethod.GET)
	public String viewDocumentDisplay(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VIEW_DOCUMENT_DISPLAY.concat(" :: content");
		}
		return VIEW_DOCUMENT_DISPLAY;
	}
	
	@RequestMapping(path = "/create-transaction-displays/view", method = RequestMethod.GET)
	public String viewCreateTransactionDisplay(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VIEW_CREATE_TRANSACTION_DISPLAY.concat(" :: content");
		}
		return VIEW_CREATE_TRANSACTION_DISPLAY;
	}

}
